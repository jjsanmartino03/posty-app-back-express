import express from "express";
import bodyParser from "body-parser";
import { App } from "./app";
import { inject, injectable } from "inversify";
import { IRouter } from "./interfaces/router.interface";
import { CategoryController } from "./infrastructure/controllers/CategoryController";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { UserController } from "./infrastructure/controllers/UserController";
import { PostController } from "./infrastructure/controllers/PostController";
import { CommentController } from "./infrastructure/controllers/CommentController";
import { AuthenticationService } from "./infrastructure/Services/AuthenticationService";
import passport from "passport";
import session from "express-session";
import { User } from "./domain/Entities/User";
import { Strategy } from "passport-local";
import { IUserRepository } from "./domain/Repositories/IUserRepository";
import TYPES from "./types";
import { Request, Response } from "express";

@injectable()
export class Router implements IRouter {
  private appInstance: express.Application;
  private DBconnection: Connection;
  private authenticationService: AuthenticationService;
  // Todos los controller son dependencias del router, que se inyectan en el constructor
  private categoryController: CategoryController;
  private userController: UserController;
  private postController: PostController;
  private commentController: CommentController;
  private userRepository: IUserRepository;

  // Traer todas las dependencies a través de inversify
  constructor(
    @inject(CategoryController) categoryController: CategoryController,
    @inject(UserController) userController: UserController,
    @inject(PostController) postController: PostController,
    @inject(CommentController) commentController: CommentController,
    @inject(AuthenticationService) authenticationService: AuthenticationService,
    @inject(TYPES.IUserRepository) userRepository: IUserRepository
  ) {
    this.categoryController = categoryController;
    this.userController = userController;
    this.postController = postController;
    this.commentController = commentController;
    this.authenticationService = authenticationService;
    this.userRepository = userRepository;
  }

  public init(app: App) {
    this.appInstance = app.getAppInstance();

    this.initializeMiddlewares();
    // Crear la conexión con la base de datos
    this.initializeDBConnection();
    // Setear las diversas rutas
    this.intializeRoutes();
  }

  private async initializeMiddlewares() {
    this.appInstance.use(bodyParser.urlencoded({ extended: true }));
    this.appInstance.use(bodyParser.json());
    this.appInstance.use(express.static("public"));
    this.appInstance.use(
      session({
        secret: process.env.SESSION_SECRET || "keyboard cat",
        resave: false,
        saveUninitialized: false,
      })
    );
    this.authenticationService.setup(this.appInstance);
  }

  private intializeRoutes() {
    // authentication ---------------
    this.appInstance
      .route("/login")
      .post(
        passport.authenticate("local-login", {
          failureRedirect: "/login",
          successRedirect: "/",
        })
      )
      .get(this.userController.loginForm);

    this.appInstance
      .route("/logout")
      .get(this.authenticationService.userLoggedIn, this.userController.logout);
    // User routes -----------------
    this.appInstance
      .route("/signup")
      .get(this.userController.signupForm)
      .post(
        passport.authenticate("local-signup", {
          successRedirect: "/", // redirect to the secure profile section
          failureRedirect: "/signup", // redirect back to the signup page if there is an error
        })
      );

    this.appInstance
      .route("/users")
      .get(this.authenticationService.userLoggedIn, this.userController.index);

    this.appInstance
      .route("/users/:username")
      .get(this.userController.getUserByUsername)
      .put(this.userController.update);
    //.delete(this.userController.destroy);

    // Post routes ---------------
    this.appInstance
      .route("/posts")
      .post(this.authenticationService.userLoggedIn, this.postController.create)
      .get(
        this.authenticationService.userLoggedIn,
        this.postController.postsForm
      );

    this.appInstance
      .route("/")
      .get(this.authenticationService.userLoggedIn, this.postController.index);

    this.appInstance
      .route("/posts/:id")
      .get(this.authenticationService.userLoggedIn, this.postController.show)
      .put(this.authenticationService.userLoggedIn, this.postController.update);

    this.appInstance
      .route("/posts/:id/likes")
      .post(this.postController.addLike)
      .delete(this.postController.removeLike);

    // Comment routes ---------------
    this.appInstance
      .route("/posts/:post_id/comments/")
      .get(this.commentController.getCommentsOfPost)
      .post(this.commentController.createComment);
    this.appInstance
      .route("/posts/:post_id/comments/:id/likes")
      .post(this.commentController.addLike)
      .delete(this.commentController.removeLike);

    // Category routes ---------------
    this.appInstance
      .route("/categories")
      .get(
        this.authenticationService.userLoggedIn,
        this.categoryController.categoryForm
      )
      .post(
        this.authenticationService.userLoggedIn,
        this.categoryController.create
      );
  }
  private async initializeDBConnection() {
    // No le paso parámetros porque detecta automáticamente la configuración del archivo ormconfig.json
    // @ts-ignore
    const databaseConfig = {
      name: "default",
      type: "mysql",
      host: process.env.MYSQL_HOST || "mysql",
      port: process.env.MYSQL_PORT || "3306",
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: ["src/domain/Entities/*.ts"],
    } as ConnectionOptions;

    this.DBconnection = await createConnection(databaseConfig);
    if (this.DBconnection === undefined) {
      throw new Error("Error connecting to database");
    }
    await this.DBconnection.synchronize();
  }
}

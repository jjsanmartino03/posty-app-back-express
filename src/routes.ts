import * as express from "express";
import { ExampleController } from "./infrastructure/controllers/ExampleController";
import bodyParser from "body-parser";
import { App } from "./app";
import { inject, injectable } from "inversify";
import { IRouter } from "./interfaces/router.interface";
import { CategoryController } from "./infrastructure/controllers/CategoryController";
import { createConnection, Connection } from "typeorm";
import { UserController } from "./infrastructure/controllers/UserController";
import { PostController } from "./infrastructure/controllers/PostController";
import { CommentController } from "./infrastructure/controllers/CommentController";

@injectable()
export class Router implements IRouter {
  private appInstance: express.Application;
  private DBconnection: Connection;
  // Todos los controller son dependencias del router, que se inyectan en el constructor
  private exampleController: ExampleController;
  private categoryController: CategoryController;
  private userController: UserController;
  private postController: PostController;
  private commentController: CommentController;

  // Traer todas las dependencies a través de inversify
  constructor(
    @inject(ExampleController) exampleController: ExampleController,
    @inject(CategoryController) categoryController: CategoryController,
    @inject(UserController) userController: UserController,
    @inject(PostController) postController: PostController,
    @inject(CommentController) commentController: CommentController
  ) {
    this.categoryController = categoryController;
    this.exampleController = exampleController;
    this.userController = userController;
    this.postController = postController;
    this.commentController = commentController;
  }

  public init(app: App) {
    this.appInstance = app.getAppInstance();

    this.initializeMiddlewares();
    // Setear las diversas rutas
    this.intializeRoutes();
    // Crear la conexión con la base de datos
    this.initializeDBConnection();
  }

  private initializeMiddlewares() {
    this.appInstance.use(bodyParser.urlencoded({ extended: true }));
    this.appInstance.use(bodyParser.json());
  }

  private intializeRoutes() {
    // User routes -----------------

    this.appInstance
      .route("/users")
      .get(this.userController.index)
      .post(this.userController.create);

    this.appInstance
      .route("/users/:username")
      .get(this.userController.getUserByUsername)
      .put(this.userController.update)
      .delete(this.userController.destroy);

    // Post routes ---------------
    this.appInstance
      .route("/posts")
      .get(this.postController.index)
      .post(this.postController.create);

    this.appInstance
      .route("/posts/:id")
      .get(this.postController.show)
      .put(this.postController.update);

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
      .get(this.categoryController.getAll)
      .post(this.categoryController.create);

    this.appInstance
      .route("/examples")
      .get(this.exampleController.getAll.bind(this.exampleController))
      .post(this.exampleController.create.bind(this.exampleController));
  }
  private async initializeDBConnection() {
    // No le paso parámetros porque detecta automáticamente la configuración del archivo ormconfig.json
    this.DBconnection = await createConnection();
    if (this.DBconnection === undefined) {
      throw new Error("Error connecting to database");
    }
    await this.DBconnection.synchronize();
  }
}

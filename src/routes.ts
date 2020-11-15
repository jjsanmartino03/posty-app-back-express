import * as express from "express";
import { ExampleController } from "./controllers/ExampleController";
import bodyParser from "body-parser";
import { App } from "./app";
import { inject, injectable } from "inversify";
import { IRouter } from "./interfaces/router.interface";
import { CategoryController } from "./controllers/CategoryController";
import { createConnection, Connection } from "typeorm";
import { UserController } from "./controllers/UserController";
import { PostController } from "./controllers/PostController";

@injectable()
export class Router implements IRouter {
  private appInstance: express.Application;
  private exampleController: ExampleController;
  private categoryController: CategoryController;
  private userController: UserController;
  private postController: PostController;

  constructor(
    @inject(ExampleController) exampleController: ExampleController,
    @inject(CategoryController) categoryController: CategoryController,
    @inject(UserController) userController: UserController,
    @inject(PostController) postController: PostController
  ) {
    this.categoryController = categoryController;
    this.exampleController = exampleController;
    this.userController = userController;
    this.postController = postController;
  }

  public init(app: App) {
    this.appInstance = app.getAppInstance();

    this.initializeMiddlewares();
    this.intializeRoutes();
    this.initializeDBConnection();
  }

  private initializeMiddlewares() {
    this.appInstance.use(bodyParser.urlencoded({ extended: true }));
    this.appInstance.use(bodyParser.json());
  }

  private intializeRoutes() {
    this.appInstance
      .route("/")
      .get((request: express.Request, response: express.Response) => {
        response.send("Welcome to the node + typescript example");
      });

    // User routes -----------------

    this.appInstance
      .route("/users")
      .get(this.userController.getAll)
      .post(this.userController.saveUser);

    this.appInstance
      .route("/users/:username")
      .get(this.userController.getUserByUsername)
      .put(this.userController.updateUser);

    // Post routes ---------------
    this.appInstance
      .route("/posts")
      .get(this.postController.getAll)
      .post(this.postController.savePost);

    this.appInstance
      .route("/posts/:id")
      .get(this.postController.getPost)
      .put(this.postController.updatePost);

    this.appInstance
      .route("/examples")
      .get(this.exampleController.getAll.bind(this.exampleController))
      .post(this.exampleController.create.bind(this.exampleController));

    this.appInstance
      .route("/categories")
      .post(this.categoryController.create.bind(this.categoryController))
      .get(this.categoryController.showForm.bind(this.categoryController));

    this.appInstance
      .route("/examples/form")
      .get(this.exampleController.showExampleForm.bind(this.exampleController));
  }
  private async initializeDBConnection() {
    // No le paso parámetros porque detecta automáticamente la configuración del archivo ormconfig.json
    const connection: Connection = await createConnection();
    if (connection === undefined) {
      throw new Error("Error connecting to database");
    }
    await connection.synchronize();
  }
}

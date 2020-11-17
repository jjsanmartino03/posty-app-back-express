import {Container} from "inversify";
import {Router} from "./routes";
import {App} from "./app";
import {ExampleController} from "./infrastructure/controllers/ExampleController";
import {ExampleRepository} from "./domain/Repositories/ExampleRepository";
import TYPES from "./types";
import {TypeORMExampleRepository} from "./infrastructure/Persistence/TypeORMExampleRepository";
import {CategoryController} from "./infrastructure/controllers/CategoryController";
import {UserController} from './infrastructure/controllers/UserController';
import {PostController} from './infrastructure/controllers/PostController';
import {CommentController} from './infrastructure/controllers/CommentController';

const DIContainer = new Container();

// Services
DIContainer.bind<App>(App).toSelf();
DIContainer.bind<Router>(Router).toSelf();

// Repositories
DIContainer.bind<ExampleRepository>(TYPES.ExampleRepository).to(TypeORMExampleRepository);

// Controllers
DIContainer.bind<CategoryController>(CategoryController).toSelf();
DIContainer.bind<ExampleController>(ExampleController).toSelf();
DIContainer.bind<UserController>(UserController).toSelf();
DIContainer.bind<PostController>(PostController).toSelf();
DIContainer.bind<CommentController>(CommentController).toSelf();

export default DIContainer;

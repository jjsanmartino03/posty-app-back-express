import {Container} from "inversify";
import {Router} from "./routes";
import {App} from "./app";
import {ExampleController} from "./controllers/ExampleController";
import {ExampleRepository} from "./domain/Repositories/ExampleRepository";
import TYPES from "./types";
import {TypeORMExampleRepository} from "./infrastructure/Persistence/TypeORMExampleRepository";
import {CategoryController} from "./controllers/CategoryController";
import {UserController} from './controllers/UserController';

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

export default DIContainer;

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
import {IUserRepository} from './domain/Repositories/IUserRepository';
import {TypeORMUserRepository} from './infrastructure/Persistence/TypeORMUserRepository';
import {UserService} from './application/Services/UserService';
import {IPostRepository} from './domain/Repositories/IPostRepository';
import {TypeORMPostRepository} from './infrastructure/Persistence/TypeORMPostRepository';
import {PostService} from './application/Services/PostService';
import {CommentService} from './application/Services/CommentService';
import {ICommentRepository} from './domain/Repositories/ICommentRepository';
import {TypeORMCommentRepository} from './infrastructure/Persistence/TypeORMCommentRepository';
import {TypeORMCategoryRepository} from './infrastructure/Persistence/TypeORMCategoryRepository';
import {ICategoryRepository} from './domain/Repositories/ICategoryRepository';
import {CategoryService} from './application/Services/CategoryService';
import {AuthenticationService} from './infrastructure/Services/AuthenticationService';

const DIContainer = new Container();

// Services
DIContainer.bind<App>(App).toSelf().inSingletonScope();
DIContainer.bind<Router>(Router).toSelf();
DIContainer.bind<UserService>(UserService).toSelf();
DIContainer.bind<PostService>(PostService).toSelf();
DIContainer.bind<CommentService>(CommentService).toSelf();
DIContainer.bind<CategoryService>(CategoryService).toSelf();

DIContainer.bind<AuthenticationService>(AuthenticationService).toSelf();

// Repositories
DIContainer.bind<ExampleRepository>(TYPES.ExampleRepository).to(TypeORMExampleRepository);
DIContainer.bind<IUserRepository>(TYPES.IUserRepository).to(TypeORMUserRepository);
DIContainer.bind<IPostRepository>(TYPES.IPostRepository).to(TypeORMPostRepository);
DIContainer.bind<ICommentRepository>(TYPES.ICommentRepository).to(TypeORMCommentRepository);
DIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(TypeORMCategoryRepository);

// Controllers
DIContainer.bind<CategoryController>(CategoryController).toSelf();
DIContainer.bind<ExampleController>(ExampleController).toSelf();
DIContainer.bind<UserController>(UserController).toSelf();
DIContainer.bind<PostController>(PostController).toSelf();
DIContainer.bind<CommentController>(CommentController).toSelf();

export default DIContainer;

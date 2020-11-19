import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { User } from "../../domain/Entities/User";
import { Connection, getConnection } from "typeorm";
import { UserService } from "../../application/Services/UserService";
import TYPES from "../../types";
import { IUserRepository } from "../../domain/Repositories/IUserRepository";
import {TwingViewRenderService} from '../Services/TwingViewRenderService';
import {log} from 'util';

@injectable()
export class UserController {
  private userService: UserService;
  private userRepository: IUserRepository;
  private viewRenderService: TwingViewRenderService;
  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(UserService) userService: UserService,
    @inject(TwingViewRenderService) viewRenderService: TwingViewRenderService,
  ) {
    this.userRepository = userRepository;
    this.userService = userService;
    this.viewRenderService = viewRenderService;
  }
  public loginForm = async (request:Request, response:Response) => {
    const loginForm: string = await this.viewRenderService.login();
    response.end(loginForm);
  }
  public signupForm = async (request:Request, response: Response) => {
    const signupForm: string = await this.viewRenderService.signup();
    response.end(signupForm);
  }
  public logout = async (request:Request, response: Response)=>{
    request.logout();
    response.redirect("/login");
  }
  // Devolver todos los usuarios
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const users: User[] = await this.userRepository.findAll(["posts"]);

    const serializedUsers = users.map(user=>({
      ...user,
      posts: undefined,
      total_posts: user.posts.length,
    }));

    const userIndex: string = await this.viewRenderService.userIndex(request.user, serializedUsers);
    response.end(userIndex);
  };
  // crear un usuario
  public create = async (request: Request, response: Response) => {
    const payload = request.body;
    // crear un usuario vacio
    const user: User = await this.userService.create(
      payload.username,
      payload.email,
      payload.password
    );

    // Adaptar el usuario según como lo quiero mostrar en la response
    const serializedUser = {
      ...user,
      deleted_at: undefined,
      password: undefined,
    };

    // Usuario creado con éxito
    response.redirect("/login", )
  };
  // traer usuario con el username
  public getUserByUsername = async (request: Request, response: Response) => {
    const username: string = request.params.username;
    // obtener el usuario de la base de datos
    const user: User = await this.userRepository.findByUsername(username, [
      "posts",
    ]);

    response.json(user);
  };
  // modificar usuario existente
  public update = async (request: Request, response: Response) => {
    const payload = request.body;
    const username: string = request.params.username;

    const user: User = await this.userService.update(
      username,
      payload.username,
      payload.email,
      payload.password
    );

    response.send({ message: "Updated", user }).status(201);
  };
  // Por ahora no se pueden borrar
  /*public destroy = async (request: Request, response: Response) => {
    const username: string = request.params.username;
    const user = await this.userService.destroy(username);
    response.send({ message: "User Deleted", user });
  };*/
}

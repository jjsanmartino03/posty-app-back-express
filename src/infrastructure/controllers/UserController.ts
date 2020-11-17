import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { User } from "../../domain/Entities/User";
import { Connection, getConnection } from "typeorm";
import { UserService } from "../../application/Services/UserService";
import TYPES from "../../types";
import { IUserRepository } from "../../domain/Repositories/IUserRepository";

@injectable()
export class UserController {
  private userService: UserService;
  private userRepository: IUserRepository;
  constructor(
    @inject(TYPES.IUserRepository) userRepository: IUserRepository,
    @inject(UserService) userService: UserService
  ) {
    this.userRepository = userRepository;
    this.userService = userService;
  }
  // Devolver todos los usuarios
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const users: User[] = await this.userRepository.findAll();

    response.json(users);
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
    response
      .send({ message: "User created", user: serializedUser })
      .status(201);
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

import { Request, Response } from "express";
import { injectable } from "inversify";
import { User } from "../../domain/Entities/User";
import { Connection, getConnection } from "typeorm";

@injectable()
export class UserController {
  // Devolver todos los usuarios
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const users: User[] = await User.find();

    response.json(users);
  };
  // crear un usuario
  public create = async (request: Request, response: Response) => {
    const payload = request.body;
    // crear un usuario vacio
    const user: User = new User();

    user.username = payload.username;
    user.email = payload.email;
    user.password = payload.password;

    await user.save();

    const serializedUser = {
      ...user,
      deleted_at:undefined,
      password:undefined,
    }
    // Usuario creado con éxito
    response.send({ message: "User created", user:serializedUser }).status(201);
  };
  // traer usuario con el username
  public getUserByUsername = async (request: Request, response: Response) => {
    const username: string = request.params.username;
    // obtener el usuario de la base de datos
    const user: User = await User.findOneOrFail({ username: username }, {relations:["posts"]});

    response.json(user);
  };
  // modificar usuario existente
  public update = async (request: Request, response: Response) => {
    const payload = request.body;
    const username: string = request.params.username;
    const user: User = await User.findOneOrFail({
      where: { username: username },
    });
    // cambiar sus propiedades
    user.username = payload.username;
    user.password = payload.password;
    user.email = payload.email;
    // guardar los cambios
    await user.save();

    response.send({ message: "Updated", user }).status(201);
  };
}

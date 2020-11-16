import { Request, Response } from "express";
import { injectable } from "inversify";
import { User } from "../domain/Entities/User";
import { Connection, getConnection } from "typeorm";

@injectable()
export class UserController {
  public getAll = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const users: User[] = await User.find();

    response.json(users);
  };

  public saveUser = async (request: Request, response: Response) => {
    const payload = request.body;
    const user: User = new User();

    user.username = payload.username;
    user.email = payload.email;
    user.password = payload.password;

    await user.save();

    response.send({ message: "Created", user }).status(201);
  };

  public getUserByUsername = async (request: Request, response: Response) => {
    const username: string = request.params.username;

    const user: User = await User.findOneOrFail({ username: username }, {relations:["posts"]});

    response.json(user);
  };

  public updateUser = async (request: Request, response: Response) => {
    const payload = request.body;
    const username: string = request.params.username;
    const user: User = await User.findOneOrFail({
      where: { username: username },
    });

    user.username = payload.username;
    user.password = payload.password;
    user.email = payload.email;

    await user.save();

    response.send({ message: "Updated", user }).status(201);
  };
}

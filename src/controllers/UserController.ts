import { Request, Response } from "express";
import { injectable } from "inversify";
import { User } from "../domain/Entities/User";

@injectable()
export class UserController {
  public getAll = async (
    request: Request,
    response: Response
  ):Promise<void> => {
    const users: User[] = await User.find();

    response.json(users);
  };
}

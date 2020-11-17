import { IUserRepository } from "../../domain/Repositories/IUserRepository";
import { User } from "../../domain/Entities/User";
import { injectable } from "inversify";

@injectable()
export class TypeORMUserRepository implements IUserRepository {
  public async findAll(relations: string[] = []): Promise<User[]> {
    return await User.find({ relations: relations });
  }
  public async save(user: User): Promise<void> {
    await user.save();
  }
  public async findByUsername(
    username: string,
    relations: string[] = []
  ): Promise<User> {
    return User.findOneOrFail({ username: username }, { relations: relations });
  }
  public async softDelete(user:User){
    await user.softRemove();
  }
}

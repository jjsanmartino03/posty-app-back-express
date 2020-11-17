import {IUserRepository} from '../../domain/Repositories/IUserRepository';
import {User} from '../../domain/Entities/User';
import {injectable} from 'inversify';

@injectable()
export class TypeORMUserRepository implements IUserRepository {
  public async findAll(relations: string[] = []): Promise<User[]> {
      return await User.find({relations:relations});
  }
}
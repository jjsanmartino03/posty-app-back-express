import {User} from '../Entities/User';

export interface IUserRepository{
    findAll(relations?:string[]): Promise<User[]>;
    save(user:User): Promise<void>;
    findByUsername(username:string, relations?:string[]):Promise<User>;
    softDelete(user:User):Promise<void>;
}
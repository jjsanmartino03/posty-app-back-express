import {User} from '../Entities/User';

export interface IUserRepository{
    findAll(relations?:string[]): Promise<User[]>;
}
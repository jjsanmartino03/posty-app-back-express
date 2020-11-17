import {inject, injectable} from 'inversify';
import {IUserRepository} from '../../domain/Repositories/IUserRepository';
import TYPES from '../../types';

@injectable()
export class UserService{
    private userRepository: IUserRepository;
    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }


}
import {inject, injectable} from 'inversify';
import {IUserRepository} from '../../domain/Repositories/IUserRepository';
import TYPES from '../../types';
import {User} from '../../domain/Entities/User';
import {getConnection} from 'typeorm';
import {Post} from '../../domain/Entities/Post';

@injectable()
export class UserService{
    private userRepository: IUserRepository;
    constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    public async create(username:string, email:string, password:string){
        const user: User = new User();

        user.username = username;
        user.email = email;
        user.password = password;

        await this.userRepository.save(user);

        return user;
    }
    public async update(username:string, newUsername:string, newEmail:string, newPassword:string){
        const user: User = await this.userRepository.findByUsername(username);
        // cambiar sus propiedades
        user.username = newUsername;
        user.password = newPassword;
        user.email = newEmail;
        // guardar los cambios
        await this.userRepository.save(user);
        return user;
    }
    // Por ahora no se puede borrar un usuario
    /*public async destroy(username:string):Promise<User>{
        const user: User = await this.userRepository.findByUsername(username);

        await this.userRepository.softDelete(user);

        return user;
    }*/


}
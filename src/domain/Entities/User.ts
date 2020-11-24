import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import {Post} from './Post';
import {Comment} from './Comment';
import {AbstractCommonEntity} from './AbstractCommonEntity';
import {compareSync, genSaltSync, hashSync} from 'bcrypt';

@Entity()
export class User extends AbstractCommonEntity {
    public generateHash = (password:string):string => {
        return hashSync(password, genSaltSync(8));
    }
    public checkPassword = (password:string):boolean => {
        return compareSync(password, this.password);
    }
    // Columna UNIQUE
    @Column({unique:true})
    public username:string;

    @Column({unique:true})
    public email:string;

    @Column()
    public password:string;

    @OneToMany(()=> Post, post=> post.author, {cascade:true})
    public posts:Post[];

    @OneToMany(()=> Comment, comment=> comment.author, {cascade:true})
    public comments: Comment[];
}

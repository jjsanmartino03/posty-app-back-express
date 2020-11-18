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

@Entity()
export class User extends AbstractCommonEntity {
    // Columna UNIQUE
    @Column({unique:true})
    public username:string;

    @Column()
    public email:string;

    @Column()
    public password:string;

    @OneToMany(()=> Post, post=> post.author, {cascade:true})
    public posts:Post[];

    @OneToMany(()=> Comment, comment=> comment.author, {cascade:true})
    public comments: Comment[];
}

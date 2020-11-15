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

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @Column({unique:true})
    public username:string;

    @Column()
    public email:string;

    @Column()
    public password:string;

    @OneToMany(()=> Post, post=> post.author)
    public posts:Post[];

    @OneToMany(()=> Comment, comment=> comment.author)
    public comments: Comment[];

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true})
    public deleted_at:Date;
}

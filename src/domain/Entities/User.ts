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
    @PrimaryGeneratedColumn()
    public id:number;

    @Column({unique:true})
    public username:string;

    @Column()
    public email:string;

    @Column({select:false})
    public password:string;

    @OneToMany(()=> Post, post=> post.author, {cascade:true})
    public posts:Post[];

    @OneToMany(()=> Comment, comment=> comment.author, {cascade:true})
    public comments: Comment[];

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true, select:false})
    public deleted_at:Date;
}

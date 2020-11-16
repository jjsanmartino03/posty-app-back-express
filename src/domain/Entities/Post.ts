import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Category } from "./Category";
import {AbstractLikeableContentEntity} from './AbstractLikeableContentEntity';

@Entity()
export class Post extends AbstractLikeableContentEntity {
  @Column()
  public title: string;

  @OneToMany(() => Comment, (comment) => comment.post, {cascade:true})
  public comments: Comment[];

  @ManyToMany(() => Category, {cascade:true})
  @JoinTable()
  public categories: Category[];



}

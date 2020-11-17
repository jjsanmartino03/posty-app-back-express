import { Entity, ManyToOne } from "typeorm";
import { Post } from "./Post";
import {AbstractLikeableContentEntity} from './AbstractLikeableContentEntity';

@Entity()
export class Comment extends AbstractLikeableContentEntity {
  // relación many to one con Post
  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;
}

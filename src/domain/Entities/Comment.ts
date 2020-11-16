import { Entity, ManyToOne } from "typeorm";
import { Post } from "./Post";
import {AbstractLikeableContentEntity} from './AbstractLikeableContentEntity';

@Entity()
export class Comment extends AbstractLikeableContentEntity {
  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;
}

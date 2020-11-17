import { Comment } from "../Entities/Comment";
import { Post } from "../Entities/Post";

export interface ICommentRepository {
  findAllCommentsOfPost(postId: number, relations?: string[]): Promise<Comment[]>;
  save(comment:Comment):Promise<void>;
  addLikeToComment(commentId: number, giverId: number): Promise<void>;
  removeLikeToComment(commentId: number, giverId: number): Promise<void>;
}

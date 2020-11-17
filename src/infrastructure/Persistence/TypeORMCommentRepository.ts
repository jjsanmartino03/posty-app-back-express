import { ICommentRepository } from "../../domain/Repositories/ICommentRepository";
import { injectable } from "inversify";
import { getConnection } from "typeorm";
import { Post } from "../../domain/Entities/Post";
import { Comment } from "../../domain/Entities/Comment";

@injectable()
export class TypeORMCommentRepository implements ICommentRepository {
  public async findAllCommentsOfPost(
    postId: number,
    relations: string[] = []
  ): Promise<Comment[]> {
    const post: Post = await Post.findOneOrFail(postId);
    const comments = await Comment.find({
      where: { post: post },
      relations: relations,
    });

    return comments;
  }
  public async addLikeToComment(
    commentId: number,
    giverId: number
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .relation(Comment, "likers")
      .of(commentId)
      .add(giverId);
  }
  public async removeLikeToComment(
    commentId: number,
    giverId: number
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .relation(Comment, "likers")
      .of(commentId)
      .add(giverId);
  }
  public async save(comment: Comment) {
    await comment.save();
  }
}

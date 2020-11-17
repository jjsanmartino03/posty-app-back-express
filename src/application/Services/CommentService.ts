import { inject, injectable } from "inversify";
import { Comment } from "../../domain/Entities/Comment";
import { Post } from "../../domain/Entities/Post";
import { User } from "../../domain/Entities/User";
import { ICommentRepository } from "../../domain/Repositories/ICommentRepository";
import TYPES from "../../types";

@injectable()
export class CommentService {
  private commentRepository: ICommentRepository;
  constructor(
    @inject(TYPES.ICommentRepository) commentRepository: ICommentRepository
  ) {
    this.commentRepository = commentRepository;
  }
  public async create(
    postId: number,
    authorId: number,
    content: string
  ): Promise<Comment> {
    const comment: Comment = new Comment();

    comment.post = await Post.findOneOrFail(postId);
    comment.author = await User.findOneOrFail(authorId);
    comment.content = content;

    await this.commentRepository.save(comment);

    return comment;
  }
}

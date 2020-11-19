import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { Post } from "../../domain/Entities/Post";
import { Comment } from "../../domain/Entities/Comment";
import { ICommentRepository } from "../../domain/Repositories/ICommentRepository";
import TYPES from "../../types";
import {CommentService} from '../../application/Services/CommentService';

@injectable()
export class CommentController {
  private commentRepository: ICommentRepository;
  private commentService: CommentService;
  constructor(
    @inject(TYPES.ICommentRepository) commentRepository: ICommentRepository,
    @inject(CommentService) commentService: CommentService,
  ) {
    this.commentRepository = commentRepository;
    this.commentService = commentService;
  }

  public getCommentsOfPost = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.post_id);
    const comments = await this.commentRepository.findAllCommentsOfPost(postId, ["likers"]);

    const serializedComments = [];

    for (let comment of comments){
      serializedComments.push({
        ...comment,
        likers:undefined,
        total_likers: comment.likers.length,
      })
    }
    response.json(serializedComments);
  };

  public createComment = async (request: Request, response: Response) => {
    const payload = request.body;
    const postId: number = Number(request.params.post_id);

    // @ts-ignore
    const comment: Comment = await this.commentService.create(postId, request.user.id, payload.content);

    response.redirect(`/posts/${postId}`);
  };

  public addLike = async (request: Request, response: Response) => {
    const commentId: number = Number(request.params.id);
    const postId: number = Number(request.params.post_id);
    const giverId: number = request.body.giver_id;

    const comment: Comment = await Comment.findOneOrFail(commentId, {
      relations: ["post"],
    });

    if (comment.post.id !== postId) {
      response.status(404).send({ message: "Comment not found!" });
    }

    await this.commentRepository.addLikeToComment(commentId, giverId);

    response.send({ message: "Like added!" }).status(201);
  };
  public removeLike = async (request: Request, response: Response) => {
    const commentId: number = Number(request.params.id);
    const postId: number = Number(request.params.post_id);
    const giverId: number = request.body.giver_id;

    const comment: Comment = await Comment.findOneOrFail(commentId, {
      relations: ["post"],
    });
    if (comment.post.id !== postId) {
      response.status(404).send({ message: "Comment not found!" });
    }

    await this.commentRepository.addLikeToComment(commentId, giverId);

    response.send({ message: "Like removed!" }).status(201);
  };
}

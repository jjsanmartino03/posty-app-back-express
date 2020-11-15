import { injectable } from "inversify";
import { Request, Response } from "express";
import { Post } from "../domain/Entities/Post";
import { Comment } from "../domain/Entities/Comment";
import {User} from '../domain/Entities/User';

@injectable()
export class CommentController {
  public getCommentsOfPost = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.post_id);
    const post: Post = await Post.findOneOrFail(postId, {
      relations: ["comments"],
    });

    const comments: Comment[] = post.comments;

    response.json(comments);
  };
  public createComment = async (request:Request, response: Response) => {
      const payload = request.body;
      const postId: number = Number(request.params.post_id);
      const post : Post = await Post.findOneOrFail(postId, {relations:["comments"]});

      const comment: Comment = new Comment();
      comment.author = await User.findOneOrFail(payload.author_id);
      comment.content = payload.content;

      post.comments.push(comment);

      await post.save();

      response.send({message:"Comment Created!", comment}).status(201);
  }
}

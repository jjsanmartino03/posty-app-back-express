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

      const serializedComment = {
          ...comment,
          author_username: comment.author.username,
          author:undefined,
      }

      response.send({message:"Comment Created!", comment:serializedComment}).status(201);
  }
    public addLike = async (request: Request, response: Response) => {
        const commentId: number = Number(request.params.id);
        const postId:number = Number(request.params.post_id);

        const comment: Comment  = await Comment.findOneOrFail(commentId, {
            relations: ["likers", "post"],
        });

        if (comment.post.id !== postId) {
            response.status(404).send({message: "Comment not found!"})
        }

        const giverId: number = request.body.giver_id;

        let likeAlreadyExists: boolean = false;

        for (let liker of comment.likers) {
            if (liker.id == giverId) {
                likeAlreadyExists = true;
                break;
            }
        }
        if (!likeAlreadyExists) {
            const giver: User = await User.findOneOrFail(giverId);
            comment.likers.push(giver);
            await comment.save();
        }
        response.send({ message: "Like created!" }).status(201);
    };
    public removeLike = async (request: Request, response: Response) => {
        const commentId: number = Number(request.params.id);
        const postId: number = Number(request.params.post_id);

        const comment: Comment = await Comment.findOneOrFail(commentId, {
            relations: ["likers", "post"],
        });
        if (comment.post.id !== postId) {
            response.status(404).send({message: "Comment not found!"})
        }
        const giverId: number = request.body.giver_id;

        comment.likers = comment.likers.filter((liker) => liker.id !== giverId);

        await comment.save();
        response.send({ message: "Like removed!" }).status(201);
    };
}

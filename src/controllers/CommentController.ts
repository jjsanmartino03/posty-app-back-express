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
    public addLike = async (request: Request, response: Response) => {
        const commentId: number = Number(request.params.id);
        const comment: Comment  = await Post.findOneOrFail(commentId, {
            relations: ["likers"],
        });
        const giverId: number = request.body.giver_id;

        let likeAlreadyExists: boolean = false;

        for (let liker of post.likers) {
            if (liker.id == giverId) {
                likeAlreadyExists = true;
                break;
            }
        }
        if (!likeAlreadyExists) {
            const giver: User = await User.findOneOrFail(giverId);
            post.likers.push(giver);
            await post.save();
        }
    };
    public removeLike = async (request: Request, response: Response) => {
        const postId: number = Number(request.params.id);
        const post: Post = await Post.findOneOrFail(postId, {
            relations: ["likers"],
        });
        const giverId: number = request.body.giver_id;

        post.likers = post.likers.filter((liker) => liker.id !== giverId);

        await post.save();
        response.send({ message: "Like removed!" }).status(201);
    };
}

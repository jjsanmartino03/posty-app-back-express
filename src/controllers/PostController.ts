import { Request, Response } from "express";
import { injectable } from "inversify";
import { Post } from "../domain/Entities/Post";
import { Connection, getConnection } from "typeorm";
import { User } from "../domain/Entities/User";
import { Category } from "../domain/Entities/Category";

@injectable()
export class PostController {
  public getAll = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const posts: Post[] = await Post.find();

    response.json(posts);
  };

  public savePost = async (request: Request, response: Response) => {
    const payload = request.body;
    const authorId: number = payload.author_id;
    const post: Post = new Post();
    const categoriesIds: number[] = payload.categories;
    const categories: Category[] = [];

    for (let categoryId of categoriesIds) {
      categories.push(await Category.findOneOrFail(categoryId));
    }

    post.title = payload.title;
    post.content = payload.content;
    post.author = await User.findOneOrFail(authorId);
    post.categories = categories;

    await post.save();

    response.send({ message: "Created", post }).status(201);
  };

  public getPost = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);

    const post: Post = await Post.findOneOrFail(postId, {relations:["comments"]});

    response.json(post);
  };

  public updatePost = async (request: Request, response: Response) => {
    const payload = request.body;
    const postId: number = Number(request.params.id);
    const post: Post = await Post.findOneOrFail(postId);
    const categoriesIds: number[] = payload.categories;

    const categories: Category[] = [];

    for (let categoryId of categoriesIds) {
      categories.push(await Category.findOneOrFail(categoryId));
    }

    post.title = payload.title;
    post.content = payload.content;
    post.categories = categories;

    await post.save();

    response.send({ message: "Updated", post }).status(201);
  };
}

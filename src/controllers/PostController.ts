import { Request, Response } from "express";
import { injectable } from "inversify";
import { Post } from "../domain/Entities/Post";
import { User } from "../domain/Entities/User";
import { Category } from "../domain/Entities/Category";

@injectable()
export class PostController {
  public getAll = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const posts: Post[] = await Post.find({relations:["author",]});

    const serializedPosts = posts.map(post => ({
      ...post,
      author:undefined,
      author_username: post.author.username,
    }))

    response.json(serializedPosts);
  };

  public savePost = async (request: Request, response: Response) => {
    const payload = request.body;
    const authorId: number = payload.author_id;
    const post: Post = new Post();
    const categoriesIds: number[] = payload.categories
      ? payload.categories
      : [];
    const categories: Category[] = [];

    for (let categoryId of categoriesIds) {
      categories.push(await Category.findOneOrFail(categoryId));
    }

    post.title = payload.title;
    post.content = payload.content;
    post.author = await User.findOneOrFail(authorId);
    post.categories = categories;

    await post.save();

    const serializedPost = {
      ...post,
      author:undefined,
      author_username: post.author.username,
      categories: post.categories.map(cat => cat.name),
    }

    response.send({ message: "Created", post:serializedPost }).status(201);
  };

  public getPost = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);

    const post: Post = await Post.findOneOrFail(postId, {
      relations: ["comments", "categories", "author", "likers"],
    });

    const serializedPost = {
      id: post.id,
      author_username: post.author.username,
      comments: post.comments,
      categories: post.categories.map(cat=>cat.name),
      total_likes: post.likers.length,
      created_at: post.created_at,
    };

    response.json(serializedPost);
  };

  public updatePost = async (request: Request, response: Response) => {
    const payload = request.body;
    const postId: number = Number(request.params.id);
    const post: Post = await Post.findOneOrFail(postId);
    const categoriesIds: number[] = payload.categories
      ? payload.categories
      : [];

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

  public addLike = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);
    const post: Post = await Post.findOneOrFail(postId, {
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
    response.send({ message: "Like created!" }).status(201);
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

import { Request, Response } from "express";
import { injectable } from "inversify";
import { Post } from "../../domain/Entities/Post";
import { User } from "../../domain/Entities/User";
import { Category } from "../../domain/Entities/Category";

@injectable()
export class PostController {
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    // todo: traer posts con categorías, quizás
    // traer todos los posts con sus autores
    const posts: Post[] = await Post.find({relations:["author",]});

    // Darle un formato apropiado al post, que en vez de llevar un autor completo lleva su username
    const serializedPosts = posts.map(post => ({
      ...post,
      author:undefined,
      author_username: post.author.username,
    }));

    response.json(serializedPosts);
  };

  public create = async (request: Request, response: Response) => {
    const payload = request.body;

    const authorId: number = payload.author_id;
    const post: Post = new Post();
    // Obtener las ids de las categorías del post
    const categoriesIds: number[] = payload.categories
      ? payload.categories
      : [];

    const categories: Category[] = [];
    // buscar todas las categorias del post por sus ids
    for (let categoryId of categoriesIds) {
      categories.push(await Category.findOneOrFail(categoryId));
    }

    post.title = payload.title;
    post.content = payload.content;
    post.author = await User.findOneOrFail(authorId);
    post.categories = categories;

    // guardar el post
    await post.save();
    // adaptar el post a lo que quiero devolver en la response
    const serializedPost = {
      ...post,
      author:undefined,
      author_username: post.author.username,
      categories: post.categories.map(cat => cat.name),
      deleted_at: undefined,
    }

    response.send({ message: "Created", post:serializedPost }).status(201);
  };
  // obtener un post por el id
  public show = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);

    // Traer el post, junto con todas las relaciones que quiero mostrar
    const post: Post = await Post.findOneOrFail(postId, {
      relations: ["comments", "categories", "author", "likers"],
    });
    // Darle propiedades adecuadas a lo que quiero dar en la response
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

  public update = async (request: Request, response: Response) => {
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

import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Post } from "../../domain/Entities/Post";
import { User } from "../../domain/Entities/User";
import { Category } from "../../domain/Entities/Category";
import { IPostRepository } from "../../domain/Repositories/IPostRepository";
import TYPES from "../../types";
import { PostService } from "../../application/Services/PostService";
import {TwingViewRenderService} from '../Services/TwingViewRenderService';

@injectable()
export class PostController {
  private postRepository: IPostRepository;
  private postService: PostService;
  private viewRenderService: TwingViewRenderService;
  constructor(
    @inject(TYPES.IPostRepository) postRepository: IPostRepository,
    @inject(PostService) postService: PostService,
    @inject(TwingViewRenderService) viewRenderService: TwingViewRenderService,
  ) {
    this.postRepository = postRepository;
    this.postService = postService;
    this.viewRenderService = viewRenderService;
  }
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    // traer todos los posts con sus autores y categoras
    const posts: Post[] = await this.postRepository.findAll(["author", "categories"]);

    // Darle un formato apropiado al post, que en vez de llevar un autor completo lleva su username
    const serializedPosts = posts.map((post) => ({
      ...post,
      author: undefined,
      author_username: post.author.username,
      categories: post.categories.map(cat => cat.name),
    }));
    const output:string = await this.viewRenderService.home(posts);
    response.end(output);
  };

  public create = async (request: Request, response: Response) => {
    const payload = request.body;

    const post: Post = await this.postService.create(
      payload.title,
      payload.author_id,
      payload.content,
      payload.categories
    );
    // adaptar el post a lo que quiero devolver en la response
    const serializedPost = {
      ...post,
      author: undefined,
      author_username: post.author.username,
      categories: post.categories.map((cat) => cat.name),
      deleted_at: undefined,
    };

    response.send({ message: "Created", post: serializedPost }).status(201);
  };
  // obtener un post por el id
  public show = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);

    // Traer el post, junto con todas las relaciones que quiero mostrar
    const post: Post = await this.postRepository.findOneById(postId, ["comments", "categories", "author", "likers"]);
    // Darle propiedades adecuadas a lo que quiero dar en la response
    const serializedPost = {
      ...post,
      id: post.id,
      author_username: post.author.username,
      comments: post.comments,
      categories: post.categories.map((cat) => cat.name),
      total_likes: post.likers.length,
      created_at: post.created_at,
    };

    response.json(serializedPost);
  };

  public update = async (request: Request, response: Response) => {
    const payload = request.body;
    const postId: number = Number(request.params.id);

    const post = await this.postService.update(postId, payload.title, payload.content, payload.categories);
    response.send({ message: "Updated", post }).status(201);
  };

  public addLike = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);
    const giverId: number = request.body.giver_id;

    await this.postRepository.addLikeToPost(postId,giverId);

    response.send({ message: "Like added!" }).status(201);
  };

  public removeLike = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);
    const giverId: number = request.body.giver_id;

    await this.postRepository.removeLikeToPost(postId,giverId);

    response.send({ message: "Like added!" }).status(201);
  };
}

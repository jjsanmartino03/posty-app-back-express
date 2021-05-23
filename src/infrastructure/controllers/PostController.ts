import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Post } from "../../domain/Entities/Post";
import { User } from "../../domain/Entities/User";
import { Category } from "../../domain/Entities/Category";
import { IPostRepository } from "../../domain/Repositories/IPostRepository";
import TYPES from "../../types";
import { PostService } from "../../application/Services/PostService";
import { TwingViewRenderService } from "../Services/TwingViewRenderService";
import { Comment } from "../../domain/Entities/Comment";
import { ICategoryRepository } from "../../domain/Repositories/ICategoryRepository";

// todo: Tendría que haber usado bien las opciones de las relations con TypeORM. de las subrelaciones, como
//  "comments", "comments.likers"
@injectable()
export class PostController {
  private postRepository: IPostRepository;
  private postService: PostService;
  private viewRenderService: TwingViewRenderService;
  private categoryRepository: ICategoryRepository;
  constructor(
    @inject(TYPES.IPostRepository) postRepository: IPostRepository,
    @inject(TYPES.ICategoryRepository) categoryRepository: ICategoryRepository,
    @inject(PostService) postService: PostService,
    @inject(TwingViewRenderService) viewRenderService: TwingViewRenderService
  ) {
    this.postRepository = postRepository;
    this.postService = postService;
    this.viewRenderService = viewRenderService;
    this.categoryRepository = categoryRepository;
  }
  public postsForm = async (request: Request, response: Response) => {
    const existingCategories = await this.categoryRepository.getAll();
    const postsForm: string = await this.viewRenderService.postForm(
      request.user,
      existingCategories
    );
    response.end(postsForm);
  };
  public index = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    // traer todos los posts con sus autores y categoras
    const posts: Post[] = await this.postRepository.findAll([
      "author",
      "categories",
      "comments",
      "likers",
    ], {id:"DESC"});

    // Darle un formato apropiado al post, que en vez de llevar un autor completo lleva su username
    const serializedPosts = posts.map((post) => ({
      ...post,
      author: undefined,
      author_username: post.author.username,
      categories: post.categories.map((cat) => cat.name),
      total_likes: post.likers.length,
      total_comments: post.comments.length,
    }));
    const output: string = await this.viewRenderService.home(
      serializedPosts,
      request.user
    );
    response.end(output);
  };

  public create = async (request: any, response: Response) => {
    const payload = request.body;

    let categories: number[];

    if (typeof payload.categories === 'object') {
      categories = payload.categories.map((catId:string) => parseInt(catId));
    }else{
      categories = payload.categories ? [payload.categories] : [];
    }


    const post: Post = await this.postService.create(
      payload.title,
      //@ts-ignore
      request.user.id,
      payload.content,
      categories,
    );
    response.redirect("/");
  };
  // obtener un post por el id
  public show = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);

    // Traer el post, junto con todas las relaciones que quiero mostrar
    const post: Post = await this.postRepository.findOneById(postId, [
      "comments",
      "categories",
      "author",
      "likers",
    ]);
    const serializedComments: {}[] = [];
    for (let comment of post.comments) {
      // todo: hacer esto con repository
      const trackedComment: Comment = await Comment.findOneOrFail(comment.id, {
        relations: ["likers", "author"],
      });
      serializedComments.push({
        ...trackedComment,
        total_likes: trackedComment.likers.length,
        likers: undefined,
        author_username: trackedComment.author.username,
        author: undefined,
      });
    }
    // Darle propiedades adecuadas a lo que quiero dar en la response
    const serializedPost = {
      ...post,
      id: post.id,
      author_username: post.author.username,
      comments: serializedComments,
      total_comments: post.comments.length,
      categories: post.categories.map((cat) => cat.name),
      total_likes: post.likers.length,
      created_at: post.created_at,
    };
    const output: string = await this.viewRenderService.postView(
      serializedPost,
      request.user
    );
    response.end(output);
  };

  public update = async (request: Request, response: Response) => {
    const payload = request.body;
    const postId: number = Number(request.params.id);

    const post = await this.postService.update(
      postId,
      payload.title,
      payload.content,
      payload.categories
    );
    response.send({ message: "Updated", post }).status(201);
  };

  public addLike = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);
    const giverId: number = request.body.giver_id;

    await this.postRepository.addLikeToPost(postId, giverId);

    response.send({ message: "Like added!" }).status(201);
  };

  public removeLike = async (request: Request, response: Response) => {
    const postId: number = Number(request.params.id);
    const giverId: number = request.body.giver_id;

    await this.postRepository.removeLikeToPost(postId, giverId);

    response.send({ message: "Like added!" }).status(201);
  };
}

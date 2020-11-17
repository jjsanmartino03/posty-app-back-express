import {inject, injectable} from 'inversify';
import TYPES from '../../types';
import {IPostRepository} from '../../domain/Repositories/IPostRepository';
import {Post} from '../../domain/Entities/Post';
import {Category} from '../../domain/Entities/Category';
import {User} from '../../domain/Entities/User';
import {getConnection} from 'typeorm';

@injectable()
export class PostService {
    private postRepository: IPostRepository;
    constructor(@inject(TYPES.IPostRepository) postRepository:IPostRepository) {
        this.postRepository = postRepository;
    }
    public async create(title:string, authorId:number, content:string, categoriesIds: number[]=[]): Promise<Post>{
        const post: Post = new Post();
        // Obtener las ids de las categorías del post
        //todo: está bien manejar las relaciones así en un service?
        const categories: Category[] = [];
        // buscar todas las categorias del post por sus ids (hay otra forma más liviana de hacerlo pero es con el query
        // builder)
        for (let categoryId of categoriesIds) {
            categories.push(await Category.findOneOrFail(categoryId));
        }

        post.title = title;
        post.content = content;
        post.author = await User.findOneOrFail(authorId);
        post.categories = categories;

        // guardar el post
        await this.postRepository.save(post);
        return post;
    }

    public async update(id:number, newTitle:string, newContent:string, newCategories:number[] = []): Promise<Post>{
        const post: Post = await this.postRepository.findOneById(id);

        const categories: Category[] = [];
        // buscar todas las categorias del post por sus ids (hay otra forma más liviana de hacerlo pero es con el query
        // builder)
        for (let categoryId of newCategories) {
            categories.push(await Category.findOneOrFail(categoryId));
        }

        post.title = newTitle;
        post.content = newContent;
        post.categories = categories;

        await this.postRepository.save(post);

        return post;
    }

}
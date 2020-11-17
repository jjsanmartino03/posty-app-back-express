import {IPostRepository} from '../../domain/Repositories/IPostRepository';
import {injectable} from 'inversify';
import {Post} from '../../domain/Entities/Post';
import {getConnection} from 'typeorm';

@injectable()
export class TypeORMPostRepository implements IPostRepository{
    public async findAll(relations: string[] = []): Promise<Post[]>{
        return await Post.find({relations:relations});
    }
    public async findOneById(id:number, relations: string[] = []):Promise<Post>{
        return await Post.findOneOrFail(id, {relations:relations});
    };
    public async save(post:Post):Promise<void>{
        await post.save();
    };
    public async addLikeToPost(postId:number, giverId:number):Promise<void>{
        await getConnection()
            .createQueryBuilder()
            .relation(Post, "likers")
            .of(postId)
            .add(giverId);
    }
    public async removeLikeToPost(postId:number,giverId:number):Promise<void>{
        await getConnection()
            .createQueryBuilder()
            .relation(Post, "likers")
            .of(postId)
            .add(giverId);
    }
}
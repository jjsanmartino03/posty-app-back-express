import {Post} from '../Entities/Post';

export interface IPostRepository{
    findAll(relations?: string[], order?:{id:string}): Promise<Post[]>;
    findOneById(id:number, relations?: string[], ):Promise<Post>;
    save(post:Post):Promise<void>;
    addLikeToPost(postId:number,giverId:number):Promise<void>;
    removeLikeToPost(postId:number,giverId:number):Promise<void>;
}
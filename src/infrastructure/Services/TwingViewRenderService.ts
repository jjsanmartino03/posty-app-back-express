import { injectable } from "inversify";
import { User } from "../../domain/Entities/User";
import e from "express";

const { TwingEnvironment, TwingLoaderFilesystem } = require("twing");
let loader = new TwingLoaderFilesystem("src/infrastructure/views");
let twing = new TwingEnvironment(loader);

@injectable()
export class TwingViewRenderService {
  public async home(posts: any, user: any): Promise<string> {
    return await twing.render("postsIndex.twing.html", { posts, user });
  }
  public async login(): Promise<string> {
    return await twing.render("loginForm.twing.html");
  }
  public async signup(): Promise<string>{
    return await twing.render("signupForm.twing.html");
  }
  public async postView(post:any, user:any): Promise<string>{
    return await twing.render("postView.twing.html", {post, user})
  }
  public async postForm(user:any, rootCategories:any):Promise<string>{
    return await twing.render("postForm.twing.html", {user, categories:rootCategories});
  }
  public async categoryForm(user:any, categories:any):Promise<string>{
    return await twing.render("categoryForm.twing.html", {user, categories});
  }
  public async userIndex(user:any, users:any):Promise<string>{
    return await twing.render("userIndex.twing.html", {user, users});
  }
}

import { injectable } from "inversify";
import { User } from "../../domain/Entities/User";
import e from "express";

const { TwingEnvironment, TwingLoaderFilesystem } = require("twing");
let loader = new TwingLoaderFilesystem("src/infrastructure/views");
let twing = new TwingEnvironment(loader);

@injectable()
export class TwingViewRenderService {
  public async home(posts: any): Promise<string> {
    return await twing.render("home.twing.html", { posts });
  }
  public async login(): Promise<string> {
    return await twing.render("loginForm.twing.html");
  }
}

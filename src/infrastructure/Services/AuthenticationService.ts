import {inject, injectable} from 'inversify';
import { Strategy } from "passport-local";
import { IUserRepository } from "../../domain/Repositories/IUserRepository";
import { User } from "../../domain/Entities/User";
import TYPES from "../../types";
import passport, {PassportStatic} from 'passport';
import e, {Request, Response} from 'express';

@injectable()
export class AuthenticationService {
  // todo: encrypt password
  private userRepository: IUserRepository;
  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  public verifyRegistration = async (
      request: Request,
      username:string,
      password:string,
      done: Function
  ) => {
    try {
      const user: User = new User();
      user.username = username;
      user.email = request.body.email;
      user.password = password;

      await this.userRepository.save(user);

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
  public verifyCallback = async  (
    username: string,
    password: string,
    done: Function
  ) =>{
    try {
      const user: User = await this.userRepository.findByUsername(username);
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  };
  public serializeUser = (req: any, user: any, done: Function)=>{
    done(null, user.id);
  };
  public deserializeUser = async (id: number, done: Function)=>{
    try {
      const user: User = await this.userRepository.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  };
  public setup = (appInstance:e.Application) =>{
    passport.use("local-login", new Strategy(this.verifyCallback));
    passport.use("local-signup", new Strategy({passReqToCallback:true}, this.verifyRegistration));
    passport.serializeUser<any, any>(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
    appInstance.use(passport.initialize());
    appInstance.use(passport.session());
  };
  public userLoggedIn = (request:Request, response: Response, next:Function)=>{
    if (request.isAuthenticated()){
      return next();
    }
    response.redirect("/login")
  }
}

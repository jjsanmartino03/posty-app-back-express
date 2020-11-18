import {inject, injectable} from 'inversify';
import { Strategy } from "passport-local";
import { IUserRepository } from "../../domain/Repositories/IUserRepository";
import { User } from "../../domain/Entities/User";
import TYPES from "../../types";
import passport, {PassportStatic} from 'passport';
import e from 'express';

@injectable()
export class AuthenticationService {
  private userRepository: IUserRepository;
  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  public verifyCallback = async  (
    username: string,
    password: string,
    done: Function
  ) =>{
    console.log("hola")
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
  public  serializeUser = (user: User, done: Function)=>{
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
    console.log("hola");
    passport.use("local", new Strategy(this.verifyCallback));
    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
    appInstance.use(passport.initialize());
    appInstance.use(passport.session());
    /*passport.use(new Strategy(async (
        username: string,
        password: string,
        done: Function
    ) => {
      console.log(password);
      try {
        const user: User = await this.userRepository.findByUsername(username);
        console.log(user.password)
        if (!user) {
          return done(null, false);
        }
        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }}));
    passport.serializeUser((user: User, done: Function) => {
      done(null, user.id);
    });
    passport.deserializeUser(async (id: number, done: Function) => {
      try {
        const user: User = await this.userRepository.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });*/
  };
}

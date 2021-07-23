# posty-express-js
This is a simple application, that replicates a social network of users. You can create an account, create posts, see other users posts and profiles. Also, you can comment on posts.

## The stack
* Typescript
* Node.js
* Express.js
* MySql
* Passport.js
* Typeorm

I made this at the end of a coding bootcamp, to apply all the new concepts. It's simple, but I learned a lot. 


## Installation and use
- Assuming you already have node.js, npm and docker installed, and the project cloned:
1. Install modules, and create variable configurations. The information of the .env file has to be like the info on the `docker/docker-compose.yml` file.
```bash
npm install
cp .env.example .env
```
3. Give execution permissions to the `wait-for-it.sh` script.
```bash
sudo chmod +x wait-for-it.sh
```
2. Run docker:
```bash
cd docker
docker-compose up
```

## Running

```bash
npm run dev
```

## Build

```bash
npm run tsc
```

## Production deployment

```bash
npm run prod
```

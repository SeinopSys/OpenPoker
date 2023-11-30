# OpenPoker

Helps create and run an SCRUM planning poker session for estimations

## Attributions

* [NestJS + React (Next.js) in One MVC Repo for Rapid Prototyping](https://medium.com/geekculture/nestjs-react-next-js-in-one-mvc-repo-for-rapid-prototyping-faed42a194ca)
* [NestJS: Third Party OAuth2 Authentication](https://www.nerd.vision/post/nestjs-third-party-oauth2-authentication)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Common commands

```bash
# Create database migration file with the provided name
$ npx typeorm migration:create src/server/migrations/MigrationName

# Generate migrations from entities
$ npm run typeorm:generate src/server/migrations/MigrationName

# Run database migrations
$ npm run typeorm:run

# Revert latest migration
$ npm run typeorm:revert
```

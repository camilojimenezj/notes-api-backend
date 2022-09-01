# Notes API

This is an API for notes and users management. This project includes user authentication with JSON web tokens, testing with Jest and data persistence in MongoDB

## Technologies used

1. Node
2. Express
3. MongoDB
4. jsonwebtoken
5. Jest

## Customize configuration

## Project Setup

```sh
npm install
```

### Hot-Reload for Development

```sh
npm run dev
```

### Start project 

```sh
npm run start
```

### Run tests 

```sh
npm run test
```

## Usage

* You can POST to /api/users with form data username, name and password to create a new user.
* You can make a GET request to /api/users to get a list of all users.
* You can POST to /api/login with form data username and password, to login and get a Bearer Token.
* You can POST to /api/notes with form data content, important(Boolean), userId. You have to include a Bearer Token in the Authorization header.
* You can make a GET request to /api/notes to get a list of all notes.
* You can make a DELETE request to /api/notes/:id to delete a note, you have to include a Bearer Token in the Authorization header.
* You can make a PUT request to /api/notes/:id with form data content and important(Boolean), to update a note. You have to include a Bearer Token in the Authorization header

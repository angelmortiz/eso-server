# [WIP] En Salud Optima - Server Side

[This project is still a WIP]  
This is the server-side codebase for the En Salud Optima web application. It is a Node.js server built with Express.js and TypeScript.

## Getting Started

To get started with the project, clone the repository and install the dependencies using npm:

```
git clone https://github.com/angelmortiz/eso-server.git
cd eso-server
npm install
```

## Scripts

The project includes several scripts for running the server in different environments:

- Development: `npm run start:dev`
- Beta: `npm run start:beta:local`
- Production: `npm run start:prod`

You can build the project using TypeScript with:  
`npm run build`.

## Environment Configuration

The server uses environment variables for configuration. These are loaded from a `.env` file in the project root. The name of the environment file is determined by the `NODE_ENV` environment variable.

## Database Connection

The server connects to a MongoDB database. The connection is established when the server starts.

## Error Handling

The server includes global error handling for uncaught exceptions and unhandled promise rejections.

## Routes

The server includes several routes for handling API requests. These include routes for user authentication, user information, activities, and the home page.

## Docker

The project includes a Dockerfile and docker-compose files for running the server in a Docker container.

## TypeScript Configuration

The project uses TypeScript for static typing. The TypeScript configuration is defined in the `tsconfig.json` file.

## Email

The server uses Nodemailer for sending emails. This is used for features like password reset.

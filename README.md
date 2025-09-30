# Team 4 Job Application Project

A modern Node.js application built with TypeScript and Express.js using ES modules.

## Prerequisites

- Node.js (v18 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd team4-job-app-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
Start the application in development mode with hot reloading:
```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically restart when you make changes to the code.

### Production Mode
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Alternatively, you can build and start in one command:
```bash
npm run start:prod
```

## API Endpoints

- `GET /` - Returns a "Hello World" message

Example:
```bash
curl http://localhost:3000
# Response: {"message":"Hello World!"}
```

## Project Structure

```
team4-job-app-frontend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript output
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run start:prod` - Build and run in production mode
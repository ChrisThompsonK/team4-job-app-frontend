# Team 4 Job Application Project

A modern Node.js application built with TypeScript and Express.js using ES modules. This project includes modern development tooling with Biome for linting and formatting.

## Features

- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Fast, unopinionated web framework
- **ES Modules** - Modern JavaScript module system
- **Biome** - Fast linter and formatter for consistent code quality
- **Hot Reloading** - Automatic server restart during development

## Prerequisites

- Node.js (v18 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ChrisThompsonK/team4-job-app-frontend.git
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

## Code Quality & Formatting

This project uses **Biome** for maintaining code quality and consistent formatting.

### Available Commands

#### Linting & Formatting
```bash
npm run check         # Check for linting and formatting issues
npm run lint          # Same as check
npm run lint:fix      # Fix linting and formatting issues automatically
npm run format        # Format code only
npm run format:check  # Check formatting without applying changes
```

#### Development
```bash
npm run dev           # Start development server with hot reloading
npm run build         # Compile TypeScript to JavaScript
npm start             # Run the compiled application
npm run start:prod    # Build and run in production mode
```

### Code Style Guidelines

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Always required
- **Line Width**: 100 characters maximum
- **Trailing Commas**: ES5 style

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
├── dist/                 # Compiled JavaScript output (generated)
├── docs/                 # Project documentation
│   └── biome-setup.md   # Biome configuration guide
├── node_modules/        # Dependencies (generated)
├── .biomeignore         # Files ignored by Biome
├── .gitignore          # Git ignore rules
├── biome.json          # Biome configuration
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Dependency lock file
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes**: Edit files in the `src/` directory
3. **Check code quality**: `npm run check`
4. **Fix issues**: `npm run lint:fix`
5. **Build for production**: `npm run build`

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Module System**: ES Modules
- **Code Quality**: Biome (linting + formatting)
- **Development**: tsx (TypeScript execution with hot reloading)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run code quality checks (`npm run check`)
5. Fix any issues (`npm run lint:fix`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Quality Standards

- All code must pass Biome linting and formatting checks
- Use TypeScript for type safety
- Follow the established code style guidelines
- Write meaningful commit messages

## VS Code Setup (Recommended)

For the best development experience, install the Biome VS Code extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Biome"
4. Install the official Biome extension by `biomejs.biome`

This will provide real-time linting and formatting as you type.

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled application |
| `npm run start:prod` | Build and run in production mode |
| `npm test` | Run tests (placeholder) |
| `npm run check` | Check for linting and formatting issues |
| `npm run lint` | Same as check |
| `npm run lint:fix` | Fix linting and formatting issues automatically |
| `npm run format` | Format code only |
| `npm run format:check` | Check formatting without applying changes |

## License

ISC
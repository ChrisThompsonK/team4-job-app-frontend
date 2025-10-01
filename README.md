[![Code Quality](https://github.com/ChrisThompsonK/team4-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team4-job-app-frontend/actions/workflows/code-quality.yml)

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

# Team 4 Job Application Project

A modern Node.js web application built with TypeScript, Express.js, and Nunjucks templating engine using ES modules. This project includes modern development tooling with Biome for linting and formatting.

## Features

- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Fast, unopinionated web framework
- **Nunjucks** - Powerful templating engine for dynamic HTML rendering
- **ES Modules** - Modern JavaScript module system
- **Biome** - Fast linter and formatter for consistent code quality
- **Hot Reloading** - Automatic server restart during development
- **Responsive Design** - Clean, modern web interface

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

- `GET /` - Renders the home page with welcome message
- `GET /jobs` - Displays a list of available job positions

### Web Interface

The application now serves HTML pages using Nunjucks templates instead of JSON responses:

- **Home Page** (`/`): Welcome page with navigation
- **Jobs Page** (`/jobs`): Sample job listings with company information

Example:
```bash
# Visit in browser
http://localhost:3000      # Home page
http://localhost:3000/jobs # Jobs listing page
```

## Project Structure

```
team4-job-app-frontend/
├── src/
│   └── index.ts          # Main application entry point
├── views/                # Nunjucks templates
│   ├── index.njk        # Home page template
│   └── jobs.njk         # Jobs listing template
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
2. **Make changes**: Edit files in the `src/` directory or `views/` templates
3. **Check code quality**: `npm run check`
4. **Fix issues**: `npm run lint:fix`
5. **Build for production**: `npm run build`

## Templating with Nunjucks

This project uses Nunjucks as the templating engine to render dynamic HTML pages.

### Template Features

- **Auto-reloading**: Templates automatically reload during development
- **Template inheritance**: Consistent styling and layout across pages
- **Dynamic content**: Data can be passed from routes to templates
- **Conditional rendering**: Show/hide content based on data availability
- **Loops and filters**: Render lists and format data

### Template Structure

Templates are located in the `views/` directory:

- `index.njk` - Home page with welcome message and navigation
- `jobs.njk` - Job listings page with sample job data

### Adding New Templates

1. Create a new `.njk` file in the `views/` directory
2. Add a new route in `src/index.ts` using `res.render()`
3. Pass data to the template as the second parameter

Example:
```typescript
app.get('/about', (_req, res) => {
  res.render('about', {
    title: 'About Us',
    description: 'Learn more about our company'
  });
});
```

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Templating**: Nunjucks
- **Module System**: ES Modules
- **Code Quality**: Biome (linting + formatting)
- **Development**: tsx (TypeScript execution with hot reloading)
- **File Watching**: chokidar (for template auto-reloading)

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
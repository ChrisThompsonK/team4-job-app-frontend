[![Code Quality](https://github.com/ChrisThompsonK/team4-job-app-frontend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team4-job-app-frontend/actions/workflows/code-quality.yml)

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

# Team 4 Job Application Project - Frontend

A modern Node.js web application built with TypeScript, Express.js, and Nunjucks templating engine using ES modules. This project includes modern development tooling with Biome for linting and formatting, and uses TailwindCSS with DaisyUI for styling.

> 📚 **For Developers & AI Assistants**: See the [`instructions/`](./instructions/) directory for comprehensive guides on the project architecture, tools, and best practices.

## Features

- **TypeScript** - Type-safe JavaScript development with ES Modules
- **Express.js v5** - Fast, unopinionated web framework for server-side rendering
- **Nunjucks** - Powerful templating engine for dynamic HTML rendering
- **TailwindCSS v4** - Utility-first CSS framework
- **DaisyUI v5** - Pre-styled accessible UI components
- **Biome** - Ultra-fast linter and formatter (90x faster than ESLint)
- **Hot Reloading** - Automatic server restart during development
- **Vitest** - Modern testing framework
- **Backend Integration** - Communicates with REST API backend service

## Prerequisites

- **Node.js** (v18 or higher, v20+ LTS recommended)
- **npm** (v9 or higher, v10+ recommended)
- **Backend API** (team4-job-app-backend - **REQUIRED** to be running)

> ⚠️ **Important**: This frontend application requires the backend API to be running. See [Backend Integration](#backend-integration) section for setup instructions.

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

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Edit .env with your configuration
PORT=3000
API_BASE_URL=http://localhost:8080
```

## Running the Application

> ⚠️ **IMPORTANT**: The backend API must be running first! See [Backend Integration](#backend-integration) below.

### Quick Start (Both Frontend & Backend)

**1. Start the Backend** (in a separate terminal):
```bash
cd ../team4-job-app-backend
npm install
npm run db:seed    # First time only - seeds database
npm run dev
# Backend runs on http://localhost:3001 or http://localhost:8080
```

**2. Start the Frontend** (in this directory):
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

**3. Open your browser**:
```
http://localhost:3000
```

### Development Mode (Frontend Only)

> ⚠️ Ensure backend is running first (see above)

Start the frontend application in development mode with hot reloading:
```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically restart when you make changes to the code.

### Production Mode

> ⚠️ Ensure backend is running in production mode first

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
- **Import Protocol**: Use `node:` prefix for Node.js built-ins
- **Template Literals**: Prefer template literals over string concatenation

> 📖 See [`instructions/linting-instructions.md`](./instructions/linting-instructions.md) for detailed linting guide.

## Application Routes

The application serves server-side rendered HTML pages using Nunjucks templates:

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Homepage with latest 3 job postings |
| `/jobs` | GET | All job listings with filter/sort options |
| `/jobs/create` | GET | Create new job role form |
| `/jobs/create` | POST | Submit new job role |
| `/jobs/:id` | GET | Individual job details page |

### Web Interface

Visit the application in your browser:

```bash
http://localhost:3000           # Homepage
http://localhost:3000/jobs      # Job listings
http://localhost:3000/jobs/1    # Job details (ID: 1)
http://localhost:3000/jobs/create  # Create new job
```

## Project Structure

```
team4-job-app-frontend/
├── src/                          # TypeScript source code
│   ├── index.ts                  # Main application entry point
│   ├── controllers/              # Request handlers
│   │   └── job-controller.ts
│   ├── services/                 # Business logic & API communication
│   │   ├── jobService.ts         # Backend API service
│   │   ├── interfaces.ts
│   │   └── in-memory-job-role-service.ts
│   ├── models/                   # TypeScript interfaces
│   │   ├── job-role.ts
│   │   └── create-job-role.ts
│   ├── constants/                # Shared configuration
│   │   └── job-form-options.ts
│   └── utils.ts                  # Utility functions
├── views/                        # Nunjucks templates
│   ├── layout.njk                # Base layout template
│   ├── index.njk                 # Homepage
│   ├── jobs.njk                  # Job listings
│   ├── job-detail.njk            # Job details
│   ├── create-job.njk            # Create job form
│   └── partials/                 # Reusable components
│       ├── header.njk
│       └── footer.njk
├── styles/                       # CSS source
│   └── main.css                  # TailwindCSS entry point
├── public/                       # Static assets
│   └── images/
│       └── Kainos-logo.jpg
├── js/                           # Client-side JavaScript
│   └── index.js
├── instructions/                 # 📚 Comprehensive project documentation
│   ├── README.md                 # Instructions overview
│   ├── project-info.md           # Complete project guide
│   ├── nunjucks-instructions.md  # Templating guide
│   ├── linting-instructions.md   # Biome guide
│   ├── dependencies-instructions.md  # Package management
│   ├── daisyui-instructions.md   # UI components guide
│   └── mcp-instructions.md       # Model Context Protocol setup
├── dist/                         # Compiled output (generated)
│   ├── src/                      # Compiled JavaScript
│   └── styles.css                # Compiled CSS
├── docs/                         # Additional documentation
├── biome.json                    # Biome configuration
├── tailwind.config.js            # TailwindCSS + DaisyUI config
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest test configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Development Workflow

1. **Start development**: `npm run dev`
2. **Make changes**: Edit files in the `src/` directory or `views/` templates
3. **Check code quality**: `npm run check`
4. **Fix issues**: `npm run lint:fix`
5. **Build for production**: `npm run build`

## Templating with Nunjucks

This project uses Nunjucks as the templating engine to render dynamic HTML pages with DaisyUI components.

### Template Features

- **Auto-reloading**: Templates automatically reload during development
- **Template inheritance**: Consistent styling and layout across pages (`layout.njk`)
- **Dynamic content**: Data passed from controllers to templates
- **Conditional rendering**: Show/hide content based on data
- **Loops and filters**: Render lists and format data
- **Macros**: Reusable component patterns

### Adding New Pages

1. Create template in `views/` directory (e.g., `about.njk`)
2. Create controller method in `src/controllers/`
3. Add route in `src/index.ts`
4. Style with DaisyUI components

Example:
```typescript
// src/index.ts
app.get('/about', (_req, res) => {
  res.render('about', {
    title: 'About Us',
    description: 'Learn more about our company'
  });
});
```

> 📖 See [`instructions/nunjucks-instructions.md`](./instructions/nunjucks-instructions.md) for complete templating guide.
>
> 📖 See [`instructions/daisyui-instructions.md`](./instructions/daisyui-instructions.md) for UI components guide.

## Technology Stack

### Core
- **Runtime**: Node.js v18+ (v20+ LTS recommended)
- **Language**: TypeScript v5.9+
- **Framework**: Express.js v5.1.0
- **Templating**: Nunjucks v3.2.4
- **Module System**: ES Modules

### Styling
- **CSS Framework**: TailwindCSS v4.1.14
- **UI Components**: DaisyUI v5.1.26
- **Icons**: Lucide Icons (CDN)

### Development Tools
- **Code Quality**: Biome v2.2.4 (linting + formatting)
- **Testing**: Vitest v3.2.4
- **TypeScript Execution**: tsx v4.20.6 (hot reloading)
- **Build Tools**: TypeScript Compiler, TailwindCSS CLI
- **Process Management**: concurrently (parallel script execution)

### API Integration
- **HTTP Client**: Axios v1.12.2
- **Environment Config**: dotenv v17.2.3

> 📖 See [`instructions/dependencies-instructions.md`](./instructions/dependencies-instructions.md) for package management guide.

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
| `npm run dev` | Start development server with hot reloading (CSS + TypeScript) |
| `npm run build` | Build CSS and compile TypeScript to JavaScript |
| `npm run build:css` | Build TailwindCSS (production) |
| `npm run build:css:watch` | Build TailwindCSS (watch mode) |
| `npm start` | Run the compiled application |
| `npm run start:prod` | Build and run in production mode |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run check` | Check for linting and formatting issues |
| `npm run lint` | Same as check |
| `npm run lint:fix` | Fix linting and formatting issues automatically |
| `npm run format` | Format code only |
| `npm run format:check` | Check formatting without applying changes |

## 📚 Documentation

### For Developers & AI Assistants

Comprehensive guides are available in the [`instructions/`](./instructions/) directory:

- **[Instructions Overview](./instructions/README.md)** - Start here for navigation
- **[Project Info](./instructions/project-info.md)** - Complete architecture guide
- **[Nunjucks Guide](./instructions/nunjucks-instructions.md)** - Templating patterns
- **[Linting Guide](./instructions/linting-instructions.md)** - Biome setup and rules
- **[Dependencies Guide](./instructions/dependencies-instructions.md)** - Package management
- **[DaisyUI Guide](./instructions/daisyui-instructions.md)** - UI components
- **[MCP Guide](./instructions/mcp-instructions.md)** - Model Context Protocol setup

### Additional Documentation

- [Biome Setup](./docs/biome-setup.md) - Legacy Biome configuration guide
- [Job API Service](./docs/job-api-service.md) - API integration documentation

## Backend Integration

> 🔗 **This frontend REQUIRES the backend API to function**

This frontend communicates with the **team4-job-app-backend** REST API for all job data operations.

### Backend Setup

- **Backend Repository**: [team4-job-app-backend](../team4-job-app-backend)
- **Default API URL**: `http://localhost:8080` (configurable via `.env`)
- **Backend Port**: Usually runs on `http://localhost:3001` or `http://localhost:8080`
- **Communication**: Axios HTTP client via `JobService` class

### First-Time Backend Setup

```bash
# Navigate to backend directory
cd ../team4-job-app-backend

# Install dependencies
npm install

# Seed the database (REQUIRED - first time only)
npm run db:seed

# Start backend in development mode
npm run dev
```

The backend will start on `http://localhost:3001` or the configured port.

### Running Both Applications

**Terminal 1 - Backend:**
```bash
cd team4-job-app-backend
npm run dev
# ✅ Backend running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd team4-job-app-frontend
npm run dev
# ✅ Frontend running on http://localhost:3000
```

### What Happens Without Backend?

If you try to run the frontend without the backend:
- ❌ Job listings page will fail to load
- ❌ Job details pages will show errors
- ❌ Creating new jobs will fail
- ❌ Homepage will not display latest jobs

**Error Example:**
```
Error: connect ECONNREFUSED 127.0.0.1:8080
```

**Solution**: Always start the backend first!

### Environment Configuration

Configure the backend URL in `.env`:

```bash
# Frontend .env
PORT=3000
API_BASE_URL=http://localhost:8080  # Must match backend port
```

```bash
# Backend .env (in team4-job-app-backend)
PORT=3001  # or 8080 to match API_BASE_URL
```

## Testing

Run tests with Vitest:

```bash
npm test           # Watch mode
npm run test:run   # Single run
npm run test:coverage  # With coverage
```

Test files are located alongside source files with `.test.ts` extension.

## Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
PORT=3000

# Backend API
API_BASE_URL=http://localhost:8080
```

## License

ISC
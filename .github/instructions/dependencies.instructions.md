# Dependencies Management Instructions

> **Version Requirements**: Always use the latest stable versions of all dependencies

## Overview

This project uses **npm** as the package manager. All dependencies are managed through `package.json` and locked with `package-lock.json`.

---

## Package Manager

### NPM (Node Package Manager)

**Always use the latest LTS version of Node.js**, which includes npm.

```bash
# Check versions
node --version    # Should be v18+ (latest LTS: v20+)
npm --version     # Should be v9+ (latest: v10+)

# Update npm to latest
npm install -g npm@latest
```

### Why NPM?
- ✅ Default Node.js package manager
- ✅ Excellent lock file support
- ✅ Built-in security auditing
- ✅ Workspace support for monorepos
- ✅ Fast with modern versions (v7+)

---

## Core Dependencies

### Production Dependencies

These are required to run the application in production:

```json
{
  "dependencies": {
    "axios": "^1.12.2",           // HTTP client for API calls
    "dotenv": "^17.2.3",          // Environment variable management
    "express": "^5.1.0",          // Web framework
    "nunjucks": "^3.2.4"          // Templating engine
  }
}
```

#### axios
- **Purpose**: HTTP client for making API requests to backend
- **Latest Version**: Check https://www.npmjs.com/package/axios
- **Usage**: `src/services/jobService.ts`
- **Update**: `npm install axios@latest`

#### dotenv
- **Purpose**: Load environment variables from `.env` file
- **Latest Version**: Check https://www.npmjs.com/package/dotenv
- **Usage**: `src/index.ts` - `dotenv.config()`
- **Update**: `npm install dotenv@latest`

#### express
- **Purpose**: Web framework for routing and middleware
- **Latest Version**: Check https://www.npmjs.com/package/express
- **Current**: v5.1.0 (latest major version)
- **Update**: `npm install express@latest`

#### nunjucks
- **Purpose**: Server-side templating engine
- **Latest Version**: Check https://www.npmjs.com/package/nunjucks
- **Usage**: Rendering HTML views in `views/` directory
- **Update**: `npm install nunjucks@latest`

### Development Dependencies

These are only needed during development:

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.2.4",              // Linter and formatter
    "@tailwindcss/cli": "^4.1.0",           // TailwindCSS CLI tool
    "@types/express": "^5.0.3",             // TypeScript types for Express
    "@types/node": "^24.6.0",               // TypeScript types for Node.js
    "@types/nunjucks": "^3.2.6",            // TypeScript types for Nunjucks
    "autoprefixer": "^10.4.21",             // CSS vendor prefixing
    "chokidar": "^3.6.0",                   // File watching utility
    "concurrently": "^9.1.0",               // Run multiple commands
    "daisyui": "^5.1.26",                   // UI component library
    "postcss": "^8.5.6",                    // CSS transformation tool
    "tailwindcss": "^4.1.14",               // Utility-first CSS framework
    "tsx": "^4.20.6",                       // TypeScript execution with hot reload
    "typescript": "^5.9.2",                 // TypeScript compiler
    "vitest": "^3.2.4"                      // Testing framework
  }
}
```

---

## Installing Dependencies

### Fresh Install
```bash
# Install all dependencies from package.json
npm install

# or shorthand
npm i
```

This creates:
- `node_modules/` directory with all packages
- `package-lock.json` with exact version information

### Clean Install (CI/CD)
```bash
# Remove node_modules and install from lock file
npm ci
```

**Use `npm ci` when**:
- Running in CI/CD pipelines
- Want exact versions from lock file
- Ensuring reproducible builds

**Benefits**:
- Faster than `npm install`
- Fails if `package.json` and lock file are out of sync
- Always installs exact versions

---

## Adding New Dependencies

### Production Dependency
```bash
# Install and save to dependencies
npm install <package-name>@latest

# Examples
npm install mongoose@latest
npm install helmet@latest
```

### Development Dependency
```bash
# Install and save to devDependencies
npm install --save-dev <package-name>@latest

# or shorthand
npm install -D <package-name>@latest

# Examples
npm install -D @types/express@latest
npm install -D vitest@latest
```

### Global Package (Rarely Needed)
```bash
# Install globally (use sparingly)
npm install -g <package-name>@latest

# Examples
npm install -g typescript@latest
npm install -g tsx@latest
```

---

## Updating Dependencies

### Check for Outdated Packages
```bash
# List outdated packages
npm outdated

# Output shows:
# Package        Current  Wanted  Latest  Location
# axios          1.12.0   1.12.2  1.13.0  project
```

### Update Single Package
```bash
# Update to latest minor/patch within semver range
npm update <package-name>

# Update to absolute latest version (including major)
npm install <package-name>@latest

# Examples
npm install axios@latest
npm install typescript@latest
```

### Update All Packages
```bash
# Update all to latest within semver ranges
npm update

# Update all to absolute latest (careful!)
# Use a tool like npm-check-updates
npx npm-check-updates -u
npm install
```

### Interactive Update (Recommended)
```bash
# Install npm-check-updates
npm install -g npm-check-updates

# Check what can be updated
ncu

# Update package.json to latest versions
ncu -u

# Install updated packages
npm install
```

---

## Version Ranges (Semver)

### Understanding Semver Symbols

```json
{
  "axios": "1.12.2",      // Exact version only
  "axios": "^1.12.2",     // Latest minor/patch (1.x.x)
  "axios": "~1.12.2",     // Latest patch only (1.12.x)
  "axios": "*",           // Any version (dangerous!)
  "axios": ">=1.12.2",    // Greater than or equal
  "axios": "latest"       // Always latest (not in package.json)
}
```

### Recommendations

✅ **Use `^` (caret) for most dependencies** (default):
- Allows minor and patch updates
- Usually safe (follows semver)
- Example: `"express": "^5.1.0"` allows 5.1.x and 5.x.x but not 6.x.x

✅ **Use exact versions for critical packages**:
- No symbol: `"typescript": "5.9.2"`
- Ensures consistency across environments

❌ **Avoid `*` or `latest`**:
- Unpredictable builds
- Can break production

---

## Security

### Audit Dependencies
```bash
# Check for known vulnerabilities
npm audit

# View detailed report
npm audit --json

# Automatically fix vulnerabilities
npm audit fix

# Fix including breaking changes (careful!)
npm audit fix --force
```

### Best Practices

1. **Run audits regularly**:
```bash
# Add to pre-commit hook
npm audit
```

2. **Review security advisories**:
- Check GitHub Dependabot alerts
- Subscribe to npm security advisories

3. **Update promptly**:
- Security patches should be applied immediately
- Test after updates

4. **Use `.npmrc` for security**:
```
# .npmrc
audit-level=moderate
save-exact=false
package-lock=true
```

---

## Key Dependencies Guide

### @biomejs/biome
```bash
# Current: 2.2.4
# Latest: npm view @biomejs/biome version
npm install -D @biomejs/biome@latest

# Usage
npm run lint
npm run format
```

### TailwindCSS + DaisyUI
```bash
# TailwindCSS (utility-first CSS)
npm install -D tailwindcss@latest @tailwindcss/cli@latest

# DaisyUI (component library)
npm install -D daisyui@latest

# Configuration
# tailwind.config.js
# Run: npm run build:css
```

### TypeScript
```bash
# TypeScript compiler
npm install -D typescript@latest

# Type definitions
npm install -D @types/node@latest
npm install -D @types/express@latest
npm install -D @types/nunjucks@latest

# Configuration: tsconfig.json
# Compile: npm run build
```

### Vitest
```bash
# Testing framework
npm install -D vitest@latest

# Configuration: vitest.config.ts
# Run: npm test
```

### tsx
```bash
# TypeScript execution with hot reload
npm install -D tsx@latest

# Usage
npx tsx src/index.ts
# or
npm run dev
```

### concurrently
```bash
# Run multiple npm scripts simultaneously
npm install -D concurrently@latest

# Usage in package.json
"dev": "concurrently \"npm run build:css:watch\" \"tsx watch src/index.ts\""
```

---

## Managing Type Definitions

### Installing Types
```bash
# For packages without built-in types
npm install -D @types/<package-name>@latest

# Examples
npm install -D @types/express@latest
npm install -D @types/node@latest
npm install -D @types/nunjucks@latest
```

### Finding Type Packages
```bash
# Search for types
npm search @types/<package-name>

# Or check DefinitelyTyped
# https://github.com/DefinitelyTyped/DefinitelyTyped
```

---

## Lock Files

### package-lock.json

**Always commit `package-lock.json`** to version control.

**Purpose**:
- Locks exact versions of all dependencies
- Ensures reproducible builds
- Faster installs

**When to Update**:
```bash
# After adding new package
npm install <package>

# After updating packages
npm update

# After changing package.json manually
npm install
```

**Resolving Conflicts**:
```bash
# If lock file has conflicts
rm package-lock.json
npm install

# Or use npm to fix
npm install --package-lock-only
```

---

## Troubleshooting

### Issue: "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: "ERESOLVE unable to resolve dependency tree"
```bash
# Use legacy peer deps (temporary)
npm install --legacy-peer-deps

# Or use force (not recommended)
npm install --force

# Better: Update conflicting packages
npm update
```

### Issue: "gyp ERR! build error"
```bash
# Install build tools (macOS)
xcode-select --install

# Install build tools (Linux)
sudo apt-get install build-essential

# Install build tools (Windows)
npm install -g windows-build-tools
```

### Issue: Slow installs
```bash
# Clear npm cache
npm cache clean --force

# Use faster registry (temporarily)
npm install --registry=https://registry.npmjs.org/

# Update npm
npm install -g npm@latest
```

---

## Package Scripts

### Defined in package.json

```json
{
  "scripts": {
    "dev": "npm run build:css && concurrently \"npm run build:css:watch\" \"tsx watch src/index.ts\"",
    "build": "npm run build:css && tsc",
    "build:css": "npx @tailwindcss/cli -i ./styles/main.css -o ./dist/styles.css",
    "build:css:watch": "npx @tailwindcss/cli -i ./styles/main.css -o ./dist/styles.css --watch",
    "start": "node dist/src/index.js",
    "start:prod": "npm run build && npm start",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "check": "biome check ."
  }
}
```

### Running Scripts
```bash
# Run any script
npm run <script-name>

# Special scripts (npm shortcuts)
npm start     # Runs "start" script
npm test      # Runs "test" script
npm run dev   # Custom scripts need "run"
```

---

## Environment-Specific Dependencies

### Development Only
```json
{
  "devDependencies": {
    "@biomejs/biome": "latest",
    "tsx": "latest",
    "vitest": "latest"
  }
}
```

### Production Only
```bash
# Install only production dependencies
npm install --production

# or
npm ci --production
```

---

## Best Practices

### 1. Keep Dependencies Updated
```bash
# Weekly/monthly check
npm outdated
npm update
```

### 2. Minimize Dependencies
- Only install what you need
- Consider bundle size
- Avoid duplicate functionality

### 3. Audit Regularly
```bash
npm audit
npm audit fix
```

### 4. Use Exact Versions for Critical Packages
```json
{
  "dependencies": {
    "typescript": "5.9.2"  // No ^ or ~
  }
}
```

### 5. Document Required Node Version
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 6. Commit Lock File
- Always commit `package-lock.json`
- Never add to `.gitignore`

### 7. Use npm ci in CI/CD
```bash
# In GitHub Actions, CircleCI, etc.
npm ci
```

---

## Upgrading Major Versions

### Process

1. **Check Breaking Changes**:
   - Read CHANGELOG.md
   - Check migration guides
   - Review GitHub issues

2. **Update in Development**:
```bash
npm install <package>@latest
```

3. **Test Thoroughly**:
```bash
npm test
npm run build
npm run dev
```

4. **Update Code if Needed**:
   - Fix TypeScript errors
   - Update API calls
   - Refactor deprecated features

5. **Commit Changes**:
```bash
git add package.json package-lock.json
git commit -m "chore: upgrade <package> to vX.X.X"
```

---

## Resources

- **npm Docs**: https://docs.npmjs.com/
- **Semver**: https://semver.org/
- **Package Search**: https://www.npmjs.com/
- **Security Advisories**: https://github.com/advisories
- **npm-check-updates**: https://github.com/raineorshine/npm-check-updates

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm ci` | Clean install (CI/CD) |
| `npm install <pkg>@latest` | Install specific package |
| `npm update` | Update packages within semver |
| `npm outdated` | Check for outdated packages |
| `npm audit` | Check for vulnerabilities |
| `npm audit fix` | Fix vulnerabilities |
| `npm list` | List installed packages |
| `npm run <script>` | Run package script |

---

**Last Updated**: October 9, 2025
**Node Version**: v18+ (latest LTS: v20+)
**NPM Version**: v9+ (latest: v10+)
**Always use the latest stable versions**

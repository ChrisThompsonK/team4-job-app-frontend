# Biome Setup Documentation

## Overview
Biome has been successfully set up for the Team 4 Job Application Frontend project. Biome is a fast, modern linter and formatter for JavaScript, TypeScript, and JSON files.

## What was installed
- **@biomejs/biome** v2.2.4 (latest at time of setup)
- Added as an exact version dev dependency

## Configuration Files Created

### `biome.json`
- Main configuration file with optimized settings for TypeScript/Node.js project
- Features enabled:
  - **Formatter**: 2-space indentation, 100 character line width, double quotes
  - **Linter**: Recommended rules + Node.js specific rules
  - **VCS Integration**: Git integration enabled
  - **Import Sorting**: Automatic import organization
  - **JSON Formatting**: Enabled for JSON files

### `.biomeignore`
- Excludes common files/directories from Biome checking:
  - `node_modules/`, `dist/`, build output
  - Log files, environment files, IDE files
  - OS generated files
  - Package manager lock files

## Scripts Added to package.json

```json
{
  "lint": "biome check .",
  "lint:fix": "biome check --write .",
  "format": "biome format --write .",
  "format:check": "biome format .",
  "check": "biome check ."
}
```

## Usage

### Check for issues (no fixes applied):
```bash
npm run check
# or
npm run lint
```

### Check and automatically fix issues:
```bash
npm run lint:fix
```

### Format code only:
```bash
npm run format
```

### Check formatting without fixing:
```bash
npm run format:check
```

## What Biome Fixed
1. **Code Formatting**:
   - Changed single quotes to double quotes
   - Standardized indentation to 2 spaces
   - Consistent semicolon usage
   - Proper JSON formatting in tsconfig.json

2. **Linting**:
   - Fixed unused parameter in Express route handler (prefixed with underscore)

## Integration with Development Workflow

### Pre-commit hooks (recommended)
Consider adding Biome to your pre-commit hooks:
```bash
npm install --save-dev husky lint-staged
```

### VS Code Extension
Install the official Biome VS Code extension for real-time linting and formatting:
- Extension ID: `biomejs.biome`

### CI/CD Integration
Add to your GitHub Actions workflow:
```yaml
- name: Run Biome
  run: npm run check
```

## Benefits over ESLint + Prettier
- **Faster**: Single tool instead of multiple tools
- **Simpler**: One configuration file
- **Modern**: Built with Rust for performance
- **All-in-one**: Linting, formatting, and import sorting

## Next Steps
1. Install Biome VS Code extension for team members
2. Add Biome check to CI/CD pipeline
3. Consider adding pre-commit hooks
4. Update team documentation with Biome usage guidelines
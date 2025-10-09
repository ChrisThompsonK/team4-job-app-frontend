# Linting & Formatting Instructions (Biome)

> **Version Requirements**: Always use the latest stable version of Biome (currently v2.2.4+)

## Overview

This project uses **Biome** as the primary linting and formatting tool. Biome is a fast, modern alternative to ESLint and Prettier, written in Rust, providing both linting and formatting in a single tool.

---

## Why Biome?

### Advantages Over ESLint + Prettier
- ⚡ **90x faster** than ESLint
- 🎯 **Single tool** for linting and formatting (no conflicts)
- 📦 **Zero config** out of the box
- 🔧 **Auto-fix** most issues automatically
- 🚀 **Native TypeScript** support
- 📝 **Better error messages** with context

---

## Installation

Biome is already installed as a dev dependency:

```bash
npm install --save-dev @biomejs/biome@latest
```

### VS Code Extension (Highly Recommended)

1. Open VS Code Extensions (Cmd/Ctrl + Shift + X)
2. Search for "Biome"
3. Install **Biome** by `biomejs.biome`
4. Reload VS Code

**Benefits**:
- Real-time linting as you type
- Format on save
- Inline error messages
- Quick fixes with Cmd/Ctrl + .

---

## Configuration

### biome.json

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useNodejsImportProtocol": "error",
        "useTemplate": "error"
      },
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  },
  "json": {
    "formatter": {
      "enabled": true
    }
  },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

### Configuration Breakdown

#### VCS Integration
```json
"vcs": {
  "enabled": true,
  "clientKind": "git",
  "useIgnoreFile": true
}
```
- Respects `.gitignore` patterns
- Only checks tracked/modified files
- Integrates with Git workflow

#### Formatter Settings
```json
"formatter": {
  "indentStyle": "space",    // Use spaces, not tabs
  "indentWidth": 2,          // 2 spaces per indent level
  "lineWidth": 100           // Max 100 characters per line
}
```

#### JavaScript/TypeScript Settings
```json
"javascript": {
  "formatter": {
    "quoteStyle": "double",      // Use "double quotes"
    "semicolons": "always",      // Always require semicolons
    "trailingCommas": "es5"      // Trailing commas in objects/arrays
  }
}
```

#### Linter Rules
```json
"linter": {
  "rules": {
    "recommended": true,                    // Use Biome's recommended rules
    "style": {
      "useNodejsImportProtocol": "error",  // Enforce node: protocol
      "useTemplate": "error"                // Prefer template literals
    },
    "suspicious": {
      "noUnknownAtRules": "off"            // Allow CSS @rules (for Tailwind)
    }
  }
}
```

---

## Available Commands

### Check (Lint + Format Check)
```bash
npm run check
# or
npm run lint
```
- Checks for linting errors
- Checks for formatting issues
- **Does not modify files**
- Exit code 1 if issues found

### Fix (Auto-fix Issues)
```bash
npm run lint:fix
```
- Fixes all auto-fixable linting errors
- Applies formatting to all files
- **Modifies files in place**
- Reports unfixable issues

### Format Only
```bash
npm run format
```
- Only applies formatting
- Does not run linter
- Modifies files

### Format Check Only
```bash
npm run format:check
```
- Only checks formatting
- Does not modify files
- Useful for CI/CD

---

## Development Workflow

### 🚨 CRITICAL: After Every Code Change

**ALWAYS run Biome check after any code modification**, especially:
- ✅ After accepting Copilot suggestions
- ✅ After AI-generated code (Claude, ChatGPT, etc.)
- ✅ After manual edits
- ✅ After copy-pasting code
- ✅ After refactoring
- ✅ Before saving/committing

```bash
# After EVERY code change (AI or manual)
npm run lint:fix

# Verify the fix worked
npm run check
```

**Why this matters**:
- AI-generated code may not follow project style guidelines
- Copilot suggestions may use inconsistent formatting
- Auto-fixes prevent accumulating technical debt
- Catches errors early before they compound

### 1. Standard Workflow (After Every Edit)
```bash
# Step 1: Make code changes (manual or AI-assisted)

# Step 2: IMMEDIATELY run lint fix
npm run lint:fix

# Step 3: Verify no remaining issues
npm run check

# Step 4: If errors remain, fix manually
# (Biome will tell you exactly what needs fixing)

# Step 5: Re-check
npm run check
```

### 2. Before Committing
```bash
# Final checks before git commit
npm run check         # Must pass with no errors
npm run test:run      # All tests must pass
npm run build         # Build must succeed
```

### 3. Pre-merge Checklist
```bash
npm run premerge
```
This command runs:
1. Code quality check (`npm run check`)
2. Format check (`npm run format:check`)
3. All tests (`npm run test:run`)
4. Build (`npm run build`)

### 4. CI/CD Pipeline
```yaml
# .github/workflows/code-quality.yml
- name: Check code quality
  run: npm run check

- name: Check formatting
  run: npm run format:check

- name: Run tests
  run: npm run test:run
```

---

## Common Rules and Fixes

### 1. Import Protocol

❌ **Bad**:
```typescript
import path from "path";
import fs from "fs";
```

✅ **Good**:
```typescript
import path from "node:path";
import fs from "node:fs";
```

**Why**: Modern Node.js best practice for built-in modules

### 2. Template Literals

❌ **Bad**:
```typescript
const message = "Hello, " + name + "!";
const url = "/jobs/" + jobId;
```

✅ **Good**:
```typescript
const message = `Hello, ${name}!`;
const url = `/jobs/${jobId}`;
```

**Why**: More readable and less error-prone

### 3. Quote Style

❌ **Bad**:
```typescript
const name = 'John';
const message = `Hello`;  // No interpolation
```

✅ **Good**:
```typescript
const name = "John";
const message = "Hello";
```

**Why**: Consistency across codebase

### 4. Semicolons

❌ **Bad**:
```typescript
const x = 5
const y = 10
```

✅ **Good**:
```typescript
const x = 5;
const y = 10;
```

**Why**: Prevents ASI (Automatic Semicolon Insertion) bugs

### 5. Trailing Commas

❌ **Bad**:
```typescript
const obj = {
  name: "John",
  age: 30
};

const arr = [
  1,
  2,
  3
];
```

✅ **Good**:
```typescript
const obj = {
  name: "John",
  age: 30,
};

const arr = [
  1,
  2,
  3,
];
```

**Why**: Cleaner git diffs when adding items

### 6. Unused Variables

❌ **Bad**:
```typescript
const unused = 5;
const result = calculate();
```

✅ **Good**:
```typescript
const _unused = 5;  // Prefix with _ if intentionally unused
const result = calculate();
```

### 7. No Console Logs (Production)

⚠️ **Warning**:
```typescript
console.log("Debug info");  // Remove before committing
```

✅ **Good**:
```typescript
// Use proper logging in production
logger.info("Debug info");

// Or remove entirely
```

### 8. Type Safety

❌ **Bad**:
```typescript
function greet(name: any) {
  return `Hello ${name}`;
}
```

✅ **Good**:
```typescript
function greet(name: string): string {
  return `Hello ${name}`;
}
```

---

## Ignoring Files

### .biomeignore

Create a `.biomeignore` file (similar to `.gitignore`):

```
# Dependencies
node_modules/

# Build output
dist/
build/

# Generated files
*.min.js
*.bundle.js

# Database
data/
*.sqlite

# Compiled CSS
dist/styles.css

# Test coverage
coverage/
```

### Inline Ignore Comments

```typescript
// biome-ignore lint/suspicious/noExplicitAny: Third-party library types
function handleExternal(data: any) {
  // ...
}

// biome-ignore format: Intentional formatting for readability
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

**Use sparingly!** Only when absolutely necessary.

---

## VS Code Integration

### settings.json (Workspace) - RECOMMENDED SETUP

Create or update `.vscode/settings.json` in your project root:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true
  },
  "github.copilot.enable": {
    "*": true
  },
  "editor.inlineSuggest.enabled": true
}
```

**✨ With this setup**:
- Biome auto-formats every time you save (Cmd/Ctrl + S)
- Copilot suggestions are automatically formatted on save
- No need to manually run `npm run lint:fix` (but still good to verify)
- Imports are automatically organized

### Workflow with Format on Save

```typescript
// 1. Write or accept Copilot code
const data = fetchData()  // ← Missing semicolon, wrong quotes

// 2. Press Cmd/Ctrl + S (save)
//    → Biome automatically formats:
const data = fetchData(); // ← Fixed!

// 3. Continue coding with confidence
```

### Manual Format (if needed)

If format on save is disabled or you want to format manually:

- **Format Document**: `Shift + Alt + F` (Windows/Linux) or `Shift + Option + F` (Mac)
- **Quick Fix**: `Cmd/Ctrl + .` (apply suggested fixes)
- **Organize Imports**: `Shift + Alt + O` (Windows/Linux) or `Shift + Option + O` (Mac)

### Verifying VS Code Integration

1. Install Biome extension: `biomejs.biome`
2. Open a TypeScript file
3. Make a formatting error (e.g., use single quotes)
4. Save the file (Cmd/Ctrl + S)
5. File should auto-format to double quotes

If it doesn't work:
- Check extension is installed and enabled
- Verify `.vscode/settings.json` exists
- Restart VS Code
- Check Output panel: View → Output → Select "Biome"

---

## Migration from ESLint/Prettier

If migrating from ESLint/Prettier:

### 1. Remove Old Dependencies
```bash
npm uninstall eslint prettier eslint-config-prettier eslint-plugin-*
```

### 2. Remove Old Config Files
```bash
rm .eslintrc.* .prettierrc.* .prettierignore
```

### 3. Install Biome
```bash
npm install --save-dev @biomejs/biome@latest
```

### 4. Initialize Config
```bash
npx @biomejs/biome init
```

### 5. Update Scripts
```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "format:check": "biome format ."
  }
}
```

---

## Troubleshooting

### Issue: "Biome command not found"
```bash
# Install globally
npm install -g @biomejs/biome@latest

# Or use npx
npx @biomejs/biome check .
```

### Issue: "Configuration file not found"
```bash
# Initialize config
npx @biomejs/biome init
```

### Issue: "VS Code not formatting"
1. Check Biome extension is installed and enabled
2. Check `settings.json` has correct formatter
3. Restart VS Code
4. Check output panel for errors (View > Output > Select "Biome")

### Issue: "Too many errors"
```bash
# Fix automatically first
npm run lint:fix

# Then check remaining issues
npm run check
```

### Issue: "Conflicting rules with existing code"
```bash
# Format entire codebase at once
npm run format

# Then fix linting issues
npm run lint:fix
```

---

## Best Practices

### 1. ⚡ ALWAYS Run After AI/Copilot Code Changes
```bash
# MANDATORY after accepting Copilot suggestions or AI code
npm run lint:fix

# Verify it worked
npm run check
```

**Critical Rule**: Never commit AI-generated or Copilot code without running `npm run lint:fix` first.

### 2. Run Before Every Commit
```bash
# Add to pre-commit hook
npm run check
```

### 3. Enable Format on Save in VS Code
Add to `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

Benefits:
- Automatic formatting as you type
- No need to remember to run commands
- Instant feedback on code quality

### 4. Copilot Integration Workflow
```typescript
// 1. Accept Copilot suggestion
const result = await fetchData(); // ← Copilot suggested this

// 2. IMMEDIATELY save file (triggers format on save if enabled)
// OR run: npm run lint:fix

// 3. Review the formatted code
// 4. Proceed with development
```

### 5. Don't Disable Rules Without Reason
- If a rule seems annoying, there's usually a good reason
- Discuss with team before disabling
- Document why you're ignoring (use comments)

### 6. Keep Configuration Simple
- Start with recommended rules
- Only add custom rules when needed
- Don't fight the linter - adapt your code

### 7. Document Ignores (Use Sparingly)
```typescript
// biome-ignore lint/suspicious/noExplicitAny: API response from legacy system has dynamic structure
const data: any = await legacyApi.fetch();
```

**Only ignore rules when absolutely necessary!**

### 8. Regular Updates
```bash
# Update Biome to latest version monthly
npm update @biomejs/biome

# Check what changed
npx @biomejs/biome --version
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Code Quality

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run check
      - run: npm run format:check
```

### Pre-commit Hook
```bash
# Install husky
npm install --save-dev husky

# Create pre-commit hook
npx husky add .husky/pre-commit "npm run check"
```

---

## Performance

Biome is extremely fast:

```
ESLint + Prettier: ~5-10 seconds
Biome: ~0.1-0.5 seconds
```

For large projects:
- 90x faster than ESLint
- 30x faster than Prettier
- Single pass for both linting and formatting

---

## Resources

- **Official Docs**: https://biomejs.dev/
- **Linter Rules**: https://biomejs.dev/linter/rules/
- **Formatter Options**: https://biomejs.dev/formatter/
- **VS Code Extension**: https://marketplace.visualstudio.com/items?itemName=biomejs.biome
- **Migration Guide**: https://biomejs.dev/guides/migrate-eslint-prettier/

---

## 🤖 AI/Copilot Workflow Summary

### Every Time You Accept AI-Generated Code:

1. **Accept Copilot suggestion** or paste AI-generated code
2. **Save file** (Cmd/Ctrl + S) - if format on save is enabled
3. **OR run** `npm run lint:fix` manually
4. **Verify** with `npm run check`
5. **Review** the changes to ensure correctness
6. **Proceed** with confidence

### Why This Is Critical:

- ❌ AI/Copilot may generate code with:
  - Single quotes instead of double quotes
  - Missing semicolons
  - Inconsistent indentation
  - Wrong import styles (`import fs from "fs"` instead of `import fs from "node:fs"`)
  - Any types instead of proper types
  
- ✅ Running `npm run lint:fix` ensures:
  - Consistent code style across the project
  - No accumulation of style violations
  - Catching potential bugs early
  - Easier code reviews
  - CI/CD pipeline success

### Golden Rule:

> **Never commit AI-generated or Copilot code without running `npm run lint:fix` first!**

---

## Quick Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run lint:fix` | **Fix all auto-fixable issues** | **After EVERY code change** |
| `npm run check` | Check for all issues (no changes) | Before committing |
| `npm run format` | Format all files | Rarely needed (lint:fix does this) |
| `npm run format:check` | Check formatting only | CI/CD pipelines |
| `npx @biomejs/biome --help` | Show all CLI options | Reference |

### Quick Workflow Commands

```bash
# After accepting Copilot code
npm run lint:fix && npm run check

# Before committing
npm run check && npm run test:run

# Full pre-merge check
npm run premerge
```

---

**Last Updated**: October 9, 2025
**Biome Version**: 2.2.4+ (always use latest stable)

**🎯 Remember**: Format on save + `npm run lint:fix` after AI code = Happy codebase!

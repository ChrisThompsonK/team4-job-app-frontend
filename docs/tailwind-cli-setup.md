# Tailwind CSS CLI Setup

This document outlines the migration from PostCSS-based Tailwind CSS to the standalone Tailwind CLI approach.

## Changes Made

### 1. Updated Dependencies

**Removed:**
- `autoprefixer`: No longer needed with Tailwind CLI
- `postcss`: No longer needed with Tailwind CLI

**Updated:**
- `tailwindcss`: Updated to v4.1.0
- Added `@tailwindcss/cli`: v4.1.0 for the standalone CLI

### 2. Removed Configuration Files

- **Deleted:** `postcss.config.js` - Not needed with CLI approach

### 3. Updated Build Scripts

**Before:**
```json
"build:css": "npx tailwindcss -i ./styles/main.css -o ./dist/styles.css --watch=false",
"build:css:watch": "npx tailwindcss -i ./styles/main.css -o ./dist/styles.css --watch"
```

**After:**
```json
"build:css": "npx @tailwindcss/cli -i ./styles/main.css -o ./dist/styles.css",
"build:css:watch": "npx @tailwindcss/cli -i ./styles/main.css -o ./dist/styles.css --watch"
```

### 4. Updated CSS Format for Tailwind v4

**Before (v3 format):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-custom {
    @apply px-4 py-2 rounded-lg font-semibold transition-colors duration-200;
  }
}
```

**After (v4 format):**
```css
@import "tailwindcss";

@utility btn-custom {
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
```

### 5. Updated Tailwind Configuration

- Updated `content` paths to include `.njk` files from the `views` directory
- Maintained all existing DaisyUI configuration

## Benefits of CLI Approach

1. **Simplified Build Process**: No need for PostCSS configuration
2. **Better Performance**: Direct CLI compilation is often faster
3. **Reduced Dependencies**: Fewer npm packages to manage
4. **Latest Features**: Access to Tailwind v4 features and improvements

## Development Workflow

### Building CSS (One-time)
```bash
npm run build:css
```

### Watching for Changes (Development)
```bash
npm run build:css:watch
```

### Complete Build (Production)
```bash
npm run build
```

### Development with Auto-rebuild
```bash
npm run dev
```

## File Structure

```
styles/
  main.css          # Main Tailwind CSS file with custom utilities
dist/
  styles.css        # Generated CSS output
tailwind.config.js  # Tailwind configuration (unchanged functionality)
```

## Notes

- The generated CSS file will be much smaller in production builds due to Tailwind v4's improved purging
- Custom utilities now use the `@utility` API instead of `@layer` directives
- Base styles are written in standard CSS rather than using `@apply`
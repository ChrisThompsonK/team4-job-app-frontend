# View Migration to Tailwind CSS

This document outlines the migration of the application views from custom CSS to Tailwind CSS styling.

## Changes Made

### 1. Updated HTML Templates

**Both `views/index.njk` and `views/jobs.njk` were updated with:**

- **CSS Links**: Replaced multiple CSS file links with a single link to `/styles.css` (our compiled Tailwind CSS)
- **Tailwind Classes**: Converted all custom CSS classes to Tailwind utility classes
- **Responsive Design**: Enhanced with Tailwind's responsive utilities (`md:grid-cols-2`, `md:col-span-2`)
- **Interactive States**: Added hover effects and transitions using Tailwind classes

### 2. Removed Custom CSS Files

**Deleted the following files:**
- `styles/common.css` - Common styles across pages
- `styles/jobs.css` - Job page specific styles  
- `styles/index.css` - Home page specific styles
- `styles/components.css` - Component-specific styles

**Kept:**
- `styles/main.css` - Main Tailwind CSS file with custom utilities

### 3. Updated Server Configuration

**Modified `src/index.ts`:**
```typescript
// Before
app.use(express.static(path.join(process.cwd(), "styles")));

// After  
app.use(express.static(path.join(process.cwd(), "dist")));
app.use("/js", express.static(path.join(process.cwd(), "js")));
```

This change ensures:
- The compiled `styles.css` is served from the `/dist` directory
- JavaScript files are still served from the `/js` directory

## Styling Conversion Details

### Navigation
**Before (Custom CSS):**
```css
nav a {
  color: #007bff;
  text-decoration: none;
  margin: 0 1rem;
}
```

**After (Tailwind):**
```html
<a href="/" class="text-blue-600 hover:text-blue-800 hover:underline mx-4 font-medium">
```

### Job Cards
**Before (Custom CSS):**
```css
.job-item {
  background: #f8f9fa;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
```

**After (Tailwind):**
```html
<div class="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
```

### Responsive Grid
**Before (Custom CSS):**
```css
.job-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .job-details {
    grid-template-columns: 1fr;
  }
}
```

**After (Tailwind):**
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
```

## Benefits Achieved

1. **Reduced File Count**: Eliminated 4 custom CSS files
2. **Consistency**: All styling now uses Tailwind's design system
3. **Maintainability**: Styles are co-located with HTML in templates
4. **Responsive Design**: Enhanced mobile responsiveness with Tailwind's responsive utilities
5. **Performance**: Single CSS file reduces HTTP requests
6. **Modern Styling**: Updated visual design with improved hover effects and transitions

## File Structure After Migration

```
styles/
  main.css          # Main Tailwind CSS with custom utilities
dist/
  styles.css        # Compiled Tailwind CSS (served to browser)
views/
  index.njk         # Home page template (updated)
  jobs.njk          # Jobs page template (updated)
src/
  index.ts          # Server configuration (updated)
```

## Development Workflow

1. **CSS Changes**: Edit `styles/main.css` for custom utilities
2. **Template Changes**: Edit `.njk` files using Tailwind classes
3. **Build CSS**: Run `npm run build:css` to compile changes
4. **Development**: Use `npm run dev` for auto-rebuilding
5. **Production**: Run `npm run build` for complete build

## Testing

The server successfully runs on `http://localhost:3000` with all styling working correctly:
- Home page displays with proper Tailwind styling
- Jobs page shows job listings with responsive grid layout
- Navigation works and maintains consistent styling
- Hover effects and transitions function as expected
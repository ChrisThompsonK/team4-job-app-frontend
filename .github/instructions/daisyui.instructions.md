# DaisyUI Component Library Instructions

> **Version Requirements**: Always use the latest stable version of DaisyUI (currently v5.1.26+) and TailwindCSS (currently v4.1.14+)

## Overview

**DaisyUI** is a component library built on top of TailwindCSS. It provides pre-styled, accessible components using simple class names while maintaining the flexibility of utility-first CSS.

---

## Why DaisyUI?

### Advantages
- 🎨 **60+ Components** out of the box
- ♿ **Fully Accessible** (ARIA labels, keyboard navigation)
- 🎭 **30+ Themes** built-in
- 🔧 **Customizable** via TailwindCSS
- 📦 **Small Bundle Size** (~5KB gzipped)
- 🚀 **No JavaScript Required** (pure CSS)
- 💅 **Semantic Class Names** (`.btn`, `.card`, not `.flex.items-center`)

---

## Installation

### Already Installed
DaisyUI is included as a dev dependency:

```bash
npm install -D daisyui@latest tailwindcss@latest
```

### Configuration

**File**: `tailwind.config.js`

```javascript
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./views/**/*.{html,njk}",      // Include Nunjucks templates
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")  // Add DaisyUI plugin
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],  // Enable specific themes
    base: true,          // Apply base styles
    styled: true,        // Include component styles
    utils: true,         // Add utility classes
    prefix: "",          // No prefix for DaisyUI classes
    logs: true,          // Show info in terminal
    themeRoot: ":root",  // CSS variable root element
  },
};
```

---

## Themes

### Available Themes

DaisyUI includes **30+ built-in themes**:

```
light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro,
cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel,
fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business,
acid, lemonade, night, coffee, winter
```

### Setting Theme

#### In HTML (Global)
```html
<html lang="en" data-theme="light">
```

#### In Nunjucks Template
```html
<!-- views/layout.njk -->
<html lang="en" data-theme="light">
```

#### Dynamic Theme Switching
```html
<select class="select select-bordered" onchange="document.documentElement.setAttribute('data-theme', this.value)">
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="cupcake">Cupcake</option>
  <option value="cyberpunk">Cyberpunk</option>
</select>
```

#### Per-Section Theme
```html
<div data-theme="dark">
  <!-- This section uses dark theme -->
</div>
```

---

## Core Components

### 1. Buttons

```html
<!-- Basic Buttons -->
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

<!-- Button Sizes -->
<button class="btn btn-lg">Large</button>
<button class="btn btn-md">Medium (default)</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-xs">Extra Small</button>

<!-- Button States -->
<button class="btn btn-primary btn-active">Active</button>
<button class="btn btn-primary" disabled>Disabled</button>
<button class="btn btn-primary btn-loading">Loading</button>

<!-- Button Shapes -->
<button class="btn btn-circle">●</button>
<button class="btn btn-square">□</button>
<button class="btn btn-rounded">Rounded</button>

<!-- With Icons -->
<button class="btn btn-primary">
  <svg>...</svg>
  Button with Icon
</button>
```

### 2. Cards

```html
<!-- Basic Card -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Card description goes here</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>

<!-- Card with Image -->
<div class="card bg-base-100 shadow-xl">
  <figure>
    <img src="/images/photo.jpg" alt="Photo" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card with Image</h2>
    <p>Description</p>
  </div>
</div>

<!-- Compact Card -->
<div class="card card-compact bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Compact Card</h2>
    <p>Less padding</p>
  </div>
</div>

<!-- Card Side (Horizontal) -->
<div class="card card-side bg-base-100 shadow-xl">
  <figure>
    <img src="/images/photo.jpg" alt="Photo" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Horizontal Card</h2>
    <p>Side-by-side layout</p>
  </div>
</div>
```

### 3. Alerts

```html
<!-- Alert Types -->
<div class="alert alert-info">
  <svg>...</svg>
  <span>Info message</span>
</div>

<div class="alert alert-success">
  <svg>...</svg>
  <span>Success message</span>
</div>

<div class="alert alert-warning">
  <svg>...</svg>
  <span>Warning message</span>
</div>

<div class="alert alert-error">
  <svg>...</svg>
  <span>Error message</span>
</div>

<!-- Alert with Actions -->
<div class="alert alert-warning">
  <span>Warning: Check your input</span>
  <div>
    <button class="btn btn-sm">Deny</button>
    <button class="btn btn-sm btn-primary">Accept</button>
  </div>
</div>
```

### 4. Badges

```html
<!-- Badge Colors -->
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-accent">Accent</span>
<span class="badge badge-ghost">Ghost</span>

<!-- Badge Sizes -->
<span class="badge badge-lg">Large</span>
<span class="badge badge-md">Medium</span>
<span class="badge badge-sm">Small</span>
<span class="badge badge-xs">Tiny</span>

<!-- Badge Variants -->
<span class="badge badge-outline">Outline</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
<span class="badge badge-info">Info</span>
```

### 5. Forms

```html
<!-- Input -->
<input type="text" placeholder="Type here" class="input input-bordered w-full" />
<input type="text" placeholder="Primary" class="input input-bordered input-primary" />
<input type="text" placeholder="Small" class="input input-bordered input-sm" />

<!-- Textarea -->
<textarea class="textarea textarea-bordered w-full" placeholder="Bio"></textarea>

<!-- Select -->
<select class="select select-bordered w-full">
  <option disabled selected>Pick one</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox checkbox-primary" checked />

<!-- Radio -->
<input type="radio" name="radio-1" class="radio" checked />
<input type="radio" name="radio-1" class="radio" />

<!-- Toggle -->
<input type="checkbox" class="toggle" />
<input type="checkbox" class="toggle toggle-primary" checked />

<!-- Form Control (with Label) -->
<div class="form-control w-full">
  <label class="label">
    <span class="label-text">What is your name?</span>
  </label>
  <input type="text" placeholder="Type here" class="input input-bordered w-full" />
  <label class="label">
    <span class="label-text-alt">Alt label</span>
  </label>
</div>
```

### 6. Navigation

```html
<!-- Navbar -->
<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a>Link</a></li>
      <li><a>Link</a></li>
    </ul>
  </div>
</div>

<!-- Breadcrumbs -->
<div class="breadcrumbs text-sm">
  <ul>
    <li><a>Home</a></li>
    <li><a>Documents</a></li>
    <li>Add Document</li>
  </ul>
</div>

<!-- Tabs -->
<div class="tabs">
  <a class="tab">Tab 1</a>
  <a class="tab tab-active">Tab 2</a>
  <a class="tab">Tab 3</a>
</div>

<!-- Menu -->
<ul class="menu bg-base-200 rounded-box w-56">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li><a>Item 3</a></li>
</ul>
```

### 7. Loading & Progress

```html
<!-- Loading Spinner -->
<span class="loading loading-spinner loading-xs"></span>
<span class="loading loading-spinner loading-sm"></span>
<span class="loading loading-spinner loading-md"></span>
<span class="loading loading-spinner loading-lg"></span>

<!-- Loading Dots -->
<span class="loading loading-dots loading-lg"></span>

<!-- Progress Bar -->
<progress class="progress w-56"></progress>
<progress class="progress progress-primary w-56" value="70" max="100"></progress>

<!-- Radial Progress -->
<div class="radial-progress" style="--value:70;">70%</div>
<div class="radial-progress text-primary" style="--value:70;">70%</div>
```

### 8. Modal

```html
<!-- Modal Trigger -->
<button class="btn" onclick="my_modal.showModal()">Open Modal</button>

<!-- Modal -->
<dialog id="my_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
```

### 9. Tooltip

```html
<div class="tooltip" data-tip="Hello">
  <button class="btn">Hover me</button>
</div>

<div class="tooltip tooltip-primary" data-tip="Primary tooltip">
  <button class="btn">Primary</button>
</div>

<div class="tooltip tooltip-open" data-tip="Always visible">
  <button class="btn">Always shown</button>
</div>
```

### 10. Collapse (Accordion)

```html
<div class="collapse collapse-arrow bg-base-200">
  <input type="radio" name="my-accordion" checked="checked" />
  <div class="collapse-title text-xl font-medium">
    Click to open
  </div>
  <div class="collapse-content">
    <p>Content goes here</p>
  </div>
</div>
```

---

## Using DaisyUI with Nunjucks

### Example: Job Card Component

```html
{% macro jobCard(job) %}
<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
  <div class="card-body">
    <div class="flex justify-between items-start">
      <h2 class="card-title">{{ job.name }}</h2>
      {% if job.status === "open" %}
        <span class="badge badge-success">Open</span>
      {% else %}
        <span class="badge badge-error">Closed</span>
      {% endif %}
    </div>
    
    <div class="space-y-2 text-sm">
      <p class="flex items-center gap-2">
        <i data-lucide="map-pin"></i>
        {{ job.location }}
      </p>
      <p class="flex items-center gap-2">
        <i data-lucide="briefcase"></i>
        {{ job.capability }}
      </p>
      <p class="flex items-center gap-2">
        <i data-lucide="calendar"></i>
        Closes: {{ job.closingDate }}
      </p>
    </div>
    
    <p class="text-gray-600 line-clamp-3">{{ job.summary }}</p>
    
    <div class="card-actions justify-end mt-4">
      <a href="/jobs/{{ job.id }}" class="btn btn-primary">
        View Details
      </a>
    </div>
  </div>
</div>
{% endmacro %}

<!-- Usage -->
{% for job in jobs %}
  {{ jobCard(job) }}
{% endfor %}
```

### Example: Form with Validation

```html
<form method="POST" action="/jobs/create" class="space-y-4">
  <!-- Job Name -->
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Job Title</span>
      <span class="label-text-alt text-error">Required</span>
    </label>
    <input 
      type="text" 
      name="name" 
      placeholder="e.g., Senior Frontend Developer" 
      class="input input-bordered w-full" 
      required 
    />
  </div>

  <!-- Location -->
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Location</span>
    </label>
    <input 
      type="text" 
      name="location" 
      placeholder="e.g., Belfast, UK" 
      class="input input-bordered w-full" 
      required 
    />
  </div>

  <!-- Capability (Dropdown) -->
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Capability</span>
    </label>
    <select name="capability" class="select select-bordered w-full" required>
      <option value="">Select a capability</option>
      {% for capability in capabilities %}
        <option value="{{ capability }}">{{ capability }}</option>
      {% endfor %}
    </select>
  </div>

  <!-- Submit Button -->
  <div class="form-control mt-6">
    <button type="submit" class="btn btn-primary">
      Create Job Role
    </button>
  </div>
</form>
```

### Example: Alert Messages

```html
{% if errorMessage %}
<div class="alert alert-error shadow-lg mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{{ errorMessage }}</span>
</div>
{% endif %}

{% if successMessage %}
<div class="alert alert-success shadow-lg mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{{ successMessage }}</span>
</div>
{% endif %}
```

---

## Color System

### Theme Colors
DaisyUI uses semantic color names:

```css
primary      /* Main brand color */
secondary    /* Secondary brand color */
accent       /* Accent color */
neutral      /* Neutral color for text and borders */
base-100     /* Base background color */
base-200     /* Slightly darker background */
base-300     /* Even darker background */
info         /* Information messages */
success      /* Success messages */
warning      /* Warning messages */
error        /* Error messages */
```

### Using Colors

```html
<!-- Text Colors -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-accent">Accent text</p>

<!-- Background Colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-base-100">Base background</div>
<div class="bg-base-200">Darker background</div>

<!-- Border Colors -->
<div class="border border-primary">Primary border</div>
```

---

## Customization

### Custom Theme

Create a custom theme in `tailwind.config.js`:

```javascript
daisyui: {
  themes: [
    {
      mytheme: {
        "primary": "#0ea5e9",
        "secondary": "#f000b8",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
        "info": "#3abff8",
        "success": "#36d399",
        "warning": "#fbbd23",
        "error": "#f87272",
      },
    },
  ],
}
```

### Extending DaisyUI

You can still use all TailwindCSS utilities:

```html
<button class="btn btn-primary hover:scale-105 transition-transform">
  Button with custom hover effect
</button>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
  Card with smooth shadow transition
</div>
```

---

## Responsive Design

DaisyUI works with TailwindCSS responsive prefixes:

```html
<!-- Responsive Button Sizes -->
<button class="btn btn-sm md:btn-md lg:btn-lg">
  Responsive Button
</button>

<!-- Responsive Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="card bg-base-100 shadow-xl">Card 1</div>
  <div class="card bg-base-100 shadow-xl">Card 2</div>
  <div class="card bg-base-100 shadow-xl">Card 3</div>
</div>

<!-- Responsive Navbar -->
<div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <svg>...</svg>
      </label>
      <ul class="menu menu-sm dropdown-content">
        <li><a>Item 1</a></li>
      </ul>
    </div>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal">
      <li><a>Item 1</a></li>
    </ul>
  </div>
</div>
```

---

## Best Practices

### 1. Use Semantic Components
```html
<!-- ✅ GOOD -->
<button class="btn btn-primary">Submit</button>

<!-- ❌ BAD (too many utilities) -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Submit
</button>
```

### 2. Combine with TailwindCSS
```html
<!-- ✅ GOOD - Best of both worlds -->
<div class="card bg-base-100 shadow-xl hover:scale-105 transition-transform">
  <div class="card-body">
    <h2 class="card-title">Title</h2>
  </div>
</div>
```

### 3. Use Consistent Theme
```html
<!-- Set theme at root level -->
<html data-theme="light">
  <!-- All components inherit theme -->
</html>
```

### 4. Accessibility First
```html
<!-- DaisyUI components are accessible by default -->
<button class="btn btn-primary" aria-label="Submit form">
  Submit
</button>
```

---

## Resources

- **Official Docs**: https://daisyui.com/
- **Components**: https://daisyui.com/components/
- **Themes**: https://daisyui.com/docs/themes/
- **GitHub**: https://github.com/saadeghi/daisyui
- **TailwindCSS Docs**: https://tailwindcss.com/docs

---

## Quick Reference

| Component | Class | Example |
|-----------|-------|---------|
| Button | `.btn` | `<button class="btn btn-primary">Click</button>` |
| Card | `.card` | `<div class="card bg-base-100 shadow-xl">` |
| Alert | `.alert` | `<div class="alert alert-success">` |
| Badge | `.badge` | `<span class="badge badge-primary">` |
| Input | `.input` | `<input class="input input-bordered">` |
| Modal | `.modal` | `<dialog class="modal">` |
| Loading | `.loading` | `<span class="loading loading-spinner">` |
| Navbar | `.navbar` | `<div class="navbar bg-base-100">` |

---

**Last Updated**: October 9, 2025
**DaisyUI Version**: 5.1.26+ (always use latest stable)
**TailwindCSS Version**: 4.1.14+ (always use latest stable)

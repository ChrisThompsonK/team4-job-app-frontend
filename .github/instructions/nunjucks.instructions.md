# Nunjucks Templating Instructions

> **Version Requirements**: Always use the latest stable version of Nunjucks (currently v3.2.4+)

## Overview

Nunjucks is a powerful templating engine for JavaScript, similar to Jinja2 (Python) and Twig (PHP). This project uses Nunjucks for server-side rendering of HTML pages.

---

## Configuration

### Setup in Express (src/index.ts)

```typescript
import nunjucks from "nunjucks";
import path from "node:path";

const env = nunjucks.configure(path.join(process.cwd(), "views"), {
  autoescape: true,        // Auto-escape HTML to prevent XSS
  express: app,            // Integrate with Express
  watch: true,             // Auto-reload templates in development
});

app.set("view engine", "njk");
app.engine("njk", env.render.bind(env));
```

### Important Configuration Options
- **autoescape: true** - ALWAYS keep this enabled for security (prevents XSS attacks)
- **watch: true** - Enables hot reloading during development
- **express: app** - Links Nunjucks with Express for `res.render()`

---

## Template Structure

### Base Layout Pattern

**File**: `views/layout.njk`
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Default Title{% endblock %}</title>
    <link href="/styles.css" rel="stylesheet">
    {% block head %}{% endblock %}
</head>
<body>
    {% include "partials/header.njk" %}
    
    {% block content %}{% endblock %}
    
    {% include "partials/footer.njk" %}
    
    {% block scripts %}{% endblock %}
</body>
</html>
```

### Child Template Pattern

**File**: `views/jobs.njk`
```html
{% extends "layout.njk" %}

{% block title %}{{ title }} - Kainos Jobs{% endblock %}

{% block content %}
<main class="container mx-auto px-4 py-8">
    <h1>{{ title }}</h1>
    <!-- Page-specific content here -->
</main>
{% endblock %}

{% block scripts %}
<script>
    // Page-specific JavaScript
</script>
{% endblock %}
```

---

## Core Syntax

### 1. Variables

```html
<!-- Simple variable -->
<h1>{{ title }}</h1>

<!-- Object property -->
<p>{{ job.name }}</p>

<!-- Array access -->
<p>{{ jobs[0].location }}</p>

<!-- With default value -->
<p>{{ description | default("No description available") }}</p>
```

### 2. Conditionals

```html
{% if errorMessage %}
    <div class="alert alert-error">{{ errorMessage }}</div>
{% endif %}

{% if jobs.length > 0 %}
    <p>Found {{ jobs.length }} jobs</p>
{% else %}
    <p>No jobs available</p>
{% endif %}

{% if status === "open" %}
    <span class="badge badge-success">Open</span>
{% elif status === "closed" %}
    <span class="badge badge-error">Closed</span>
{% else %}
    <span class="badge badge-warning">Unknown</span>
{% endif %}
```

### 3. Loops

```html
<!-- Basic loop -->
{% for job in jobs %}
    <div class="card">
        <h2>{{ job.name }}</h2>
        <p>{{ job.location }}</p>
    </div>
{% endfor %}

<!-- Loop with else (when array is empty) -->
{% for job in jobs %}
    <div>{{ job.name }}</div>
{% else %}
    <p>No jobs found</p>
{% endfor %}

<!-- Loop with index -->
{% for job in jobs %}
    <div class="job-{{ loop.index }}">
        {{ loop.index }}. {{ job.name }}
    </div>
{% endfor %}
```

### Loop Variables
- `loop.index` - Current iteration (1-indexed)
- `loop.index0` - Current iteration (0-indexed)
- `loop.first` - True if first iteration
- `loop.last` - True if last iteration
- `loop.length` - Total number of items

### 4. Filters

```html
<!-- String filters -->
{{ name | upper }}                    <!-- UPPERCASE -->
{{ name | lower }}                    <!-- lowercase -->
{{ name | capitalize }}               <!-- Capitalize first letter -->
{{ name | title }}                    <!-- Title Case -->

<!-- Number filters -->
{{ price | int }}                     <!-- Convert to integer -->
{{ price | float }}                   <!-- Convert to float -->

<!-- Array filters -->
{{ jobs | length }}                   <!-- Get array length -->
{{ jobs | first }}                    <!-- First item -->
{{ jobs | last }}                     <!-- Last item -->

<!-- Default values -->
{{ description | default("N/A") }}

<!-- Safe HTML (use with caution!) -->
{{ htmlContent | safe }}

<!-- Date formatting (requires custom filter) -->
{{ date | date("DD/MM/YYYY") }}

<!-- Chaining filters -->
{{ name | upper | default("NO NAME") }}
```

### 5. Template Inheritance

```html
<!-- Parent: layout.njk -->
{% block content %}
    Default content
{% endblock %}

<!-- Child: page.njk -->
{% extends "layout.njk" %}

{% block content %}
    {{ super() }}  <!-- Include parent block content -->
    New content
{% endblock %}
```

### 6. Includes (Partials)

```html
<!-- Simple include -->
{% include "partials/header.njk" %}

<!-- Include with variables -->
{% include "partials/card.njk" with { title: "Hello", color: "blue" } %}

<!-- Conditional include -->
{% if showFooter %}
    {% include "partials/footer.njk" %}
{% endif %}
```

### 7. Macros (Reusable Components)

```html
<!-- Define macro -->
{% macro jobCard(job) %}
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">{{ job.name }}</h2>
        <p>{{ job.location }}</p>
        <div class="card-actions">
            <a href="/jobs/{{ job.id }}" class="btn btn-primary">View Details</a>
        </div>
    </div>
</div>
{% endmacro %}

<!-- Use macro -->
{% for job in jobs %}
    {{ jobCard(job) }}
{% endfor %}

<!-- Import macro from another file -->
{% from "partials/macros.njk" import jobCard %}
{{ jobCard(job) }}
```

### 8. Comments

```html
{# This is a comment and won't be rendered #}

{# 
Multi-line comment
Can span multiple lines
#}
```

---

## Best Practices

### 1. Always Escape User Input
```html
<!-- ✅ GOOD - Auto-escaped by default -->
<p>{{ userInput }}</p>

<!-- ❌ BAD - Only use safe filter with trusted content -->
<p>{{ userInput | safe }}</p>
```

### 2. Use Meaningful Block Names
```html
<!-- ✅ GOOD -->
{% block heroSection %}{% endblock %}
{% block productList %}{% endblock %}

<!-- ❌ BAD -->
{% block section1 %}{% endblock %}
{% block stuff %}{% endblock %}
```

### 3. Keep Logic Minimal
```html
<!-- ✅ GOOD - Simple conditional -->
{% if job.status === "open" %}
    <span class="badge badge-success">Open</span>
{% endif %}

<!-- ❌ BAD - Complex logic belongs in controller -->
{% if job.status === "open" and job.closingDate > currentDate and job.positions > 0 %}
    <!-- Don't do complex business logic in templates -->
{% endif %}
```

### 4. Use Partials for Reusable Components
```html
<!-- ✅ GOOD - Reusable header -->
{% include "partials/header.njk" %}

<!-- ❌ BAD - Duplicating header code in every template -->
<header>...</header>
```

### 5. Organize Templates Logically
```
views/
├── layout.njk              # Base layout
├── index.njk               # Homepage
├── jobs.njk                # Job listing
├── job-detail.njk          # Job details
├── create-job.njk          # Create job form
└── partials/               # Reusable components
    ├── header.njk
    ├── footer.njk
    ├── job-card.njk
    └── alert.njk
```

---

## Common Patterns in This Project

### 1. Rendering a Page from Controller

```typescript
// In controller
app.get("/jobs", async (req, res) => {
  const jobs = await jobService.getAllJobs();
  
  res.render("jobs", {
    title: "Available Job Roles",
    jobs: jobs,
    errorMessage: req.query.error || "",
  });
});
```

### 2. Displaying Error/Success Messages

```html
{% if errorMessage %}
<div class="alert alert-error mb-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <span>{{ errorMessage }}</span>
</div>
{% endif %}

{% if successMessage %}
<div class="alert alert-success mb-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span>{{ successMessage }}</span>
</div>
{% endif %}
```

### 3. Form Rendering with Dynamic Options

```html
<select name="capability" class="select select-bordered w-full" required>
    <option value="">Select a capability</option>
    {% for capability in capabilities %}
        <option value="{{ capability }}">{{ capability }}</option>
    {% endfor %}
</select>
```

### 4. Formatting Dates

```html
<!-- Date is pre-formatted in controller -->
<p class="text-sm text-gray-600">
    Closing Date: {{ job.closingDate }}
</p>
```

### 5. Dynamic Links

```html
<a href="/jobs/{{ job.id }}" class="btn btn-primary">
    View Details
</a>
```

---

## DaisyUI Integration

When using DaisyUI components in Nunjucks templates:

```html
<!-- Cards -->
<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">{{ title }}</h2>
        <p>{{ description }}</p>
    </div>
</div>

<!-- Buttons -->
<button class="btn btn-primary">{{ buttonText }}</button>

<!-- Alerts -->
<div class="alert alert-{{ alertType }}">
    <span>{{ message }}</span>
</div>

<!-- Badges -->
<span class="badge badge-{{ badgeColor }}">{{ status }}</span>
```

---

## Debugging Templates

### 1. Dump Variables
```html
<!-- View all available variables -->
{{ dump() }}

<!-- View specific variable -->
{{ dump(job) }}
```

### 2. Check Variable Type
```html
{% if job is defined %}
    Job is defined
{% endif %}

{% if jobs is iterable %}
    Jobs is an array
{% endif %}
```

### 3. Console Logging (Development)
```html
{% block scripts %}
<script>
    console.log('Template data:', {{ job | dump | safe }});
</script>
{% endblock %}
```

---

## Custom Filters (Advanced)

If you need custom filters, add them in `src/index.ts`:

```typescript
env.addFilter("formatDate", (date: Date, format: string) => {
  // Custom date formatting logic
  return date.toLocaleDateString("en-GB");
});

env.addFilter("truncate", (str: string, length: number) => {
  return str.length > length ? str.substring(0, length) + "..." : str;
});
```

Usage in templates:
```html
<p>{{ job.closingDate | formatDate("DD/MM/YYYY") }}</p>
<p>{{ job.summary | truncate(100) }}</p>
```

---

## Security Considerations

### 1. Always Auto-Escape
- **NEVER** disable `autoescape: true` in configuration
- Only use `| safe` filter for trusted, sanitized HTML

### 2. Validate User Input
- Do validation in controllers, not templates
- Never trust data from `req.query`, `req.body`, or `req.params`

### 3. CSRF Protection
```html
<form method="POST" action="/jobs/create">
    <input type="hidden" name="_csrf" value="{{ csrfToken }}">
    <!-- form fields -->
</form>
```

---

## Performance Tips

### 1. Use Includes Wisely
- Includes are parsed on every render
- For frequently used components, consider macros

### 2. Cache Templates in Production
```typescript
nunjucks.configure("views", {
  autoescape: true,
  express: app,
  watch: false,        // Disable in production
  noCache: false,      // Enable caching in production
});
```

### 3. Minimize Logic in Templates
- Do data processing in controllers
- Pass formatted data to templates

---

## Common Errors and Solutions

### Error: "Template not found"
```
Solution: Check file path and extension (.njk)
Ensure template is in views/ directory
```

### Error: "Cannot read property of undefined"
```
Solution: Check if variable exists before using
{% if job and job.name %}{{ job.name }}{% endif %}
```

### Error: "filter not found"
```
Solution: Custom filters must be registered with env.addFilter()
Built-in filters: check Nunjucks documentation
```

---

## Resources

- **Official Docs**: https://mozilla.github.io/nunjucks/
- **Template Designer Docs**: https://mozilla.github.io/nunjucks/templating.html
- **API Reference**: https://mozilla.github.io/nunjucks/api.html

---

## Quick Reference

| Syntax | Purpose | Example |
|--------|---------|---------|
| `{{ var }}` | Output variable | `{{ job.name }}` |
| `{% if %}` | Conditional | `{% if status === "open" %}` |
| `{% for %}` | Loop | `{% for job in jobs %}` |
| `{% extends %}` | Template inheritance | `{% extends "layout.njk" %}` |
| `{% block %}` | Define block | `{% block content %}` |
| `{% include %}` | Include partial | `{% include "header.njk" %}` |
| `{% macro %}` | Define reusable component | `{% macro card(title) %}` |
| `{# #}` | Comment | `{# This is a comment #}` |
| `\| filter` | Apply filter | `{{ name \| upper }}` |

---

**Last Updated**: October 9, 2025
**Nunjucks Version**: 3.2.4+ (always use latest stable)

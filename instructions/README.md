# Instructions Directory - Overview

This directory contains comprehensive instructions for LLMs (Large Language Models) to understand and work effectively with this project.

## 📋 Available Instructions

### 1. [Project Info](./project-info.md)
**Purpose**: Complete project overview and architecture guide

**Contains**:
- Project structure (frontend + backend)
- Technology stack
- Architecture patterns
- Key features and routes
- Common development patterns
- Integration details
- Troubleshooting guide

**Read this FIRST** before working on any task.

---

### 2. [Nunjucks Instructions](./nunjucks-instructions.md)
**Purpose**: Templating engine usage and best practices

**Contains**:
- Nunjucks configuration
- Template syntax (variables, loops, conditionals)
- Template inheritance and partials
- Filters and macros
- DaisyUI integration examples
- Security considerations
- Common patterns for this project

**Read when**: Working with views, templates, or HTML rendering.

---

### 3. [Linting Instructions](./linting-instructions.md)
**Purpose**: Code quality and formatting with Biome

**Contains**:
- Biome configuration
- Available commands
- Common rules and auto-fixes
- VS Code integration
- Troubleshooting
- CI/CD integration
- Best practices

**Read when**: Setting up development environment or fixing code quality issues.

---

### 4. [Dependencies Instructions](./dependencies-instructions.md)
**Purpose**: Package management and dependency updates

**Contains**:
- npm usage guide
- Installing and updating packages
- Semver version ranges
- Security auditing
- Key dependencies overview
- Troubleshooting package issues
- Best practices

**Read when**: Adding new packages, updating dependencies, or resolving package conflicts.

---

### 5. [DaisyUI Instructions](./daisyui-instructions.md)
**Purpose**: UI component library usage

**Contains**:
- DaisyUI configuration
- All component examples
- Theme management
- Integration with Nunjucks
- Customization guide
- Responsive design patterns
- Best practices

**Read when**: Building UI components, styling pages, or implementing designs.

---

### 6. [MCP Instructions](./mcp-instructions.md)
**Purpose**: Model Context Protocol setup and usage

**Contains**:
- MCP overview and benefits
- Configuration for Claude Desktop
- Available MCP servers
- Development workflows
- Best practices
- Troubleshooting
- Custom server creation

**Read when**: Setting up Claude Desktop integration or using MCP tools.

---

## 🚀 Quick Start for LLMs

### First Time Working on This Project

1. **Read `project-info.md`** - Understand the complete project structure
2. **Read relevant instruction file** based on the task:
   - UI work? → `daisyui-instructions.md` + `nunjucks-instructions.md`
   - Adding packages? → `dependencies-instructions.md`
   - Code quality issues? → `linting-instructions.md`
   - Setting up tools? → `mcp-instructions.md`

### Before Every Task

1. ✅ Review `project-info.md` for context
2. ✅ Check relevant instruction files
3. ✅ Understand current project state
4. ✅ Follow established patterns
5. ✅ Use latest versions of all software

---

## 📌 Key Principles

### Always Use Latest Versions
- **Node.js**: v18+ (latest LTS: v20+)
- **npm**: v9+ (latest: v10+)
- **TypeScript**: v5.9+
- **Biome**: v2.2.4+
- **TailwindCSS**: v4.1.14+
- **DaisyUI**: v5.1.26+
- **Nunjucks**: v3.2.4+
- **Express**: v5.1.0+

Check for updates regularly: `npm outdated`

### Code Quality Standards
- ✅ Run `npm run check` before committing
- ✅ Use `npm run lint:fix` to auto-fix issues
- ✅ Follow TypeScript best practices (no `any`)
- ✅ Write meaningful commit messages
- ✅ Test changes thoroughly

### Development Workflow
1. Make changes in appropriate files
2. Run linter: `npm run check`
3. Fix issues: `npm run lint:fix`
4. Run tests: `npm test`
5. Build: `npm run build`
6. Commit changes

---

## 🎯 Common Tasks Reference

### Adding a New Feature

**Frontend**:
1. Read `project-info.md` - Architecture section
2. Define types in `src/models/`
3. Add service method in `src/services/`
4. Create controller in `src/controllers/`
5. Add route in `src/index.ts`
6. Create view in `views/` (see `nunjucks-instructions.md`)
7. Style with DaisyUI (see `daisyui-instructions.md`)
8. Run linter (see `linting-instructions.md`)

**Backend**:
1. Read `project-info.md` - Backend section
2. Update schema if needed
3. Create validator
4. Create repository
5. Create service
6. Create controller
7. Add route
8. Write tests

### Updating Dependencies

1. Read `dependencies-instructions.md`
2. Check outdated: `npm outdated`
3. Update: `npm install <package>@latest`
4. Test thoroughly
5. Update lock file: `npm install`

### Fixing Linting Errors

1. Read `linting-instructions.md`
2. Run: `npm run check`
3. Auto-fix: `npm run lint:fix`
4. Manually fix remaining issues
5. Verify: `npm run check`

### Creating UI Components

1. Read `daisyui-instructions.md`
2. Use DaisyUI components
3. Integrate with Nunjucks (see `nunjucks-instructions.md`)
4. Test responsiveness
5. Ensure accessibility

### Setting Up MCP

1. Read `mcp-instructions.md`
2. Install Claude Desktop (latest)
3. Configure `claude_desktop_config.json`
4. Install MCP servers
5. Restart Claude Desktop
6. Test file access

---

## 📂 File Organization

```
instructions/
├── README.md                      # This file
├── project-info.md                # ⭐ START HERE - Complete project overview
├── nunjucks-instructions.md       # Templating guide
├── linting-instructions.md        # Code quality guide
├── dependencies-instructions.md   # Package management guide
├── daisyui-instructions.md        # UI components guide
└── mcp-instructions.md            # MCP setup and usage
```

---

## 🔄 Keeping Instructions Updated

### When to Update

- ✏️ New feature added → Update `project-info.md`
- 📦 New dependency → Update `dependencies-instructions.md`
- 🎨 New UI pattern → Update `daisyui-instructions.md` or `nunjucks-instructions.md`
- 🔧 New tool/config → Update relevant instruction file
- 🐛 New troubleshooting tip → Add to relevant instruction file

### Version Information

All instruction files include:
- Last updated date
- Recommended versions
- Links to official documentation

**Current Status**: October 9, 2025

---

## 💡 Tips for LLMs

### Understanding Context

1. **Always read `project-info.md` first**
2. **Check current file before editing** - understand existing patterns
3. **Follow established conventions** - don't introduce new patterns unnecessarily
4. **Ask for clarification** if unsure about project structure
5. **Reference multiple instruction files** when task spans multiple areas

### Making Changes

1. **Maintain consistency** with existing code
2. **Use TypeScript strictly** (no `any` types)
3. **Follow Biome rules** (double quotes, semicolons, etc.)
4. **Test changes** before suggesting
5. **Update tests** when changing functionality

### Common Scenarios

**Scenario 1: Add new route**
- Read: `project-info.md` (Routes section)
- Read: `nunjucks-instructions.md` (if view needed)
- Follow: Service → Controller → Route pattern

**Scenario 2: Style page**
- Read: `daisyui-instructions.md` (components)
- Read: `nunjucks-instructions.md` (integration)
- Use: Semantic DaisyUI classes

**Scenario 3: Fix linting error**
- Read: `linting-instructions.md` (rules section)
- Run: `npm run lint:fix`
- Manually fix: remaining issues

**Scenario 4: Update package**
- Read: `dependencies-instructions.md`
- Check: Breaking changes in changelog
- Update: `npm install <package>@latest`
- Test: Ensure nothing breaks

---

## 🔗 External Resources

### Official Documentation
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Express.js](https://expressjs.com/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [DaisyUI](https://daisyui.com/)
- [Biome](https://biomejs.dev/)
- [Vitest](https://vitest.dev/)
- [MCP](https://modelcontextprotocol.io/)

### Project-Specific
- Frontend README: `../README.md`
- Backend README: `../../team4-job-app-backend/README.md`
- Package.json: `../package.json`
- Biome Config: `../biome.json`
- TypeScript Config: `../tsconfig.json`

---

## ❓ Troubleshooting

### Can't Find Information?

1. Check `project-info.md` overview
2. Search specific instruction file
3. Check project README files
4. Review package documentation
5. Ask for clarification

### Instructions Conflict?

1. `project-info.md` takes precedence (project-specific)
2. Specific instruction files for detailed guidance
3. Official docs for latest features
4. When in doubt, follow existing patterns

### Need More Detail?

Each instruction file has:
- Quick reference tables
- Common patterns
- Example code
- Troubleshooting sections
- Links to official docs

---

**Last Updated**: October 9, 2025

**Remember**: Always use the latest stable versions of all software and tools!

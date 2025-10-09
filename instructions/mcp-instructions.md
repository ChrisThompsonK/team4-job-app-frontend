# Context 7 MCP (Model Context Protocol) Instructions

> **Version Requirements**: Always use the latest stable version of MCP tools and Claude Desktop

## Overview

**Model Context Protocol (MCP)** is a protocol developed by Anthropic that allows AI assistants like Claude to interact with external tools, data sources, and services in a standardized way. Context 7 refers to using MCP with Claude Desktop to enhance development workflows.

---

## What is MCP?

### Key Concepts

**Model Context Protocol** enables:
- 🔌 **Tool Integration** - Connect Claude to external APIs and services
- 📂 **File System Access** - Read and write project files
- 🗄️ **Database Connections** - Query databases directly
- 🌐 **Web Scraping** - Fetch and process web content
- 🔧 **Custom Tools** - Build project-specific capabilities

### Why Use MCP?

- ✅ **Consistent Context** - Claude maintains understanding across sessions
- ✅ **Direct Integration** - No copy-paste between tools and chat
- ✅ **Real-time Updates** - Access latest file contents automatically
- ✅ **Custom Workflows** - Build tools specific to your project
- ✅ **Enhanced Productivity** - Reduce context switching

---

## Setting Up MCP with Claude Desktop

### Prerequisites

1. **Claude Desktop** (latest version)
   - Download from: https://claude.ai/download
   - Supports MCP natively

2. **Node.js** (v18+ recommended, latest LTS preferred)
   ```bash
   node --version  # Should be v18+
   ```

3. **MCP Server** (for this project)
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem@latest
   ```

---

## Configuration

### Claude Desktop Configuration

**File**: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/wesley.sloan/Documents/GitHub/Job-App"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "/Users/wesley.sloan/Documents/GitHub/Job-App"
      ]
    }
  }
}
```

### Configuration Breakdown

#### Filesystem Server
```json
{
  "filesystem": {
    "command": "npx",                    // Use npx to run package
    "args": [
      "-y",                              // Auto-confirm install
      "@modelcontextprotocol/server-filesystem",
      "/path/to/project"                 // Project root directory
    ]
  }
}
```

**Capabilities**:
- Read files
- Write files
- List directories
- Search files
- Watch for changes

#### Git Server
```json
{
  "git": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-git",
      "--repository",
      "/path/to/project"
    ]
  }
}
```

**Capabilities**:
- View git status
- Show diffs
- Commit changes
- View history
- Manage branches

---

## Available MCP Servers

### 1. Filesystem Server
```bash
npm install -g @modelcontextprotocol/server-filesystem@latest
```

**Usage in Claude**:
```
Can you read the contents of src/index.ts?
Can you update the package.json to add a new script?
List all TypeScript files in the src directory
```

### 2. Git Server
```bash
npm install -g @modelcontextprotocol/server-git@latest
```

**Usage in Claude**:
```
Show me the current git status
What files have been modified?
Create a new branch called feature/new-feature
Show me the diff for src/index.ts
```

### 3. GitHub Server
```bash
npm install -g @modelcontextprotocol/server-github@latest
```

**Usage in Claude**:
```
List open pull requests
Show issues assigned to me
Create a new issue for this bug
Comment on PR #123
```

### 4. PostgreSQL Server (if using PostgreSQL)
```bash
npm install -g @modelcontextprotocol/server-postgres@latest
```

**Usage in Claude**:
```
Show me the schema for the users table
Run this query: SELECT * FROM jobs WHERE status = 'open'
How many job applications are in the database?
```

### 5. Brave Search Server (Web Search)
```bash
npm install -g @modelcontextprotocol/server-brave-search@latest
```

**Usage in Claude**:
```
Search for "TypeScript best practices 2025"
Find documentation for Express.js v5
Look up "DaisyUI modal examples"
```

---

## Project-Specific MCP Configuration

### For This Job Application Project

**File**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "job-app-frontend": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/wesley.sloan/Documents/GitHub/Job-App/team4-job-app-frontend"
      ]
    },
    "job-app-backend": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/wesley.sloan/Documents/GitHub/Job-App/team4-job-app-backend"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "/Users/wesley.sloan/Documents/GitHub/Job-App"
      ]
    }
  }
}
```

### Restart Claude Desktop

After updating configuration:
1. Quit Claude Desktop completely
2. Reopen Claude Desktop
3. Verify MCP servers are connected (look for tool icons in chat)

---

## Using MCP in Development Workflow

### Common Workflows

#### 1. Code Review
```
Claude, please review the changes in src/controllers/job-controller.ts
Check for any potential bugs or improvements
```

#### 2. Debugging
```
Read the error logs from the terminal
Look at src/services/jobService.ts and help me debug this error
Show me the git diff to see what changed
```

#### 3. Feature Implementation
```
I need to add a new endpoint for deleting job roles
1. Update the service in src/services/jobService.ts
2. Add the controller method in src/controllers/job-controller.ts
3. Add the route in src/index.ts
```

#### 4. Documentation
```
Generate API documentation for all routes in src/index.ts
Create a README for the src/services directory
Document the JobRole interface in src/models/job-role.ts
```

#### 5. Refactoring
```
Refactor src/index.ts to separate routes into their own files
Move all job-related routes to src/routes/jobs.ts
Update imports and ensure everything still works
```

---

## Best Practices

### 1. Explicit File Paths
```
✅ GOOD: "Read /Users/wesley.sloan/Documents/GitHub/Job-App/team4-job-app-frontend/src/index.ts"
❌ BAD: "Read index.ts"
```

### 2. Batch Operations
```
✅ GOOD: "Update these three files: src/index.ts, src/services/jobService.ts, and package.json"
❌ BAD: Multiple separate requests for each file
```

### 3. Context Preservation
```
# Start of conversation
"I'm working on the Job Application project. The frontend is in team4-job-app-frontend and uses Express + Nunjucks. Please read the project-info.md file first."
```

### 4. Verification
```
After making changes:
"Show me the git diff to verify the changes
Run npm run check to ensure code quality
```

---

## Security Considerations

### 1. File Access Scope
- **Only grant access to project directories**
- Don't allow access to entire home directory
- Use separate MCP servers for different projects

### 2. Sensitive Data
- **Never commit MCP config with API keys**
- Use environment variables for secrets
- Add config file to `.gitignore`

### 3. Git Operations
- **Review changes before committing**
- Claude can suggest commits but you approve
- Always verify diffs

---

## Troubleshooting

### Issue: MCP Server Not Connected

**Symptoms**: No tool icons in Claude, can't read files

**Solutions**:
1. Check config file location:
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Windows
   type %APPDATA%\Claude\claude_desktop_config.json
   
   # Linux
   cat ~/.config/Claude/claude_desktop_config.json
   ```

2. Verify paths are absolute and correct
3. Restart Claude Desktop completely
4. Check Node.js is installed: `node --version`

### Issue: Permission Denied

**Solution**:
```bash
# Grant execute permissions to npx
chmod +x $(which npx)

# Or use full path to node
"command": "/usr/local/bin/node",
"args": ["/usr/local/bin/npx", "-y", "..."]
```

### Issue: Server Crashes

**Solution**:
```bash
# Update MCP servers to latest
npm update -g @modelcontextprotocol/server-filesystem
npm update -g @modelcontextprotocol/server-git

# Clear npm cache
npm cache clean --force
```

### Issue: Files Not Found

**Solution**:
- Use absolute paths in configuration
- Verify project directory exists
- Check file permissions

---

## Advanced Usage

### Custom MCP Server

Create a custom MCP server for project-specific tools:

**File**: `mcp-server/index.js`

```javascript
#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "job-app-tools",
  version: "1.0.0",
});

// Register custom tool
server.tool("run-tests", "Run project tests", async () => {
  const { exec } = await import("child_process");
  return new Promise((resolve) => {
    exec("npm test", (error, stdout, stderr) => {
      resolve({
        content: [{ type: "text", text: stdout || stderr }],
      });
    });
  });
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Configuration**:
```json
{
  "mcpServers": {
    "job-app-tools": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"]
    }
  }
}
```

---

## Integration with Development Tools

### VS Code + Claude Desktop

1. **Open Project in VS Code**
   ```bash
   code /Users/wesley.sloan/Documents/GitHub/Job-App
   ```

2. **Use Claude for**:
   - Code reviews via MCP
   - Automated refactoring
   - Documentation generation
   - Bug analysis

3. **Workflow**:
   - Write code in VS Code
   - Ask Claude to review via MCP
   - Claude reads files directly
   - Implement suggestions in VS Code

### Git Workflow

1. **Before Committing**:
   ```
   Claude, show me all modified files
   Review changes in src/controllers/job-controller.ts
   Suggest a commit message
   ```

2. **Code Review**:
   ```
   Show me the diff for the last commit
   Are there any issues with these changes?
   ```

3. **Branch Management**:
   ```
   Create a new branch: feature/add-delete-endpoint
   What files are different from main branch?
   ```

---

## Context 7 Specific Strategies

### 1. Project Context Loading
```
# First message in new conversation
"I'm working on a Job Application system. Please read:
1. /path/to/instructions/project-info.md
2. /path/to/README.md
3. /path/to/package.json

This will give you full context about the project."
```

### 2. Iterative Development
```
"Let's add a delete job feature:
1. First, show me the current job service structure
2. Add a deleteJob method to the service
3. Add the controller method
4. Add the route
5. Show me the complete diff
6. Run tests to verify"
```

### 3. Documentation Maintenance
```
"Keep documentation in sync:
1. I just added a new feature
2. Update the relevant README section
3. Add JSDoc comments to new functions
4. Update the API documentation"
```

### 4. Code Quality Checks
```
"Before I commit:
1. Run biome check on modified files
2. Run all tests
3. Show me the git diff
4. Suggest a commit message following conventional commits"
```

---

## Resources

- **MCP Specification**: https://modelcontextprotocol.io/
- **Claude Desktop**: https://claude.ai/download
- **MCP Servers**: https://github.com/modelcontextprotocol/servers
- **SDK Documentation**: https://modelcontextprotocol.io/docs/sdk
- **Example Servers**: https://github.com/modelcontextprotocol/servers/tree/main/src

---

## Quick Reference

| MCP Server | Purpose | Install Command |
|------------|---------|-----------------|
| filesystem | File operations | `npm i -g @modelcontextprotocol/server-filesystem@latest` |
| git | Git operations | `npm i -g @modelcontextprotocol/server-git@latest` |
| github | GitHub API | `npm i -g @modelcontextprotocol/server-github@latest` |
| postgres | PostgreSQL | `npm i -g @modelcontextprotocol/server-postgres@latest` |
| brave-search | Web search | `npm i -g @modelcontextprotocol/server-brave-search@latest` |

### Example Commands for Claude

```
# File Operations
"Read src/index.ts"
"Update package.json to add a new script"
"List all files in src/controllers/"

# Git Operations
"Show git status"
"Show diff for src/index.ts"
"Create branch: feature/new-feature"

# Development Workflow
"Review changes in the last commit"
"Run tests and show results"
"Generate API documentation"
```

---

**Last Updated**: October 9, 2025
**MCP Version**: Latest stable (check https://modelcontextprotocol.io/)
**Claude Desktop Version**: Latest (always update to latest version)
**Node.js Version**: v18+ (latest LTS: v20+)

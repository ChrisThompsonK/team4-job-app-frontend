import path from "node:path";
import express from "express";
import nunjucks from "nunjucks";
import type { JobRole } from "./models/job-role.js";
import { InMemoryJobRoleService } from "./services/in-memory-job-role-service.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the job role service
const jobRoleService = new InMemoryJobRoleService();

// Configure Nunjucks
const env = nunjucks.configure(path.join(process.cwd(), "views"), {
  autoescape: true,
  express: app,
  watch: true, // Enable auto-reloading in development
});

// Set Nunjucks as the view engine
app.set("view engine", "njk");
app.engine("njk", env.render.bind(env));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(process.cwd(), "styles")));

// Middleware to parse JSON
app.use(express.json());

// Hello World endpoint - now renders a view
app.get("/", (_req, res) => {
  res.render("index", {
    title: "Welcome to Job App Frontend",
    message: "Hello World! This page is rendered with Nunjucks.",
  });
});

// Jobs listing endpoint
app.get("/jobs", (_req, res) => {
  // Get job roles from our service
  const jobRoles = jobRoleService.getJobRoles();

  // Format the dates for display
  const formattedJobRoles = jobRoles.map((job: JobRole) => ({
    ...job,
    closingDate: job.closingDate.toLocaleDateString("en-GB"),
  }));

  res.render("jobs", {
    title: "Available Job Roles",
    jobs: formattedJobRoles,
  });
});

// Start the server
const main = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

main().catch(console.error);

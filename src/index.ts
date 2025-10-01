import path from "node:path";
import express from "express";
import nunjucks from "nunjucks";

// Type definitions
interface Job {
  title: string;
  company: string;
  location: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

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
  // Sample job data (in a real app, this would come from a database)
  const sampleJobs: Job[] = [
    {
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
    },
    {
      title: "Backend Engineer",
      company: "Data Systems Inc",
      location: "New York, NY",
    },
    {
      title: "Full Stack Developer",
      company: "Startup Hub",
      location: "Austin, TX",
    },
  ];

  res.render("jobs", {
    title: "Available Jobs",
    jobs: sampleJobs,
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

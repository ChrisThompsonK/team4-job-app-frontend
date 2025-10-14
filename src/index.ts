import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import nunjucks from "nunjucks";
import { BANDS, CAPABILITIES, STATUSES } from "./constants/job-form-options.js";
import { ApplicationController } from "./controllers/application-controller.js";
import { JobController } from "./controllers/job-controller.js";
import type { JobRole } from "./models/job-role.js";
import { ApplicationService } from "./services/applicationService.js";
import { JobService } from "./services/jobService.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

// Initialize the job role service and controller
const jobRoleService = new JobService(API_BASE_URL);
const jobController = new JobController(jobRoleService);
const applicationService = new ApplicationService();
const applicationController = new ApplicationController(applicationService, jobRoleService);

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
app.use(express.static(path.join(process.cwd(), "dist")));
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/js", express.static(path.join(process.cwd(), "js")));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hello World endpoint - now renders a view
app.get("/", async (req, res) => {
  try {
    // Get the 3 most recent jobs for the homepage
    const allJobs = await jobRoleService.getAllJobs();
    console.log(allJobs);
    const latestJobs = allJobs
      .sort((a, b) => a.id - b.id) // Sort by id instead since we don't have createdDate
      .slice(0, 3)
      .map((job) => ({
        ...job,
        closingDate: job.closingDate.toLocaleDateString("en-GB"),
      }));

    // Example: Check for demo user session (in a real app, this would be req.session.user or similar)
    const isLoggedIn = req.query.demo === 'loggedin';
    const user = isLoggedIn ? { id: 1, username: 'demo_user', name: 'Demo User' } : null;

    res.render("index", {
      title: "Home - Kainos Job Portal",
      latestJobs,
      user, // Pass user context to template
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Fallback to empty jobs array if API is unavailable
    const isLoggedIn = req.query.demo === 'loggedin';
    const user = isLoggedIn ? { id: 1, username: 'demo_user', name: 'Demo User' } : null;

    res.render("index", {
      title: "Home - Kainos Job Portal",
      latestJobs: [],
      user,
    });
  }
});

// Jobs listing endpoint
app.get("/jobs", async (req, res) => {
  // Get job roles from our service
  const jobRoles = await jobRoleService.getAllJobs();

  // Format the dates for display
  const formattedJobRoles = jobRoles.map((job: JobRole) => ({
    ...job,
    closingDate: job.closingDate.toLocaleDateString("en-GB"),
  }));

  // Handle error messages from redirects
  let errorMessage = "";
  if (req.query.error === "invalid-id") {
    errorMessage = "Invalid job ID provided.";
  } else if (req.query.error === "not-found") {
    errorMessage = "The job you're looking for doesn't exist or has been removed.";
  }

  // Handle success messages
  let successMessage = "";
  if (req.query.success === "created") {
    successMessage = "Job role created successfully!";
  }

  res.render("jobs", {
    title: "Available Job Roles",
    jobs: formattedJobRoles,
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
});

// Create job form page
app.get("/jobs/create", (req, res) => {
  const errorMessage = req.query.error ? String(req.query.error) : "";

  res.render("create-job", {
    title: "Create New Job Role",
    capabilities: CAPABILITIES,
    bands: BANDS,
    statuses: STATUSES,
    errorMessage: errorMessage,
  });
});

// Create job form submission
app.post("/jobs/create", jobController.createJob);

// Job detail endpoint
app.get("/jobs/:id", async (req, res) => {
  const jobIdParam = req.params.id;
  if (!jobIdParam) {
    res.redirect("/jobs?error=invalid-id");
    return;
  }

  const jobId = parseInt(jobIdParam, 10);

  // Check if the ID is a valid number
  if (Number.isNaN(jobId)) {
    res.redirect("/jobs?error=invalid-id");
    return;
  }

  try {
    const job = await jobRoleService.getJobById(jobId);

    // Format the date for display
    const formattedJob = {
      ...job,
      closingDate: job.closingDate.toLocaleDateString("en-GB"),
    };

    res.render("job-detail", {
      title: job.name,
      job: formattedJob,
    });
  } catch (_error) {
    res.redirect("/jobs?error=not-found");
  }
});

// Login route
app.get("/login", (_req, res) => {
  res.render("login", {
    title: "Login",
  });
});

// Logout route
app.post("/logout", (_req, res) => {
  // Clear session/authentication here when implemented
  res.redirect("/");
});

// Application routes
app.get("/jobs/:id/apply", applicationController.showApplicationForm);
app.post("/jobs/:id/apply", applicationController.submitApplication);
app.get("/jobs/:id/apply/success", applicationController.showApplicationSuccess);
app.get("/jobs/:id/applications", applicationController.showApplications);
app.get("/jobs/:id/applications/:applicationId", applicationController.showApplicationDetail);
app.post("/jobs/:id/applications/:applicationId/accept", applicationController.acceptApplication);
app.post("/jobs/:id/applications/:applicationId/reject", applicationController.rejectApplication);

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

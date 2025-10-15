import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware to make user available in all templates
app.use((req, res, next) => {
  res.locals.user = (req as any).session?.user || null;
  next();
});

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
app.get("/", async (_req, res) => {
  // Get the 3 most recent jobs for the homepage
  const allJobs = await jobRoleService.getAllJobs();
  console.log(allJobs);
  const latestJobs = allJobs
    .sort((a, b) => b.closingDate.getTime() - a.closingDate.getTime())
    .slice(0, 3)
    .map((job: JobRole) => ({
      ...job,
      closingDate: job.closingDate.toLocaleDateString("en-GB"),
    }));

  res.render("index", {
    title: "Kainos Jobs",
    message: "Find your next career opportunity with Belfast's leading software company",
    latestJobs: latestJobs,
  });
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
app.get("/login", (req, res) => {
  const errorMessage = req.query.error ? String(req.query.error) : "";

  res.render("login", {
    title: "Login",
    error: errorMessage,
  });
});

// Login form submission
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Mock authentication - in production, this would validate against a real database/API
  if (username && password) {
    // Mock user data - this would come from your authentication service/database
    const mockUser = {
      id: 1,
      name: username === "admin" ? "John Doe" : username,
      email: username === "admin" ? "john.doe@kainos.com" : `${username}@kainos.com`,
      phoneNumber: "+44 7900 123456",
      role: username === "admin" ? "admin" : "user"
    };

    // Store user in session
    (req as any).session.user = mockUser;
    res.redirect("/jobs");
  } else {
    res.redirect("/login?error=invalid-credentials");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

// Middleware to check if user is authenticated
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if ((req as any).session?.user) {
    (req as any).user = (req as any).session.user;
    next();
  } else {
    res.redirect("/login");
  }
};

// User profile route (requires authentication)
app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", {
    title: "Profile",
    user: (req as any).user
  });
});

// User applications route (requires authentication)
app.get("/my-applications", requireAuth, async (req, res) => {
  const user = (req as any).user;
  // This would typically fetch applications from the database filtered by user ID
  res.render("my-applications", {
    title: "My Applications",
    user: user,
    applications: [] // Would be populated from database
  });
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

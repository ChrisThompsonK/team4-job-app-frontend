import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import nunjucks from "nunjucks";
import "./types/express-session.js";
import { BANDS, CAPABILITIES, STATUSES } from "./constants/job-form-options.js";
import { ApplicationController } from "./controllers/application-controller.js";
import { AuthController } from "./controllers/auth-controller.js";
import { FormController } from "./controllers/form-controller.js";
import { JobController } from "./controllers/job-controller.js";
import {
  addUserToLocals,
  preventAdminAccess,
  requireAdmin,
  requireAuth,
} from "./middleware/auth.js";
import type { JobRole } from "./models/job-role.js";
import { ApplicationService } from "./services/applicationService.js";
import { AuthService } from "./services/authService.js";
import { JobService } from "./services/jobService.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

// Initialize services and controllers
const jobRoleService = new JobService(API_BASE_URL);
const jobController = new JobController(jobRoleService);
const applicationService = new ApplicationService();
const applicationController = new ApplicationController(applicationService, jobRoleService);
const authService = new AuthService(API_BASE_URL);
const authController = new AuthController(authService);

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

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax", // CSRF protection
    },
  })
);

// Add user information to all templates
app.use(addUserToLocals);

// Hello World endpoint - now renders a view
app.get("/", async (req, res) => {
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

  // Handle success messages from login redirects
  const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

  res.render("index", {
    message: "Find Your Next Career Opportunity",
    latestJobs: latestJobs,
    successDisplay: successDisplay,
  });
});

// Jobs listing endpoint
app.get("/jobs", async (req, res) => {
  // Get pagination parameters from query string
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Get job roles from our service with pagination
  const { jobs: jobRoles, total } = await jobRoleService.getJobsWithPagination(limit, offset);

  // Calculate pagination info
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  // Format the dates for display and add action button data
  const formattedJobRoles = jobRoles.map((job: JobRole) => {
    const actionButton = JobController.getJobActionButton(
      job,
      res.locals.isAuthenticated || false,
      res.locals.currentUser || null
    );

    return {
      ...job,
      closingDate: job.closingDate.toLocaleDateString("en-GB"),
      actionButton: actionButton,
    };
  });

  // Handle error and success messages using FormController
  const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
  const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

  // Check if user is admin for create job button visibility
  const isAdmin = res.locals.isAuthenticated && res.locals.currentUser?.role === "admin";

  res.render("jobs", {
    title: "Available Job Roles",
    jobs: formattedJobRoles,
    errorDisplay: errorDisplay,
    successDisplay: successDisplay,
    isAdmin: isAdmin,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      hasNext: hasNext,
      hasPrevious: hasPrevious,
      total: total,
      limit: limit,
    },
  });
});

// Create job form page
app.get("/jobs/create", requireAuth, requireAdmin, (req, res) => {
  const errorDisplay = FormController.getErrorDisplay(req.query.error as string);

  res.render("create-job", {
    title: "Create New Job Role",
    capabilities: CAPABILITIES,
    bands: BANDS,
    statuses: STATUSES,
    errorDisplay: errorDisplay,
  });
});

// Create job form submission
app.post("/jobs/create", requireAuth, requireAdmin, jobController.createJob);

// Edit job form page
app.get("/jobs/:id/edit", requireAuth, requireAdmin, jobController.showEditJob);

// Edit job form submission
app.put("/jobs/:id/edit", requireAuth, requireAdmin, jobController.updateJob);
app.post("/jobs/:id/edit", requireAuth, requireAdmin, jobController.updateJob); // Support for forms that can't use PUT

// Delete job
app.delete("/jobs/:id/delete", requireAuth, requireAdmin, jobController.deleteJob);
app.post("/jobs/:id/delete", requireAuth, requireAdmin, jobController.deleteJob); // Support for forms that can't use DELETE

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

    // Get job detail actions and metadata using controller
    const jobActions = JobController.getJobDetailActions(
      job,
      res.locals.isAuthenticated || false,
      res.locals.currentUser || null
    );
    const jobMetadata = JobController.getJobMetadata(job);

    // Handle messages from query parameters
    const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
    const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

    // Format the job data with controller-provided information
    const formattedJob = {
      ...job,
      closingDate: jobMetadata.formattedClosingDate,
      statusDisplay: jobMetadata.statusDisplay,
      positionsText: jobMetadata.positionsText,
      actions: jobActions,
    };

    res.render("job-detail", {
      title: job.name,
      job: formattedJob,
      errorDisplay: errorDisplay,
      successDisplay: successDisplay,
    });
  } catch (_error) {
    res.redirect("/jobs?error=not-found");
  }
});

// Authentication routes
app.get("/login", authController.showLogin);
app.post("/login", authController.login);
app.post("/logout", authController.logout);

// Application routes - require authentication and prevent admin access
app.get(
  "/jobs/:id/apply",
  requireAuth,
  preventAdminAccess,
  applicationController.showApplicationForm
);
app.post(
  "/jobs/:id/apply",
  requireAuth,
  preventAdminAccess,
  applicationController.submitApplication
);
app.get(
  "/jobs/:id/apply/success",
  requireAuth,
  preventAdminAccess,
  applicationController.showApplicationSuccess
);

// Admin routes - require admin access
app.get(
  "/jobs/:id/applications",
  requireAuth,
  requireAdmin,
  applicationController.showApplications
);
app.get(
  "/jobs/:id/applications/:applicationId",
  requireAuth,
  requireAdmin,
  applicationController.showApplicationDetail
);
app.post(
  "/jobs/:id/applications/:applicationId/accept",
  requireAuth,
  requireAdmin,
  applicationController.acceptApplication
);
app.post(
  "/jobs/:id/applications/:applicationId/reject",
  requireAuth,
  requireAdmin,
  applicationController.rejectApplication
);

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

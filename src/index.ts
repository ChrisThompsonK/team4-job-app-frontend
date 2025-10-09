import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import nunjucks from "nunjucks";
import { BANDS, CAPABILITIES, STATUSES } from "./constants/job-form-options.js";
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

// Initialize the application service
const applicationService = new ApplicationService(API_BASE_URL);

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

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
  const jobId = parseInt(req.params.id, 10);

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

    // Handle error messages from apply redirect
    let errorMessage = "";
    if (req.query.error === "not-accepting-applications") {
      if (job.status === "closed") {
        errorMessage = "This position is now closed and is no longer accepting applications.";
      } else if (job.numberOfOpenPositions === 0) {
        errorMessage =
          "All positions for this role have been filled. We are no longer accepting applications.";
      } else {
        errorMessage = "This position is not currently accepting applications.";
      }
    }

    res.render("job-detail", {
      title: job.name,
      job: formattedJob,
      errorMessage: errorMessage,
    });
  } catch (_error) {
    res.redirect("/jobs?error=not-found");
  }
});

// Application form route
app.get("/jobs/:id/apply", async (req, res) => {
  const jobId = parseInt(req.params.id ?? "", 10);

  // Check if the ID is a valid number
  if (Number.isNaN(jobId)) {
    res.redirect("/jobs?error=invalid-id");
    return;
  }

  try {
    const job = await jobRoleService.getJobById(jobId);

    // Check if job is open and has positions available
    if (job.status !== "open" || job.numberOfOpenPositions <= 0) {
      res.redirect(`/jobs/${jobId}?error=not-accepting-applications`);
      return;
    }

    // Format the date for display
    const formattedJob = {
      ...job,
      closingDate: job.closingDate.toLocaleDateString("en-GB"),
    };

    res.render("apply", {
      title: `Apply for ${job.name}`,
      job: formattedJob,
    });
  } catch (_error) {
    res.redirect("/jobs?error=not-found");
  }
});

// Submit application route
app.post("/jobs/:id/apply", upload.single("cv"), async (req, res) => {
  const jobId = parseInt(req.params.id ?? "", 10);

  // Check if the ID is a valid number
  if (Number.isNaN(jobId)) {
    res.redirect("/jobs?error=invalid-id");
    return;
  }

  try {
    const job = await jobRoleService.getJobById(jobId);

    // Check if job is open and has positions available
    if (job.status !== "open" || job.numberOfOpenPositions <= 0) {
      res.redirect(`/jobs/${jobId}?error=not-accepting-applications`);
      return;
    }

    // Validate form data
    const { applicantName, applicantEmail } = req.body;
    if (!applicantName || !applicantEmail || !req.file) {
      res.render("apply", {
        title: `Apply for ${job.name}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        errorMessage: "All fields are required. Please fill in all information and upload your CV.",
      });
      return;
    }

    // Submit application to backend
    await applicationService.createApplication({
      jobRoleId: jobId,
      applicantName,
      applicantEmail,
      cvFileName: req.file.filename,
    });

    // Render success page
    res.render("apply-success", {
      title: "Application Submitted",
      job: {
        ...job,
        closingDate: job.closingDate.toLocaleDateString("en-GB"),
      },
      submittedDate: new Date().toLocaleDateString("en-GB"),
    });
  } catch (error) {
    console.error("Error submitting application:", error);

    try {
      const job = await jobRoleService.getJobById(jobId);
      res.render("apply", {
        title: `Apply for ${job.name}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        errorMessage: "Failed to submit application. Please try again later.",
      });
    } catch (_innerError) {
      res.redirect("/jobs?error=submission-failed");
    }
  }
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

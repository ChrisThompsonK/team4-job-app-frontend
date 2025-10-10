import type { Request, Response } from "express";
import type { ApplicationService } from "../services/applicationService.js";
import type { JobService } from "../services/jobService.js";

export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService
  ) {}

  // Show the application form for a specific job
  showApplicationForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      if (!jobIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);

      if (Number.isNaN(jobId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Check if the job exists and is open
      const job = await this.jobService.getJobById(jobId);

      if (job.status !== "open" || job.numberOfOpenPositions === 0) {
        res.redirect(`/jobs/${jobId}?error=not-available`);
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
    } catch (error) {
      console.error("Error showing application form:", error);
      res.redirect("/jobs?error=not-found");
    }
  };

  // Handle application form submission
  submitApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      if (!jobIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);
      const { applicantName, email, phoneNumber, coverLetter } = req.body;

      if (Number.isNaN(jobId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Validate required fields
      if (!applicantName || !email) {
        res.redirect(`/jobs/${jobId}/apply?error=missing-fields`);
        return;
      }

      // Check if job exists and is still open
      const job = await this.jobService.getJobById(jobId);
      if (job.status !== "open" || job.numberOfOpenPositions === 0) {
        res.redirect(`/jobs/${jobId}?error=not-available`);
        return;
      }

      // Create the application
      await this.applicationService.createApplication({
        jobId,
        applicantName,
        email,
        phoneNumber,
        coverLetter,
      });

      // Redirect to success page
      res.redirect(`/jobs/${jobId}/apply/success`);
    } catch (error) {
      console.error("Error submitting application:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.redirect("/jobs?error=not-found");
      } else {
        res.redirect(`/jobs/${req.params.id}/apply?error=submission-failed`);
      }
    }
  };

  // Show application success page
  showApplicationSuccess = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      if (!jobIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);

      if (Number.isNaN(jobId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const job = await this.jobService.getJobById(jobId);

      res.render("apply-success", {
        title: "Application Submitted",
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
      });
    } catch (error) {
      console.error("Error showing success page:", error);
      res.redirect("/jobs?error=not-found");
    }
  };

  // Show all applications for a specific job
  showApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      if (!jobIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);

      if (Number.isNaN(jobId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Get the job details
      const job = await this.jobService.getJobById(jobId);

      // Get all applications for this job
      const applications = await this.applicationService.getApplicationsByJobId(jobId);

      // Format the dates for display
      const formattedApplications = applications.map((app) => ({
        ...app,
        applicationDate: app.applicationDate.toLocaleDateString("en-GB"),
      }));

      res.render("applications", {
        title: `Applications for ${job.name}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        applications: formattedApplications,
      });
    } catch (error) {
      console.error("Error showing applications:", error);
      res.redirect("/jobs?error=not-found");
    }
  };

  // Show a single application with full details
  showApplicationDetail = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      const applicationIdParam = req.params.applicationId;

      if (!jobIdParam || !applicationIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);
      const applicationId = parseInt(applicationIdParam, 10);

      if (Number.isNaN(jobId) || Number.isNaN(applicationId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Get the job details
      const job = await this.jobService.getJobById(jobId);

      // Get the application
      const application = await this.applicationService.getApplicationById(applicationId);

      // Verify the application belongs to this job
      if (application.jobId !== jobId) {
        res.redirect(`/jobs/${jobId}/applications?error=not-found`);
        return;
      }

      // Handle success messages
      let successMessage = "";
      if (req.query.success === "accepted") {
        successMessage = "Application accepted successfully!";
      } else if (req.query.success === "rejected") {
        successMessage = "Application rejected.";
      }

      res.render("application-detail", {
        title: `Application from ${application.applicantName}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        application: {
          ...application,
          applicationDate: application.applicationDate.toLocaleDateString("en-GB"),
        },
        successMessage,
      });
    } catch (error) {
      console.error("Error showing application detail:", error);
      res.redirect("/jobs?error=not-found");
    }
  };

  // Accept an application
  acceptApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      const applicationIdParam = req.params.applicationId;

      if (!jobIdParam || !applicationIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);
      const applicationId = parseInt(applicationIdParam, 10);

      if (Number.isNaN(jobId) || Number.isNaN(applicationId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Get notes from the form, or use default message
      const notes = req.body.notes || "Application accepted by reviewer";

      // Update the application status to accepted
      await this.applicationService.updateApplicationStatus(applicationId, "accepted", notes);

      res.redirect(`/jobs/${jobId}/applications/${applicationId}?success=accepted`);
    } catch (error) {
      console.error("Error accepting application:", error);
      res.redirect(`/jobs/${req.params.id}/applications?error=update-failed`);
    }
  };

  // Reject an application
  rejectApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobIdParam = req.params.id;
      const applicationIdParam = req.params.applicationId;

      if (!jobIdParam || !applicationIdParam) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      const jobId = parseInt(jobIdParam, 10);
      const applicationId = parseInt(applicationIdParam, 10);

      if (Number.isNaN(jobId) || Number.isNaN(applicationId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Get notes from the form, or use default message
      const notes = req.body.notes || "Application rejected by reviewer";

      // Update the application status to rejected
      await this.applicationService.updateApplicationStatus(applicationId, "rejected", notes);

      res.redirect(`/jobs/${jobId}/applications/${applicationId}?success=rejected`);
    } catch (error) {
      console.error("Error rejecting application:", error);
      res.redirect(`/jobs/${req.params.id}/applications?error=update-failed`);
    }
  };
}

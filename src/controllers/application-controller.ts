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
}

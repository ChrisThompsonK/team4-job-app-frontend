import type { Request, Response } from "express";
import type { ApplicationService } from "../services/applicationService.js";
import type { JobService } from "../services/jobService.js";
import { FormController } from "./form-controller.js";
import "../types/express-session.js";

interface ApplicationStatusDisplay {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
}

interface ApplicationAction {
  show: boolean;
  text: string;
  href?: string;
  className: string;
  formAction?: string;
  disabled?: boolean;
}

interface ApplicationActions {
  acceptAction: ApplicationAction;
  rejectAction: ApplicationAction;
  viewAction: ApplicationAction;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
}

interface ApplicationData {
  id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
}

export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService
  ) {}

  /**
   * Get application status display information
   */
  static getApplicationStatusDisplay(status: string): ApplicationStatusDisplay {
    switch (status) {
      case "pending":
        return {
          text: "Pending Review",
          color: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300",
          badgeClass: "bg-yellow-100 text-yellow-800",
        };
      case "reviewed":
        return {
          text: "Under Review",
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-300",
          badgeClass: "bg-blue-100 text-blue-800",
        };
      case "accepted":
        return {
          text: "Accepted",
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          badgeClass: "bg-green-100 text-green-800",
        };
      case "rejected":
        return {
          text: "Rejected",
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          badgeClass: "bg-red-100 text-red-800",
        };
      default:
        return {
          text: "Unknown",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          badgeClass: "bg-gray-100 text-gray-800",
        };
    }
  }

  /**
   * Get available actions for an application
   */
  static getApplicationActions(
    application: ApplicationData,
    isAuthenticated: boolean,
    currentUser: User | null,
    jobId: number
  ): ApplicationActions {
    const isAdmin = isAuthenticated && currentUser?.role === "admin";
    const canTakeAction =
      isAdmin && (application.status === "pending" || application.status === "reviewed");

    return {
      acceptAction: {
        show: canTakeAction,
        text: "Accept",
        className: "btn bg-green-600 hover:bg-green-700 text-white border-none",
        formAction: `/jobs/${jobId}/applications/${application.id}/accept`,
      },
      rejectAction: {
        show: canTakeAction,
        text: "Reject",
        className: "btn bg-red-600 hover:bg-red-700 text-white border-none",
        formAction: `/jobs/${jobId}/applications/${application.id}/reject`,
      },
      viewAction: {
        show: isAdmin,
        text: "View Details",
        href: `/jobs/${jobId}/applications/${application.id}`,
        className: "btn bg-blue-600 hover:bg-blue-700 text-white border-none text-center block",
      },
    };
  }

  /**
   * Get CSS classes for application card styling based on status
   */
  static getApplicationCardStyle(status: string): string {
    const statusDisplay = ApplicationController.getApplicationStatusDisplay(status);
    return `p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${statusDisplay.bgColor} border-2 ${statusDisplay.borderColor}`;
  }

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

      // Check if the user has already applied for this job
      const user = req.session?.user;
      if (user && user.id) {
        const hasApplied = await this.applicationService.hasUserAppliedForJob(user.id, jobId);
        if (hasApplied) {
          res.redirect(`/jobs/${jobId}?error=already-applied`);
          return;
        }
      }

      // Handle error and success messages using FormController
      const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
      const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

      // Format the date for display
      const formattedJob = {
        ...job,
        closingDate: job.closingDate.toLocaleDateString("en-GB"),
      };

      res.render("apply", {
        title: `Apply for ${job.name}`,
        job: formattedJob,
        user: req.session?.user || null, // Pass user info if available
        errorDisplay: errorDisplay,
        successDisplay: successDisplay,
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
      const { coverLetter } = req.body;
      const user = req.session?.user || null;

      if (Number.isNaN(jobId)) {
        res.redirect("/jobs?error=invalid-id");
        return;
      }

      // Check if user is logged in - required for backend API
      if (!user || !user.id) {
        res.redirect(`/login?redirectTo=/jobs/${jobId}/apply`);
        return;
      }

      // Validate cover letter (required for all users)
      if (!coverLetter || coverLetter.trim().length === 0) {
        res.redirect(`/jobs/${jobId}/apply?error=missing-fields`);
        return;
      }

      // Validate cover letter length (minimum 50 characters)
      if (coverLetter.trim().length < 50) {
        res.redirect(`/jobs/${jobId}/apply?error=validation-failed`);
        return;
      }

      // Check if job exists and is still open
      const job = await this.jobService.getJobById(jobId);
      if (job.status !== "open" || job.numberOfOpenPositions === 0) {
        res.redirect(`/jobs/${jobId}?error=not-available`);
        return;
      }

      // Create the application with logged-in user's ID
      const applicationData = {
        jobId,
        applicantName: user.username, // Backend doesn't use this, gets it from users table
        email: user.email, // Backend doesn't use this, gets it from users table
        coverLetter,
        userId: user.id, // Required by backend API
      };

      await this.applicationService.createApplication(applicationData);

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

      // Format the applications with status display and actions
      const formattedApplications = applications.map((app) => ({
        ...app,
        applicationDate: app.applicationDate.toLocaleDateString("en-GB"),
        statusDisplay: ApplicationController.getApplicationStatusDisplay(app.status),
        actions: ApplicationController.getApplicationActions(
          app,
          res.locals.isAuthenticated || false,
          res.locals.currentUser || null,
          jobId
        ),
        cardStyle: ApplicationController.getApplicationCardStyle(app.status),
      }));

      // Handle error and success messages using FormController
      const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
      const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

      res.render("applications", {
        title: `Applications for ${job.name}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        applications: formattedApplications,
        errorDisplay: errorDisplay,
        successDisplay: successDisplay,
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

      // Handle error and success messages using FormController
      const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
      const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

      // Format application with status display and actions
      const formattedApplication = {
        ...application,
        applicationDate: application.applicationDate.toLocaleDateString("en-GB"),
        statusDisplay: ApplicationController.getApplicationStatusDisplay(application.status),
        actions: ApplicationController.getApplicationActions(
          application,
          res.locals.isAuthenticated || false,
          res.locals.currentUser || null,
          jobId
        ),
      };

      res.render("application-detail", {
        title: `Application from ${application.applicantName}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        application: formattedApplication,
        errorDisplay: errorDisplay,
        successDisplay: successDisplay,
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
      res.redirect(`/jobs/${req.params.id}/applications?error=server-error`);
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
      res.redirect(`/jobs/${req.params.id}/applications?error=server-error`);
    }
  };

  // Show user's own applications
  showMyApplications = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.session?.user;

      if (!user) {
        res.redirect("/login");
        return;
      }

      // Get all applications for this user
      const userApplications = await this.applicationService.getApplicationsByUserId(user.id);

      // Get job details for each application
      const applicationsWithJobDetails = await Promise.all(
        userApplications.map(async (app) => {
          try {
            const job = await this.jobService.getJobById(app.jobId);
            return {
              ...app,
              jobTitle: job.name,
              location: job.location,
              capability: job.capability,
              applicationDate: app.applicationDate.toLocaleDateString("en-GB"),
              status: app.status,
            };
          } catch (error) {
            console.error(`Error fetching job ${app.jobId}:`, error);
            return {
              ...app,
              jobTitle: "Job Not Found",
              location: "N/A",
              capability: "N/A",
              applicationDate: app.applicationDate.toLocaleDateString("en-GB"),
              status: app.status,
            };
          }
        })
      );

      // Handle error and success messages
      const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
      const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

      res.render("my-applications", {
        title: "My Applications",
        applications: applicationsWithJobDetails,
        errorDisplay: errorDisplay,
        successDisplay: successDisplay,
      });
    } catch (error) {
      console.error("Error showing user applications:", error);
      res.redirect("/jobs?error=server-error");
    }
  };

  // Show a single application detail for the logged-in member
  showMyApplicationDetail = async (req: Request, res: Response): Promise<void> => {
    try {
      const applicationIdParam = req.params.applicationId;
      const user = req.session?.user;

      if (!user) {
        res.redirect("/login");
        return;
      }

      if (!applicationIdParam) {
        res.redirect("/my-applications?error=invalid-id");
        return;
      }

      const applicationId = parseInt(applicationIdParam, 10);

      if (Number.isNaN(applicationId)) {
        res.redirect("/my-applications?error=invalid-id");
        return;
      }

      // Get the application
      const application = await this.applicationService.getApplicationById(applicationId);

      // Removed logging of sensitive user information for security reasons.

      // Verify the application belongs to this user
      // If userId is undefined, it means it was created before we added user tracking
      // or it wasn't properly set when created
      if (application.userId && application.userId !== user.id) {
        console.error(
          `Unauthorized access attempt: User ${user.id} tried to access application ${applicationId} owned by user ${application.userId}`
        );
        res.redirect("/my-applications?error=unauthorized");
        return;
      }

      // If userId is not set, we can't verify ownership, but for backward compatibility
      // we could check if the email matches (optional security measure)
      if (!application.userId && application.email !== user.email) {
        console.error(
          `Unauthorized access attempt: User ${user.email} tried to access application ${applicationId} with email ${application.email}`
        );
        res.redirect("/my-applications?error=unauthorized");
        return;
      }

      // Get the job details
      const job = await this.jobService.getJobById(application.jobId);

      // Handle error and success messages
      const errorDisplay = FormController.getErrorDisplay(req.query.error as string);
      const successDisplay = FormController.getSuccessDisplay(req.query.success as string);

      // Format application with status display
      const formattedApplication = {
        ...application,
        applicationDate: application.applicationDate.toLocaleDateString("en-GB"),
        statusDisplay: ApplicationController.getApplicationStatusDisplay(application.status),
      };

      res.render("my-application-detail", {
        title: `Application for ${job.name}`,
        job: {
          ...job,
          closingDate: job.closingDate.toLocaleDateString("en-GB"),
        },
        application: formattedApplication,
        errorDisplay: errorDisplay,
        successDisplay: successDisplay,
      });
    } catch (error) {
      console.error("Error showing application detail:", error);
      res.redirect("/my-applications?error=not-found");
    }
  };
}

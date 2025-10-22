import type { Request, Response } from "express";
import { CreateJobRole } from "../models/create-job-role.js";
import type { JobRole } from "../models/job-role.js";
import type { JobService } from "../services/jobService.js";
import { FormController } from "./form-controller.js";

interface JobActionButton {
  show: boolean;
  text: string;
  href: string;
  className: string;
  disabled?: boolean;
}

interface JobDetailActions {
  headerAction: JobActionButton;
  sidebarContent: {
    showApplySection: boolean;
    showManageSection: boolean;
    applyAction: JobActionButton;
  };
}

interface JobStatusDisplay {
  text: string;
  color: string;
  iconClass: string;
  badgeClass: string;
}

interface JobMetadata {
  formattedClosingDate: string;
  positionsText: string;
  statusDisplay: JobStatusDisplay;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
}

export class JobController {
  private jobRoleService: JobService;

  constructor(jobRoleService: JobService) {
    this.jobRoleService = jobRoleService;
  }

  /**
   * Determines what action button should be shown for a job based on user authentication and role
   */
  static getJobActionButton(
    job: JobRole,
    isAuthenticated: boolean,
    currentUser: User | null
  ): JobActionButton {
    // For admins: show View Applications button
    if (isAuthenticated && currentUser?.role === "admin") {
      return {
        show: true,
        text: "View Applications",
        href: `/jobs/${job.id}/applications`,
        className: "btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none",
      };
    }

    // For jobs that are open with available positions
    if (job.status === "open" && job.numberOfOpenPositions > 0) {
      // For authenticated non-admin users: show Apply Now button
      if (isAuthenticated && currentUser?.role !== "admin") {
        return {
          show: true,
          text: "Apply Now",
          href: `/jobs/${job.id}/apply`,
          className: "btn bg-blue-600 hover:bg-blue-700 text-white border-none",
        };
      }

      // For non-authenticated users: show Login to Apply button
      if (!isAuthenticated) {
        return {
          show: true,
          text: "Login to Apply",
          href: `/login?redirectTo=/jobs/${job.id}/apply`,
          className: "btn bg-blue-600 hover:bg-blue-700 text-white border-none",
        };
      }
    }

    // For jobs that are open but have no positions available
    if (job.status === "open" && job.numberOfOpenPositions === 0) {
      return {
        show: true,
        text: "No Positions",
        href: "",
        className: "btn bg-gray-400 text-white border-none cursor-not-allowed",
        disabled: true,
      };
    }

    // For closed jobs
    if (job.status === "closed") {
      return {
        show: true,
        text: "Closed",
        href: "",
        className: "btn bg-gray-400 text-white border-none cursor-not-allowed",
        disabled: true,
      };
    }

    // Default: no button
    return {
      show: false,
      text: "",
      href: "",
      className: "",
    };
  }

  /**
   * Get job detail page actions (header and sidebar)
   */
  static getJobDetailActions(
    job: JobRole,
    isAuthenticated: boolean,
    currentUser: User | null
  ): JobDetailActions {
    // Header action (same logic as job card for consistency)
    const headerAction = JobController.getJobActionButton(job, isAuthenticated, currentUser);

    // Sidebar content logic
    const isAdmin = isAuthenticated && currentUser?.role === "admin";
    const isNonAdminUser = isAuthenticated && currentUser?.role !== "admin";

    let applyAction: JobActionButton = { show: false, text: "", href: "", className: "" };

    // Apply section logic
    if (job.status === "open" && job.numberOfOpenPositions > 0) {
      if (isNonAdminUser) {
        applyAction = {
          show: true,
          text: "Apply Now",
          href: `/jobs/${job.id}/apply`,
          className: "btn bg-blue-600 hover:bg-blue-700 text-white border-none w-full",
        };
      } else if (!isAuthenticated) {
        applyAction = {
          show: true,
          text: "Login to Apply",
          href: `/login?redirectTo=/jobs/${job.id}/apply`,
          className: "btn bg-blue-600 hover:bg-blue-700 text-white border-none w-full",
        };
      }
    } else if (job.status === "open" && job.numberOfOpenPositions === 0) {
      applyAction = {
        show: true,
        text: "No Positions Available",
        href: "",
        className: "btn bg-gray-400 text-white border-none w-full cursor-not-allowed",
        disabled: true,
      };
    } else if (job.status === "closed") {
      applyAction = {
        show: true,
        text: "Applications Closed",
        href: "",
        className: "btn bg-gray-400 text-white border-none w-full cursor-not-allowed",
        disabled: true,
      };
    }

    return {
      headerAction,
      sidebarContent: {
        showApplySection: !isAdmin,
        showManageSection: isAdmin,
        applyAction,
      },
    };
  }

  /**
   * Get job status display information
   */
  static getJobStatusDisplay(job: JobRole): JobStatusDisplay {
    if (job.status === "open") {
      return {
        text: "Open",
        color: "text-green-600",
        iconClass: "circle-check",
        badgeClass: "bg-green-100 text-green-800",
      };
    } else {
      return {
        text: "Closed",
        color: "text-red-600",
        iconClass: "circle-x",
        badgeClass: "bg-red-100 text-red-800",
      };
    }
  }

  /**
   * Get formatted job metadata
   */
  static getJobMetadata(job: JobRole): JobMetadata {
    const statusDisplay = JobController.getJobStatusDisplay(job);
    const positionCount = job.numberOfOpenPositions;
    const positionsText = `${positionCount} position${positionCount !== 1 ? "s" : ""}`;

    return {
      formattedClosingDate: job.closingDate.toLocaleDateString("en-GB"),
      positionsText,
      statusDisplay,
    };
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate required fields using FormController
      const requiredFields = [
        "name",
        "location",
        "capability",
        "band",
        "summary",
        "keyResponsibilities",
        "numberOfOpenPositions",
        "closingDate",
      ];
      const formErrors = FormController.validateRequiredFields(req.body, requiredFields);

      if (Object.keys(formErrors).length > 0) {
        res.redirect("/jobs/create?error=missing-fields");
        return;
      }

      // Additional validation for numerical fields
      const numberOfPositions = parseInt(req.body.numberOfOpenPositions, 10);
      if (Number.isNaN(numberOfPositions) || numberOfPositions < 1) {
        res.redirect("/jobs/create?error=validation-failed");
        return;
      }

      // Validate closing date is in the future
      const closingDate = new Date(req.body.closingDate);
      if (closingDate <= new Date()) {
        res.redirect("/jobs/create?error=validation-failed");
        return;
      }

      const jobData = CreateJobRole.fromRequestBody(req.body);
      await this.jobRoleService.createJob(jobData);
      res.redirect("/jobs?success=created");
    } catch (error) {
      console.error("Error creating job role:", error);
      res.redirect("/jobs/create?error=server-error");
    }
  };

  showEditJob = async (req: Request, res: Response): Promise<void> => {
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

      const job = await this.jobRoleService.getJobById(jobId);

      // Format the date for the form (YYYY-MM-DD format)
      const formattedJob = {
        ...job,
        closingDate: job.closingDate.toISOString().split("T")[0],
      };

      res.render("edit-job", {
        title: `Edit ${job.name}`,
        job: formattedJob,
        errorMessage: req.query.error ? String(req.query.error) : "",
      });
    } catch (error) {
      console.error("Error showing edit job form:", error);
      res.redirect("/jobs?error=not-found");
    }
  };

  updateJob = async (req: Request, res: Response): Promise<void> => {
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

      // Validate required fields
      const requiredFields = [
        "name",
        "location",
        "capability",
        "band",
        "summary",
        "keyResponsibilities",
        "numberOfOpenPositions",
        "closingDate",
      ];
      const formErrors = FormController.validateRequiredFields(req.body, requiredFields);

      if (Object.keys(formErrors).length > 0) {
        res.redirect(`/jobs/${jobId}/edit?error=missing-fields`);
        return;
      }

      // Additional validation for numerical fields
      const numberOfPositions = parseInt(req.body.numberOfOpenPositions, 10);
      if (Number.isNaN(numberOfPositions) || numberOfPositions < 1) {
        res.redirect(`/jobs/${jobId}/edit?error=validation-failed`);
        return;
      }

      const jobData = CreateJobRole.fromRequestBody(req.body);
      await this.jobRoleService.updateJob(jobId, jobData);
      res.redirect(`/jobs/${jobId}?success=updated`);
    } catch (error) {
      console.error("Error updating job role:", error);
      const jobId = req.params.id;
      res.redirect(`/jobs/${jobId}/edit?error=server-error`);
    }
  };

  deleteJob = async (req: Request, res: Response): Promise<void> => {
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

      await this.jobRoleService.deleteJob(jobId);
      res.redirect("/jobs?success=deleted");
    } catch (error) {
      console.error("Error deleting job role:", error);
      const jobId = req.params.id;
      res.redirect(`/jobs/${jobId}?error=delete-failed`);
    }
  };
}

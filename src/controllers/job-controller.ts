import type { Request, Response } from "express";
import { CreateJobRole } from "../models/create-job-role.js";
import type { JobService } from "../services/jobService.js";

export class JobController {
  private jobRoleService: JobService;

  constructor(jobRoleService: JobService) {
    this.jobRoleService = jobRoleService;
  }

  createJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const jobData = CreateJobRole.fromRequestBody(req.body);

      await this.jobRoleService.createJob(jobData);
      res.redirect("/jobs?success=created");
    } catch (error) {
      console.error("Error creating job role:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create job role";
      res.redirect(`/jobs/create?error=${encodeURIComponent(errorMessage)}`);
    }
  };
}

import type { JobDescription } from "../models/job-description.js";
import type { JobRole } from "../models/job-role.js";

export interface JobRoleService {
  getJobRoles(): JobRole[];
  getJobRoleById(id: string): JobRole | undefined;
  getJobDescriptionById(id: string): JobDescription | undefined;
}

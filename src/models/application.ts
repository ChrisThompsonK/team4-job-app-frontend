export interface Application {
  id: number;
  jobRoleId: number;
  applicantName: string;
  applicantEmail: string;
  cvFileName: string;
  status: "in progress" | "under review" | "accepted" | "rejected";
  createdAt: Date;
}

export interface CreateApplicationRequest {
  jobRoleId: number;
  applicantName: string;
  applicantEmail: string;
  cvFileName: string;
}

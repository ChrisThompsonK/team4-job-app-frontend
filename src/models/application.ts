export interface Application {
  id: number;
  jobId: number;
  applicantName: string;
  email: string;
  phoneNumber?: string;
  cv?: string; // File path or URL to CV
  coverLetter?: string;
  applicationDate: Date;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  notes?: string;
  userId?: number; // ID of the logged-in user who submitted the application
}

export interface CreateApplicationRequest {
  jobId: number;
  applicantName: string;
  email: string;
  phoneNumber?: string;
  cv?: string;
  coverLetter?: string;
  userId?: number; // ID of the logged-in user who submitted the application
}

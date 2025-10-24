export interface Application {
  id: number;
  jobId: number;
  applicantName: string;
  email: string;
  phoneNumber?: string;
  cvUrl?: string | undefined; // URL to uploaded CV file
  cvFileName?: string | undefined; // Original filename of uploaded CV
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
  cvFile?: Express.Multer.File; // Multer file object for CV upload
  userId?: number; // ID of the logged-in user who submitted the application
}

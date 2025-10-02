export interface JobRole {
  id: number;
  name: string;
  location: string;
  capability: string;
  band: string;
  closingDate: Date;
  summary: string;
  keyResponsibilities: string;
  status: "open" | "closed";
  numberOfOpenPositions: number;
}

export class CreateJobRole {
  name: string;
  location: string;
  capability: string;
  band: string;
  closingDate: Date;
  summary: string;
  keyResponsibilities: string;
  status: "open" | "closed";
  numberOfOpenPositions: number;

  constructor(
    name: string,
    location: string,
    capability: string,
    band: string,
    closingDate: Date,
    summary: string,
    keyResponsibilities: string,
    status: "open" | "closed",
    numberOfOpenPositions: number
  ) {
    this.name = name;
    this.location = location;
    this.capability = capability;
    this.band = band;
    this.closingDate = closingDate;
    this.summary = summary;
    this.keyResponsibilities = keyResponsibilities;
    this.status = status;
    this.numberOfOpenPositions = numberOfOpenPositions;
  }

  static fromRequestBody(body: {
    name: string;
    location: string;
    capability: string;
    band: string;
    closingDate: string;
    summary: string;
    keyResponsibilities: string;
    status: string;
    numberOfOpenPositions: string | number;
  }): CreateJobRole {
    return new CreateJobRole(
      body.name,
      body.location,
      body.capability,
      body.band,
      new Date(body.closingDate),
      body.summary,
      body.keyResponsibilities,
      body.status as "open" | "closed",
      typeof body.numberOfOpenPositions === "string"
        ? parseInt(body.numberOfOpenPositions, 10)
        : body.numberOfOpenPositions
    );
  }
}

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRole } from "../models/job-role.js";

// Mock axios with hoisting to ensure it's available before imports
const mockAxiosInstance = vi.hoisted(() => ({
  get: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  defaults: { baseURL: "/api" },
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: vi.fn(),
  },
  isAxiosError: vi.fn(),
}));

import axios from "axios";
import { JobService } from "./jobService.js";

describe("JobService", () => {
  let jobService: JobService;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create new service instance
    jobService = new JobService();
  });

  describe("getAllJobs", () => {
    it("should fetch all jobs successfully", async () => {
      const mockJobs: JobRole[] = [
        {
          id: 1,
          name: "Software Engineer",
          location: "London",
          capability: "Engineering",
          band: "Consultant",
          closingDate: new Date("2024-11-15T00:00:00.000Z"),
          summary: "Test summary",
          keyResponsibilities: "Test responsibilities",
          status: "open",
          numberOfOpenPositions: 3,
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: mockJobs });

      const result = await jobService.getAllJobs();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/jobs");
      expect(result).toHaveLength(1);
      expect(result[0]?.closingDate).toBeInstanceOf(Date);
    });

    it("should handle 404 error", async () => {
      const error = {
        response: { status: 404 },
      };
      mockAxiosInstance.get.mockRejectedValue(error);
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      await expect(jobService.getAllJobs()).rejects.toThrow("Jobs endpoint not found");
    });
  });

  describe("getJobById", () => {
    it("should fetch job by id successfully", async () => {
      const mockJob: JobRole = {
        id: 1,
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2024-11-15T00:00:00.000Z"),
        summary: "Test summary",
        keyResponsibilities: "Test responsibilities",
        status: "open",
        numberOfOpenPositions: 3,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockJob });

      const result = await jobService.getJobById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/jobs/1");
      expect(result.id).toBe(1);
      expect(result.closingDate).toBeInstanceOf(Date);
    });

    it("should handle 404 error for specific job", async () => {
      const error = {
        response: { status: 404 },
      };
      mockAxiosInstance.get.mockRejectedValue(error);
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      await expect(jobService.getJobById(999)).rejects.toThrow("Job with ID 999 not found");
    });
  });
});

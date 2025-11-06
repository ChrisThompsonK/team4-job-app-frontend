// Mock Backend Server for Local Testing
// This server provides mock API endpoints to allow frontend/tests to run
// Run this to start: npm run mock:backend

import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Mock data
const mockJobs = [
  {
    id: 1,
    name: "Software Engineer",
    location: "London",
    capability: "Engineering",
    band: "Mid-Level",
    closingDate: new Date("2025-12-31"),
    status: "open",
    positions: 2,
  },
  {
    id: 2,
    name: "Product Manager",
    location: "Remote",
    capability: "Product",
    band: "Senior",
    closingDate: new Date("2025-12-15"),
    status: "open",
    positions: 1,
  },
  {
    id: 3,
    name: "Data Analyst",
    location: "Manchester",
    capability: "Analytics",
    band: "Junior",
    closingDate: new Date("2025-11-30"),
    status: "open",
    positions: 3,
  },
];

const mockUsers = [
  {
    id: 1,
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    name: "Admin User",
  },
  {
    id: 2,
    email: "user@example.com",
    password: "password123",
    role: "user",
    name: "Test User",
  },
];

// Jobs endpoints
app.get("/jobs", (req, res) => {
  res.json(mockJobs);
});

app.get("/api/jobs", (req, res) => {
  res.json(mockJobs);
});

app.get("/jobs/:id", (req, res) => {
  const job = mockJobs.find((j) => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  res.json(job);
});

app.get("/api/jobs/:id", (req, res) => {
  const job = mockJobs.find((j) => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: "Job not found", job: null });
  }
  res.json({ job: job });
});

app.post("/jobs", (req, res) => {
  const newJob = {
    id: Math.max(...mockJobs.map((j) => j.id), 0) + 1,
    ...req.body,
    closingDate: new Date(req.body.closingDate),
  };
  mockJobs.push(newJob);
  res.status(201).json(newJob);
});

app.post("/api/jobs", (req, res) => {
  const newJob = {
    id: Math.max(...mockJobs.map((j) => j.id), 0) + 1,
    ...req.body,
    closingDate: new Date(req.body.closingDate),
  };
  mockJobs.push(newJob);
  res.status(201).json(newJob);
});

app.put("/jobs/:id", (req, res) => {
  const job = mockJobs.find((j) => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  Object.assign(job, req.body);
  res.json(job);
});

app.put("/api/jobs/:id", (req, res) => {
  const job = mockJobs.find((j) => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  Object.assign(job, req.body);
  res.json(job);
});

app.delete("/jobs/:id", (req, res) => {
  const index = mockJobs.findIndex((j) => j.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  mockJobs.splice(index, 1);
  res.status(204).send();
});

app.delete("/api/jobs/:id", (req, res) => {
  const index = mockJobs.findIndex((j) => j.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  mockJobs.splice(index, 1);
  res.status(204).send();
});

// Auth endpoints
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
});

app.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body;

  if (mockUsers.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: Math.max(...mockUsers.map((u) => u.id), 0) + 1,
    email,
    password,
    name,
    role: "user",
  };

  mockUsers.push(newUser);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    },
  });
});

app.post("/auth/logout", (req, res) => {
  res.json({ success: true });
});

// Applications endpoints
app.get("/applications", (req, res) => {
  res.json([]);
});

app.post("/applications", (req, res) => {
  res.status(201).json({
    id: 1,
    jobId: req.body.jobId,
    userId: req.body.userId,
    status: "submitted",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Mock Backend API running on http://localhost:${PORT}`);
  console.log("");
  console.log("Available endpoints:");
  console.log("  GET  /health");
  console.log("  GET  /jobs");
  console.log("  GET  /jobs/:id");
  console.log("  POST /auth/login");
  console.log("  POST /auth/register");
  console.log("  POST /auth/logout");
  console.log("");
  console.log("Test credentials:");
  console.log("  Email: admin@example.com");
  console.log("  Password: password123");
  console.log("  Role: admin");
});

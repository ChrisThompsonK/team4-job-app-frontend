import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

export class InMemoryJobRoleService implements JobRoleService {
  private jobRoles: JobRole[];

  constructor() {
    this.jobRoles = this.createSampleJobRoles();
  }

  /**
   * Get all jobs from in-memory storage
   */
  async getAllJobs(limit?: number, offset?: number): Promise<JobRole[]> {
    let jobs = [...this.jobRoles];
    
    if (offset !== undefined) {
      jobs = jobs.slice(offset);
    }
    
    if (limit !== undefined) {
      jobs = jobs.slice(0, limit);
    }
    
    return Promise.resolve(jobs);
  }

  /**
   * Get jobs with pagination info
   */
  async getJobsWithPagination(
    limit?: number,
    offset?: number
  ): Promise<{ jobs: JobRole[]; total: number }> {
    const jobs = await this.getAllJobs(limit, offset);
    return Promise.resolve({ jobs, total: this.jobRoles.length });
  }

  /**
   * Get a specific job by ID from in-memory storage
   */
  async getJobById(id: number): Promise<JobRole> {
    const job = this.jobRoles.find((job) => job.id === id);
    if (!job) {
      throw new Error(`Job with ID ${id} not found`);
    }
    return Promise.resolve(job);
  }

  /**
   * Create a new job role in in-memory storage
   */
  async createJob(jobData: Omit<JobRole, "id">): Promise<JobRole> {
    const newId = Math.max(...this.jobRoles.map((job) => job.id), 0) + 1;
    const newJob: JobRole = {
      id: newId,
      ...jobData,
    };
    this.jobRoles.push(newJob);
    return Promise.resolve(newJob);
  }

  private createSampleJobRoles(): JobRole[] {
    return [
      {
        id: 1,
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-11-15"),
        summary:
          "Join our dynamic engineering team to build cutting-edge software solutions that drive digital transformation for our clients across various industries.",
        keyResponsibilities:
          "Design and develop scalable software applications using modern technologies. Collaborate with cross-functional teams to deliver high-quality solutions. Participate in code reviews and maintain coding standards. Troubleshoot and debug applications to ensure optimal performance. Contribute to technical documentation and knowledge sharing.",
        status: "open",
        numberOfOpenPositions: 3,
      },
      {
        id: 2,
        name: "Senior Software Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-30"),
        summary:
          "Lead technical initiatives and mentor junior developers while delivering complex software solutions for enterprise clients.",
        keyResponsibilities:
          "Lead the design and architecture of complex software systems. Mentor junior developers and provide technical guidance. Drive technical decision-making and best practices. Collaborate with stakeholders to define technical requirements. Ensure code quality through reviews and automated testing.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 3,
        name: "Principal Software Engineer",
        location: "Birmingham",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2025-12-10"),
        summary:
          "Shape the technical direction of major projects and drive innovation across our engineering organization.",
        keyResponsibilities:
          "Define technical strategy and architecture for large-scale projects. Lead cross-functional teams and technical initiatives. Drive innovation and adoption of new technologies. Provide technical leadership and guidance to engineering teams. Collaborate with product and business stakeholders.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 4,
        name: "Data Scientist",
        location: "Manchester",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2025-11-20"),
        summary:
          "Extract valuable insights from complex datasets to drive data-driven decision making for our clients.",
        keyResponsibilities:
          "Analyze large datasets to identify patterns and trends. Develop predictive models and machine learning algorithms. Create data visualizations and reports for stakeholders. Collaborate with business teams to define analytics requirements. Implement data science solutions in production environments.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 5,
        name: "Senior Data Scientist",
        location: "Edinburgh",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2025-12-05"),
        summary:
          "Lead advanced analytics projects and drive the development of sophisticated data science solutions.",
        keyResponsibilities:
          "Lead complex data science projects from conception to delivery. Develop advanced machine learning models and algorithms. Mentor junior data scientists and analysts. Present findings and recommendations to senior stakeholders. Drive best practices in data science methodology.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 6,
        name: "DevOps Engineer",
        location: "Leeds",
        capability: "Platforms",
        band: "Consultant",
        closingDate: new Date("2025-11-25"),
        summary:
          "Build and maintain robust CI/CD pipelines and cloud infrastructure to support our development teams.",
        keyResponsibilities:
          "Design and implement CI/CD pipelines for automated deployment. Manage cloud infrastructure using Infrastructure as Code. Monitor system performance and implement optimization strategies. Collaborate with development teams to improve deployment processes. Ensure security and compliance across all environments.",
        status: "open",
        numberOfOpenPositions: 4,
      },
      {
        id: 7,
        name: "Senior DevOps Engineer",
        location: "Glasgow",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-12-01"),
        summary:
          "Lead DevOps initiatives and architect scalable infrastructure solutions for enterprise applications.",
        keyResponsibilities:
          "Architect and implement scalable cloud infrastructure solutions. Lead DevOps transformation initiatives for client projects. Design disaster recovery and business continuity strategies. Mentor junior DevOps engineers and platform specialists. Drive automation and optimization across all environments.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 8,
        name: "Business Analyst",
        location: "Bristol",
        capability: "Business Change",
        band: "Analyst",
        closingDate: new Date("2025-11-18"),
        summary:
          "Bridge the gap between business requirements and technical solutions to drive successful project outcomes.",
        keyResponsibilities:
          "Gather and analyze business requirements from stakeholders. Create detailed functional specifications and user stories. Facilitate workshops and stakeholder meetings. Support testing activities and user acceptance testing. Document business processes and recommend improvements.",
        status: "open",
        numberOfOpenPositions: 3,
      },
      {
        id: 9,
        name: "Senior Business Analyst",
        location: "Newcastle",
        capability: "Business Change",
        band: "Senior Analyst",
        closingDate: new Date("2025-12-03"),
        summary:
          "Lead business analysis activities for complex transformation projects and drive organizational change.",
        keyResponsibilities:
          "Lead business analysis for large-scale transformation projects. Develop business cases and feasibility studies. Manage stakeholder relationships and communications. Design and implement change management strategies. Mentor junior business analysts and team members.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 10,
        name: "UX Designer",
        location: "Cardiff",
        capability: "Experience Design",
        band: "Consultant",
        closingDate: new Date("2025-11-22"),
        summary:
          "Create intuitive and engaging user experiences that delight customers and drive business success.",
        keyResponsibilities:
          "Design user-centered digital experiences and interfaces. Conduct user research and usability testing. Create wireframes, prototypes, and design specifications. Collaborate with developers to ensure design implementation. Advocate for accessibility and inclusive design principles.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 11,
        name: "Frontend Developer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-20"),
        summary:
          "Build beautiful and responsive user interfaces using modern frontend frameworks and best practices.",
        keyResponsibilities:
          "Develop responsive web applications using React, Vue, or Angular. Implement pixel-perfect designs with attention to detail. Optimize frontend performance and accessibility. Collaborate with UX designers and backend developers. Write clean, maintainable, and well-tested code.",
        status: "open",
        numberOfOpenPositions: 3,
      },
      {
        id: 12,
        name: "Backend Developer",
        location: "Belfast",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-25"),
        summary:
          "Design and implement robust backend services and APIs that power modern applications.",
        keyResponsibilities:
          "Develop RESTful APIs and microservices. Design and optimize database schemas. Implement security and authentication mechanisms. Write comprehensive tests and documentation. Monitor and optimize application performance.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 13,
        name: "Full Stack Developer",
        location: "Manchester",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-05"),
        summary:
          "Work across the entire technology stack to deliver end-to-end solutions for complex business problems.",
        keyResponsibilities:
          "Design and develop full-stack applications. Architect scalable frontend and backend solutions. Integrate third-party services and APIs. Lead technical implementations and code reviews. Mentor junior developers on best practices.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 14,
        name: "Cloud Architect",
        location: "London",
        capability: "Platforms",
        band: "Principal",
        closingDate: new Date("2025-11-12"),
        summary: "Design and implement enterprise-scale cloud architectures on AWS, Azure, or GCP.",
        keyResponsibilities:
          "Design cloud infrastructure and migration strategies. Define cloud governance and cost optimization approaches. Lead cloud transformation initiatives. Provide technical leadership on cloud best practices. Ensure security, compliance, and disaster recovery.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 15,
        name: "Security Engineer",
        location: "Edinburgh",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-10-30"),
        summary:
          "Protect our systems and client data by implementing robust security measures and practices.",
        keyResponsibilities:
          "Conduct security assessments and penetration testing. Implement security controls and monitoring. Respond to security incidents and vulnerabilities. Develop security policies and procedures. Train teams on security best practices.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 16,
        name: "Product Manager",
        location: "Birmingham",
        capability: "Business Change",
        band: "Manager",
        closingDate: new Date("2025-11-08"),
        summary:
          "Drive product vision and strategy to deliver exceptional value to customers and stakeholders.",
        keyResponsibilities:
          "Define product roadmap and strategy. Gather and prioritize product requirements. Collaborate with design and engineering teams. Analyze market trends and user feedback. Measure product success and iterate based on data.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 17,
        name: "Scrum Master",
        location: "Leeds",
        capability: "Business Change",
        band: "Consultant",
        closingDate: new Date("2025-10-28"),
        summary:
          "Facilitate agile practices and remove impediments to help teams deliver value efficiently.",
        keyResponsibilities:
          "Facilitate Scrum ceremonies and sprint planning. Coach teams on agile principles and practices. Remove blockers and facilitate communication. Track team metrics and drive continuous improvement. Foster a collaborative team environment.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 18,
        name: "UI/UX Designer",
        location: "Bristol",
        capability: "Experience Design",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-15"),
        summary:
          "Lead the design of exceptional user experiences that combine beauty with functionality.",
        keyResponsibilities:
          "Lead end-to-end design processes from research to delivery. Create wireframes, prototypes, and high-fidelity designs. Conduct user research and usability testing. Establish and maintain design systems. Collaborate with product and engineering teams.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 19,
        name: "Data Engineer",
        location: "Glasgow",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2025-10-22"),
        summary:
          "Build and maintain data pipelines and infrastructure to enable data-driven insights.",
        keyResponsibilities:
          "Design and build ETL/ELT data pipelines. Develop data warehouse and lake solutions. Ensure data quality and governance. Optimize data processing and storage. Collaborate with data scientists and analysts.",
        status: "open",
        numberOfOpenPositions: 3,
      },
      {
        id: 20,
        name: "Machine Learning Engineer",
        location: "London",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-28"),
        summary:
          "Deploy and scale machine learning models that solve real-world business problems.",
        keyResponsibilities:
          "Develop and deploy ML models to production. Build ML pipelines and infrastructure. Optimize model performance and scalability. Collaborate with data scientists and engineers. Monitor and maintain ML systems in production.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 21,
        name: "Test Automation Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2025-10-18"),
        summary: "Ensure software quality through comprehensive automated testing strategies.",
        keyResponsibilities:
          "Design and implement test automation frameworks. Create automated test suites for web and mobile. Integrate tests into CI/CD pipelines. Perform performance and load testing. Report and track defects and test metrics.",
        status: "open",
        numberOfOpenPositions: 2,
      },
      {
        id: 22,
        name: "Site Reliability Engineer",
        location: "Manchester",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-10"),
        summary:
          "Ensure system reliability, performance, and scalability through engineering excellence.",
        keyResponsibilities:
          "Design and maintain highly available systems. Implement monitoring and alerting solutions. Automate operational tasks and incident response. Conduct capacity planning and performance tuning. Lead incident post-mortems and improvements.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 23,
        name: "Technical Lead",
        location: "London",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2025-12-01"),
        summary:
          "Lead engineering teams to deliver high-quality technical solutions on complex projects.",
        keyResponsibilities:
          "Provide technical leadership and direction. Make key architectural and technology decisions. Mentor and develop engineering team members. Ensure code quality and technical excellence. Collaborate with stakeholders on technical strategy.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 24,
        name: "Agile Coach",
        location: "Cardiff",
        capability: "Business Change",
        band: "Senior Consultant",
        closingDate: new Date("2025-11-20"),
        summary:
          "Transform organizations through agile practices and continuous improvement culture.",
        keyResponsibilities:
          "Coach teams and leaders on agile transformation. Design and deliver agile training programs. Assess team maturity and identify improvements. Facilitate organizational change initiatives. Promote agile mindset and practices across the organization.",
        status: "open",
        numberOfOpenPositions: 1,
      },
      {
        id: 25,
        name: "Solutions Architect",
        location: "Edinburgh",
        capability: "Platforms",
        band: "Principal",
        closingDate: new Date("2025-12-05"),
        summary:
          "Design comprehensive technical solutions that align with business objectives and requirements.",
        keyResponsibilities:
          "Design end-to-end technical solutions for client projects. Define architecture patterns and standards. Lead technical discovery and solution design. Collaborate with stakeholders on requirements. Ensure solutions are scalable, secure, and maintainable.",
        status: "open",
        numberOfOpenPositions: 1,
      },
    ];
  }
}

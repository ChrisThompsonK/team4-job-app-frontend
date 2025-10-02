import type { JobRole } from "../models/job-role.js";
import type { JobRoleService } from "./interfaces.js";

export class InMemoryJobRoleService implements JobRoleService {
  private jobRoles: JobRole[];

  constructor() {
    this.jobRoles = this.createSampleJobRoles();
  }

  getJobRoles(): JobRole[] {
    return this.jobRoles;
  }

  getJobRoleById(id: number): JobRole | undefined {
    return this.jobRoles.find((job) => job.id === id);
  }

  private createSampleJobRoles(): JobRole[] {
    return [
      {
        id: 1,
        name: "Software Engineer",
        location: "London",
        capability: "Engineering",
        band: "Consultant",
        closingDate: new Date("2024-11-15"),
        summary:
          "Join our dynamic engineering team to build cutting-edge software solutions that drive digital transformation for our clients across various industries.",
        keyResponsibilities: "Design and develop scalable software applications using modern technologies. Collaborate with cross-functional teams to deliver high-quality solutions. Participate in code reviews and maintain coding standards. Troubleshoot and debug applications to ensure optimal performance. Contribute to technical documentation and knowledge sharing.",
      },
      {
        id: 2,
        name: "Senior Software Engineer",
        location: "Belfast",
        capability: "Engineering",
        band: "Senior Consultant",
        closingDate: new Date("2024-11-30"),
        summary:
          "Lead technical initiatives and mentor junior developers while delivering complex software solutions for enterprise clients.",
        keyResponsibilities: "Lead the design and architecture of complex software systems. Mentor junior developers and provide technical guidance. Drive technical decision-making and best practices. Collaborate with stakeholders to define technical requirements. Ensure code quality through reviews and automated testing.",
      },
      {
        id: 3,
        name: "Principal Software Engineer",
        location: "Birmingham",
        capability: "Engineering",
        band: "Principal",
        closingDate: new Date("2024-12-10"),
        summary:
          "Shape the technical direction of major projects and drive innovation across our engineering organization.",
        keyResponsibilities: "Define technical strategy and architecture for large-scale projects. Lead cross-functional teams and technical initiatives. Drive innovation and adoption of new technologies. Provide technical leadership and guidance to engineering teams. Collaborate with product and business stakeholders.",
      },
      {
        id: 4,
        name: "Data Scientist",
        location: "Manchester",
        capability: "Data & Analytics",
        band: "Consultant",
        closingDate: new Date("2024-11-20"),
        summary:
          "Extract valuable insights from complex datasets to drive data-driven decision making for our clients.",
        keyResponsibilities: "Analyze large datasets to identify patterns and trends. Develop predictive models and machine learning algorithms. Create data visualizations and reports for stakeholders. Collaborate with business teams to define analytics requirements. Implement data science solutions in production environments.",
      },
      {
        id: 5,
        name: "Senior Data Scientist",
        location: "Edinburgh",
        capability: "Data & Analytics",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-05"),
        summary:
          "Lead advanced analytics projects and drive the development of sophisticated data science solutions.",
        keyResponsibilities: "Lead complex data science projects from conception to delivery. Develop advanced machine learning models and algorithms. Mentor junior data scientists and analysts. Present findings and recommendations to senior stakeholders. Drive best practices in data science methodology.",
      },
      {
        id: 6,
        name: "DevOps Engineer",
        location: "Leeds",
        capability: "Platforms",
        band: "Consultant",
        closingDate: new Date("2024-11-25"),
        summary:
          "Build and maintain robust CI/CD pipelines and cloud infrastructure to support our development teams.",
        keyResponsibilities: "Design and implement CI/CD pipelines for automated deployment. Manage cloud infrastructure using Infrastructure as Code. Monitor system performance and implement optimization strategies. Collaborate with development teams to improve deployment processes. Ensure security and compliance across all environments.",
      },
      {
        id: 7,
        name: "Senior DevOps Engineer",
        location: "Glasgow",
        capability: "Platforms",
        band: "Senior Consultant",
        closingDate: new Date("2024-12-01"),
        summary:
          "Lead DevOps initiatives and architect scalable infrastructure solutions for enterprise applications.",
        keyResponsibilities: "Architect and implement scalable cloud infrastructure solutions. Lead DevOps transformation initiatives for client projects. Design disaster recovery and business continuity strategies. Mentor junior DevOps engineers and platform specialists. Drive automation and optimization across all environments.",
      },
      {
        id: 8,
        name: "Business Analyst",
        location: "Bristol",
        capability: "Business Change",
        band: "Analyst",
        closingDate: new Date("2024-11-18"),
        summary:
          "Bridge the gap between business requirements and technical solutions to drive successful project outcomes.",
        keyResponsibilities: "Gather and analyze business requirements from stakeholders. Create detailed functional specifications and user stories. Facilitate workshops and stakeholder meetings. Support testing activities and user acceptance testing. Document business processes and recommend improvements.",
      },
      {
        id: 9,
        name: "Senior Business Analyst",
        location: "Newcastle",
        capability: "Business Change",
        band: "Senior Analyst",
        closingDate: new Date("2024-12-03"),
        summary:
          "Lead business analysis activities for complex transformation projects and drive organizational change.",
        keyResponsibilities: "Lead business analysis for large-scale transformation projects. Develop business cases and feasibility studies. Manage stakeholder relationships and communications. Design and implement change management strategies. Mentor junior business analysts and team members.",
      },
      {
        id: 10,
        name: "UX Designer",
        location: "Cardiff",
        capability: "Experience Design",
        band: "Consultant",
        closingDate: new Date("2024-11-22"),
        summary:
          "Create intuitive and engaging user experiences that delight customers and drive business success.",
        keyResponsibilities: "Design user-centered digital experiences and interfaces. Conduct user research and usability testing. Create wireframes, prototypes, and design specifications. Collaborate with developers to ensure design implementation. Advocate for accessibility and inclusive design principles.",
      },
    ];
  }
}

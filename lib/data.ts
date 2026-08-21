import type { Concept, Developer, Feature, Project, Technology } from "./types";

// Mock dataset
 

export const developers: Developer[] = [
  { id: "d1", name: "Tara", githubUsername: "tara-dev" },
  { id: "d2", name: "Kim", githubUsername: "kimcodes" },
  { id: "d3", name: "Alex", githubUsername: "alexbuilds" },
  { id: "d4", name: "Priya", githubUsername: "priyaux" },
  { id: "d5", name: "Jordan", githubUsername: "jordan-fs" },
  { id: "d6", name: "Mina", githubUsername: "mina-ml" },
  { id: "d7", name: "Sam", githubUsername: "sam-writes-go" },
  { id: "d8", name: "Devon", githubUsername: "devon.codes" },
  { id: "d9", name: "Riley", githubUsername: "rileyfront" },
  { id: "d10", name: "Chen", githubUsername: "chen-be" },
  { id: "d11", name: "Noor", githubUsername: "noorstack" },
  { id: "d12", name: "Owen", githubUsername: "owendev" },
];

export const technologies: Technology[] = [
  { id: "t1", name: "React", category: "Frontend" },
  { id: "t2", name: "Next.js", category: "Frontend" },
  { id: "t3", name: "Node.js", category: "Runtime" },
  { id: "t4", name: "Express", category: "Backend" },
  { id: "t5", name: "MongoDB", category: "Database" },
  { id: "t6", name: "PostgreSQL", category: "Database" },
  { id: "t7", name: "Redis", category: "Database" },
  { id: "t8", name: "Socket.io", category: "Realtime" },
  { id: "t9", name: "FFmpeg", category: "Media" },
  { id: "t10", name: "Docker", category: "Infra" },
  { id: "t11", name: "AWS Rekognition", category: "AI/ML" },
  { id: "t12", name: "OpenAI Whisper", category: "AI/ML" },
  { id: "t13", name: "GraphQL", category: "API" },
  { id: "t14", name: "Tailwind CSS", category: "Frontend" },
  { id: "t15", name: "Stripe", category: "Payments" },
  { id: "t16", name: "Prisma", category: "Database" },
];

export const concepts: Concept[] = [
  { id: "c1", name: "Video Processing" },
  { id: "c2", name: "Machine Learning" },
  { id: "c3", name: "REST APIs" },
  { id: "c4", name: "Authentication" },
  { id: "c5", name: "Real-time Communication" },
  { id: "c6", name: "Caching" },
  { id: "c7", name: "Search" },
  { id: "c8", name: "File Uploads" },
  { id: "c9", name: "Payments" },
  { id: "c10", name: "Notifications" },
];

export const features: Feature[] = [
  { id: "f1", name: "Video Upload" },
  { id: "f2", name: "Authentication" },
  { id: "f3", name: "Search" },
  { id: "f4", name: "Real-time Chat" },
  { id: "f5", name: "Notifications" },
  { id: "f6", name: "Payment" },
  { id: "f7", name: "Analytics" },
  { id: "f8", name: "Frame Extraction" },
  { id: "f9", name: "Celebrity Recognition" },
  { id: "f10", name: "Movie Search" },
  { id: "f11", name: "Audio Transcription" },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "ClipFind",
    tagline: "Movie identification and video analysis platform",
    githubUrl: "https://github.com/example/clipfind",
    techIds: ["t3", "t5", "t9", "t11", "t12"],
    conceptIds: ["c1", "c2", "c3"],
    featureIds: ["f1", "f8", "f9", "f10", "f11"],
    contributors: [
      { devId: "d1", role: "Backend Lead" },
      { devId: "d2", role: "Full-stack Developer" },
    ],
  },
  {
    id: "p2",
    name: "Nexus Chat",
    tagline: "Real-time messaging for distributed teams",
    githubUrl: "https://github.com/example/nexus-chat",
    techIds: ["t1", "t3", "t5", "t8", "t7"],
    conceptIds: ["c5", "c4"],
    featureIds: ["f4", "f5", "f2"],
    contributors: [
      { devId: "d1", role: "Backend Developer" },
      { devId: "d3", role: "Frontend Lead" },
    ],
  },
  {
    id: "p3",
    name: "TrackrAid",
    tagline: "Issue tracking built for small engineering teams",
    githubUrl: "https://github.com/example/trackraid",
    techIds: ["t1", "t3", "t4", "t5", "t7"],
    conceptIds: ["c4", "c6"],
    featureIds: ["f2", "f3", "f5"],
    contributors: [
      { devId: "d1", role: "Full-stack Developer" },
      { devId: "d4", role: "Frontend Developer" },
    ],
  },
  {
    id: "p4",
    name: "Video Search",
    tagline: "Semantic search across large video libraries",
    githubUrl: "https://github.com/example/video-search",
    techIds: ["t1", "t3", "t5", "t9"],
    conceptIds: ["c1", "c7"],
    featureIds: ["f3", "f1"],
    contributors: [
      { devId: "d5", role: "Full-stack Developer" },
      { devId: "d12", role: "Backend Developer" },
    ],
  },
  {
    id: "p5",
    name: "Media Analyzer",
    tagline: "Automated tagging and analysis for media libraries",
    githubUrl: "https://github.com/example/media-analyzer",
    techIds: ["t3", "t5", "t9", "t11"],
    conceptIds: ["c1", "c2"],
    featureIds: ["f8", "f7"],
    contributors: [{ devId: "d6", role: "ML Engineer" }],
  },
  {
    id: "p6",
    name: "ShopEase",
    tagline: "Headless storefront and checkout platform",
    githubUrl: "https://github.com/example/shopease",
    techIds: ["t1", "t2", "t3", "t6", "t7", "t15"],
    conceptIds: ["c9", "c4"],
    featureIds: ["f6", "f2", "f3"],
    contributors: [{ devId: "d7", role: "Backend Lead" }],
  },
  {
    id: "p7",
    name: "CodeCollab",
    tagline: "Collaborative code review with live sessions",
    githubUrl: "https://github.com/example/codecollab",
    techIds: ["t1", "t2", "t3", "t8", "t6"],
    conceptIds: ["c5", "c4"],
    featureIds: ["f4", "f2", "f5"],
    contributors: [{ devId: "d8", role: "Full-stack Developer" }],
  },
  {
    id: "p8",
    name: "LearnHub",
    tagline: "Course delivery platform for technical education",
    githubUrl: "https://github.com/example/learnhub",
    techIds: ["t1", "t2", "t3", "t6", "t10", "t16"],
    conceptIds: ["c4", "c3"],
    featureIds: ["f2", "f3", "f7"],
    contributors: [{ devId: "d9", role: "Frontend Lead" }],
  },
  {
    id: "p9",
    name: "TaskFlow",
    tagline: "Lightweight project and task management",
    githubUrl: "https://github.com/example/taskflow",
    techIds: ["t1", "t3", "t4", "t6", "t7", "t16"],
    conceptIds: ["c5", "c6"],
    featureIds: ["f4", "f5", "f7"],
    contributors: [{ devId: "d10", role: "Backend Developer" }],
  },
  {
    id: "p10",
    name: "EventHub",
    tagline: "Ticketing and live event coordination",
    githubUrl: "https://github.com/example/eventhub",
    techIds: ["t1", "t2", "t3", "t6", "t8", "t15"],
    conceptIds: ["c5", "c9"],
    featureIds: ["f6", "f5", "f4"],
    contributors: [{ devId: "d11", role: "Full-stack Developer" }],
  },
];

// Accessor functions for the mock dataset. 
// These are used by lib/graph.ts and lib/service.ts to decouple the rest of the app from the underlying data source.

export const findProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);

export const findTechnology = (id: string): Technology | undefined =>
  technologies.find((t) => t.id === id);

export const findConcept = (id: string): Concept | undefined =>
  concepts.find((c) => c.id === id);

export const findFeature = (id: string): Feature | undefined =>
  features.find((f) => f.id === id);

export const findDeveloper = (id: string): Developer | undefined =>
  developers.find((d) => d.id === id);

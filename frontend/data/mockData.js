export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform Redesign",
    employer: "TechVentures Inc.",
    status: "active",
    budget: 12000,
    description:
      "Complete redesign of an existing e-commerce platform with modern UI/UX, improved checkout flow, and mobile-first approach. Includes product catalog, cart, and payment integration pages.",
    milestones: [
      { id: 101, title: "Wireframes & Design System", status: "completed", dueDate: "2026-02-15" },
      { id: 102, title: "Frontend Implementation", status: "submitted", dueDate: "2026-03-01" },
      { id: 103, title: "Backend Integration", status: "pending", dueDate: "2026-03-20" },
      { id: 104, title: "Testing & QA", status: "pending", dueDate: "2026-04-05" },
    ],
  },
  {
    id: 2,
    title: "Mobile Banking App UI",
    employer: "FinServe Global",
    status: "active",
    budget: 8500,
    description:
      "Design and develop the frontend for a mobile banking application. Features include account dashboard, transfers, bill payments, and transaction history with data visualizations.",
    milestones: [
      { id: 201, title: "UI/UX Research & Prototyping", status: "completed", dueDate: "2026-01-20" },
      { id: 202, title: "Core Screens Development", status: "pending", dueDate: "2026-02-28" },
      { id: 203, title: "Animation & Micro-interactions", status: "pending", dueDate: "2026-03-15" },
    ],
  },
  {
    id: 3,
    title: "SaaS Analytics Dashboard",
    employer: "DataPulse Labs",
    status: "completed",
    budget: 15000,
    description:
      "Build a comprehensive analytics dashboard for a SaaS product. Includes real-time charts, KPI cards, user engagement metrics, and exportable reports.",
    milestones: [
      { id: 301, title: "Dashboard Layout & Components", status: "completed", dueDate: "2026-01-10" },
      { id: 302, title: "Chart Integrations", status: "completed", dueDate: "2026-01-25" },
      { id: 303, title: "Data Export & Reporting", status: "completed", dueDate: "2026-02-10" },
    ],
  },
  {
    id: 4,
    title: "AI Content Writer Landing Page",
    employer: "WordCraft AI",
    status: "active",
    budget: 4500,
    description:
      "Create a stunning, conversion-optimized landing page for an AI-powered content writing tool. Includes hero section, feature highlights, pricing table, testimonials, and CTA.",
    milestones: [
      { id: 401, title: "Landing Page Design", status: "submitted", dueDate: "2026-03-05" },
      { id: 402, title: "Responsive Development", status: "pending", dueDate: "2026-03-18" },
    ],
  },
  {
    id: 5,
    title: "Healthcare Patient Portal",
    employer: "MedConnect Solutions",
    status: "pending",
    budget: 20000,
    description:
      "Develop a secure patient portal for healthcare providers. Features include appointment scheduling, medical records viewer, prescription management, and telehealth integration.",
    milestones: [
      { id: 501, title: "Requirements & Architecture", status: "pending", dueDate: "2026-04-01" },
      { id: 502, title: "Patient Dashboard", status: "pending", dueDate: "2026-04-20" },
      { id: 503, title: "Appointment System", status: "pending", dueDate: "2026-05-10" },
      { id: 504, title: "Records & Prescriptions", status: "pending", dueDate: "2026-05-30" },
    ],
  },
  {
    id: 6,
    title: "Real Estate Listing Platform",
    employer: "PropertyHub Co.",
    status: "completed",
    budget: 11000,
    description:
      "Build a modern real estate listing platform with property search, map integration, virtual tour embeds, and agent contact forms.",
    milestones: [
      { id: 601, title: "Search & Filter UI", status: "completed", dueDate: "2025-12-15" },
      { id: 602, title: "Property Detail Pages", status: "completed", dueDate: "2026-01-05" },
      { id: 603, title: "Map Integration", status: "completed", dueDate: "2026-01-20" },
    ],
  },
];

export const submissions = [
  { id: 1, milestoneId: 102, title: "Frontend Implementation — v1 Delivery", date: "2026-02-28", status: "under review", description: "Completed all product pages, cart flow, and responsive layouts." },
  { id: 2, milestoneId: 401, title: "Landing Page Design — Final Mockups", date: "2026-03-04", status: "under review", description: "High-fidelity mockups for desktop and mobile views." },
  { id: 3, milestoneId: 301, title: "Dashboard Layout Delivery", date: "2026-01-09", status: "approved", description: "Component library and dashboard layout completed." },
  { id: 4, milestoneId: 601, title: "Search UI — Complete", date: "2025-12-14", status: "approved", description: "Search with filters, sort, and pagination delivered." },
];

export const userProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "Freelancer",
  avatar: null,
  bio: "Full-stack developer with 6+ years of experience specializing in React, Next.js, and Node.js. Passionate about building clean, performant, and accessible web applications.",
  skills: ["React", "Next.js", "Node.js", "Tailwind CSS", "TypeScript", "PostgreSQL", "GraphQL", "Figma"],
  reputationScore: 92,
  completedProjects: 14,
  activeProjects: 3,
  totalEarnings: 87500,
  memberSince: "2024-06-15",
};

export const recentActivity = [
  { id: 1, type: "submission", message: 'Submitted "Frontend Implementation — v1 Delivery"', time: "2 hours ago", icon: "📤" },
  { id: 2, type: "milestone", message: 'Milestone "Wireframes & Design System" marked as completed', time: "1 day ago", icon: "✅" },
  { id: 3, type: "project", message: 'New project "Healthcare Patient Portal" available', time: "2 days ago", icon: "🆕" },
  { id: 4, type: "payment", message: "Payment of $3,500 received for SaaS Analytics Dashboard", time: "3 days ago", icon: "💰" },
  { id: 5, type: "review", message: 'Your submission for "Landing Page Design" is under review', time: "5 days ago", icon: "🔍" },
];

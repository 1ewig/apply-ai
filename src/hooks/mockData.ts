import { Resume, JobApplication } from "./types";

export const initialResumes: Resume[] = [
  {
    id: 'resume-1',
    name: 'Senior Frontend Developer Resume (React/TS)',
    content: `John Doe - Senior Software Engineer
john.doe@email.com | +1 (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Highly skilled Frontend Developer with 6+ years of experience specializing in React, TypeScript, and high-performance web applications. Proven track record of improving web performance by 40% and leading frontend architecture migrations.

TECHNICAL SKILLS
- Frontend: React 18/19, TypeScript, JavaScript (ES6+), Next.js, Redux Toolkit, Zustand, HTML5, CSS3, Tailwind CSS
- Tooling & Build Systems: Vite, Bun, Webpack, ESLint, Prettier, Git
- Testing: Jest, React Testing Library, Cypress
- Backend (Basic): Node.js, Express, REST APIs

EXPERIENCE
Senior Frontend Engineer | Techcorp Solutions | 2022 - Present
- Led a team of 4 developers to rewrite the legacy dashboard in React 18, Vite, and TypeScript, improving build times by 70% and page load speed by 45%.
- Established modern frontend state management patterns using Zustand, simplifying app data flow and reducing boilerplate by 50%.
- Implemented robust unit and integration tests using Jest and Cypress, raising code coverage from 30% to 85%.

Software Engineer | AppForge Technologies | 2020 - 2022
- Developed and maintained responsive SaaS web applications using React and Tailwind CSS, increasing mobile user engagement by 25%.
- Collaborated with UX designers to build a reusable design system of 30+ accessible components matching WCAG AA standards.
- Optimized REST API integrations and implemented efficient caching strategies, reducing network requests by 30%.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2016 - 2020`,
    isDefault: true,
    updatedAt: new Date().toLocaleDateString(),
  },
];

export const initialJobs: JobApplication[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Senior Frontend Engineer',
    status: 'interviewing',
    dateApplied: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toLocaleDateString(),
    url: 'https://stripe.com/jobs',
    jobDescription: `We are looking for a Senior Frontend Engineer to join our dashboard platform team.
Requirements:
- Strong experience with React, TypeScript, and modern state management.
- Experience building high-performance web applications.
- Experience with Vite, Webpack, or similar bundlers.
- Passion for visual polish and excellent user experiences.`,
    matchScore: 88,
    analysisResult: {
      score: 88,
      fitLevel: 'Strong Match',
      summary: "The candidate represents a strong fit for this role, demonstrating extensive experience with React, TypeScript, and Vite. Their background in performance optimization and dashboard migrations aligns well with Stripe's needs. The main gap is a lack of explicit billing/payments experience, which can be easily onboarded.",
      matchedKeywords: ['React', 'TypeScript', 'Vite', 'Frontend Architecture', 'State Management', 'Zustand', 'Performance Optimization'],
      missingKeywords: ['Dashboard Platform', 'API Design', 'Design Systems', 'CI/CD Pipelines'],
      strengths: [
        "6+ years of specialized frontend experience with React and TypeScript.",
        "Proven dashboard rewrite experience matching Stripe's platform goals.",
        "Strong track record of performance optimization (improving load speeds by 45%)."
      ],
      gaps: [
        "No direct payment or billing platform experience.",
        "Limited mention of collaborative API design with backend teams."
      ],
      suggestions: [
        {
          section: 'Experience',
          original: 'Led a team of 4 developers to rewrite the legacy dashboard in React 18, Vite, and TypeScript...',
          suggested: "Led dashboard platform engineering rewriting the legacy app in React 18, Vite, and TypeScript to support high-scale API consumer dashboards, improving load speed by 45%.",
          rationale: "Adding context about 'dashboard platform' and 'API consumer dashboards' aligns better with Stripe's platform goals."
        }
      ],
      interviewPrep: [
        {
          question: 'Can you describe your experience managing complex application state in a collaborative React dashboard?',
          strategy: 'Highlight your usage of Zustand to simplify dashboard state. Discuss separating global UI state, domain state, and backend cache, ensuring clean boundaries.'
        }
      ]
    }
  },
  {
    id: 'job-2',
    company: 'Figma',
    role: 'Product Designer / Engineer',
    status: 'wishlist',
    dateApplied: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toLocaleDateString(),
    url: 'https://figma.com/careers',
    jobDescription: `Join Figma to help build the future of collaborative design tools.
Requirements:
- Deep familiarity with frontend tech (React, TypeScript, Canvas or WebGL).
- Obsession with details and user experience.
- Experience building design systems and reusable components.`,
  },
  {
    id: 'job-3',
    company: 'Vercel',
    role: 'Frontend Infrastructure Engineer',
    status: 'applied',
    dateApplied: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleDateString(),
    url: 'https://vercel.com/careers',
    jobDescription: `Help us build Vercel's developer platform.
Requirements:
- Expert level React & TypeScript.
- Deep knowledge of Vite, Webpack, Bun, Next.js, and build tools.
- Passion for performance and web standards.`,
    matchScore: 92,
    analysisResult: {
      score: 92,
      fitLevel: 'Excellent Match',
      summary: "Outstanding match. The candidate's specific experience with Vite, Bun, and optimizing build pipelines (70% build time reduction) is exactly what Vercel's developer experience/infrastructure teams value. Minor gaps in monorepos or turbopack, which are negligible.",
      matchedKeywords: ['React', 'TypeScript', 'Vite', 'Bun', 'Next.js', 'Build Systems', 'Web Performance'],
      missingKeywords: ['Monorepos', 'Turbopack', 'Rust-based tooling'],
      strengths: [
        "Demonstrated expertise in Vite and Bun build ecosystems.",
        "Extensive React & TypeScript skills.",
        "Significant build performance gains (70% reduction in build time)."
      ],
      gaps: [
        "No mentioned experience with monorepos (Turborepo/Lerna).",
        "No exposure to Rust-based compiler tooling."
      ],
      suggestions: [
        {
          section: 'Experience',
          original: 'Led a team of 4 developers to rewrite the legacy dashboard in React 18, Vite, and TypeScript...',
          suggested: "Managed frontend infrastructure migrating complex apps to Vite & Bun, boosting local dev compilation by 70% and scaling next-gen bundle architectures.",
          rationale: "Framing it as 'frontend infrastructure' and 'scaling bundle architectures' directly matches Vercel's compiler and platform focus."
        }
      ],
      interviewPrep: [
        {
          question: 'Why did you choose Bun/Vite over Webpack, and how do you handle scale in a compilation pipeline?',
          strategy: 'Discuss esbuild and native compilation. Detail how Vite uses native ESM during dev and Rollup for production builds, contrasting it with Webpack\'s bundling overhead.'
        }
      ]
    }
  }
];

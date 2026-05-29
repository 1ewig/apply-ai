# Project Runtime Specification

- **Primary Runtime & Package Manager**: [Bun](https://bun.sh)
- **Lockfile**: `bun.lock`
- **Commands**:
  - Install dependencies: `bun install`
  - Start Next.js Development Server: `bun run dev`
  - Start Convex Backend Server: `bunx convex dev`
  - Production Build: `bun run build`

*Note for future agents and developers: Always prefer Bun's toolchain over npm/npx/yarn for dependency resolution, script execution, and tooling.*

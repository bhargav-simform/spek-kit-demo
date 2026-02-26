# Spek-Kit Demo Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)
**Strict TypeScript with zero compromises:**
- TypeScript strict mode enabled at all times (`strict: true` in tsconfig)
- No `any` types permitted - use `unknown` with proper type guards when needed
- All function parameters, return types, and variables must be explicitly typed
- No type assertions (`as`) without thorough justification and code review
- All props interfaces must be properly defined with required/optional flags
- Use discriminated unions for complex state management
- Enable all strict TypeScript compiler options: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`

### II. Code Quality & Standards
**Consistency through automated enforcement:**
- ESLint rules are law - zero warnings or errors permitted in production code
- Prettier formatting is mandatory - configure pre-commit hooks to enforce
- All code must pass linting before commit
- Follow React best practices: hooks rules, component composition, proper dependency arrays
- Use functional components exclusively - no class components
- Implement proper error boundaries for all major feature sections
- Dead code and unused imports must be removed
- Comments required for complex business logic only - code should be self-documenting

### III. Testing Standards (NON-NEGOTIABLE)
**Test coverage ensures reliability:**
- Minimum 80% code coverage for all production code
- Unit tests required for:
  - All custom hooks
  - All utility functions
  - All business logic
- Component tests required for:
  - User interaction flows
  - Conditional rendering logic
  - State management
- Integration tests required for:
  - API integrations
  - Cross-component workflows
  - Critical user journeys
- Tests must be written before or alongside implementation (TDD encouraged)
- All tests must pass before merge to main branch
- Use React Testing Library for component tests - avoid implementation details
- Mock external dependencies appropriately

### IV. User Experience Consistency
**Seamless, responsive, and accessible design:**
- Tailwind CSS is the sole styling solution - no inline styles or CSS modules
- Responsive design mandatory: mobile-first approach (sm, md, lg, xl, 2xl breakpoints)
- All components must work seamlessly across:
  - Mobile (320px - 640px)
  - Tablet (641px - 1024px)
  - Desktop (1025px+)
- Consistent spacing using Tailwind spacing scale (4px increments)
- Consistent color palette defined in `tailwind.config` - no arbitrary color values
- Accessibility requirements:
  - WCAG 2.1 AA compliance minimum
  - Proper semantic HTML
  - ARIA labels where needed
  - Keyboard navigation support
  - Screen reader compatibility
- Loading states and error states for all async operations
- Smooth transitions and animations (prefer Tailwind transitions)

### V. Performance Requirements
**Fast, efficient, and optimized:**
- Bundle size monitoring:
  - Initial bundle < 200KB (gzipped)
  - Route-based code splitting for pages > 50KB
- React optimization patterns:
  - Proper use of `useMemo`, `useCallback` for expensive operations
  - Lazy loading for routes and heavy components
  - Virtualization for long lists (>100 items)
- Image optimization:
  - WebP format preferred
  - Responsive images with proper srcset
  - Lazy loading for below-the-fold images
- Web Vitals targets:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- No unnecessary re-renders - use React DevTools Profiler to verify

## Technology Stack Requirements

### Mandatory Technologies
- **React**: Latest stable version (18.x+) with React 18 features (concurrent rendering, transitions)
- **TypeScript**: Latest stable version (5.x+) with strict mode
- **Vite**: For build tooling and dev server
- **Tailwind CSS**: For all styling needs (v3.x+)
- **ESLint**: With React, TypeScript, and accessibility plugins
- **Prettier**: For code formatting

### Package Compatibility
- All dependencies must be compatible with React 18+
- Use npm/yarn/pnpm workspaces for monorepo structure if needed
- Regularly update dependencies (monthly security checks minimum)
- Peer dependencies must be satisfied
- No deprecated packages in production dependencies

### Forbidden Practices
- No mixing CSS frameworks (no Bootstrap, Material-UI, etc. with Tailwind)
- No direct DOM manipulation (use React refs sparingly)
- No jQuery or similar libraries
- No runtime type checking libraries (use TypeScript)
- No PropTypes (TypeScript provides type safety)

## Development Workflow

### Code Review Requirements
- All changes require pull request review
- At least one approval required before merge
- Automated checks must pass:
  - ESLint (zero errors/warnings)
  - Prettier (properly formatted)
  - TypeScript compilation (zero errors)
  - All tests passing
  - Build succeeds
- Performance impact assessment for UI changes

### Git Workflow
- Feature branches from `main`
- Conventional commit messages: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Squash and merge to keep clean history
- Protected main branch

### Quality Gates
1. **Pre-commit**: Lint-staged runs Prettier and ESLint on staged files
2. **Pre-push**: All tests must pass
3. **CI/CD**: Full test suite, build verification, bundle size check
4. **Pre-merge**: Code review approval + all CI checks passing

## Governance

**This constitution is the supreme authority for all development decisions.**

- All code must comply with these principles - no exceptions without formal amendment
- Performance requirements are measured and enforced in CI/CD pipeline
- Accessibility compliance is verified through automated and manual testing
- Breaking this constitution requires:
  1. Written justification
  2. Team discussion and consensus
  3. Documentation of temporary exception
  4. Plan to resolve exception
- Constitution amendments require:
  1. Proposal with rationale
  2. Team review and discussion
  3. Unanimous approval
  4. Version increment
  5. Update of all related documentation

**Version**: 1.0.0 | **Ratified**: 2026-02-25 | **Last Amended**: 2026-02-25

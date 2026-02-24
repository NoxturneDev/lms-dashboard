# LMS Dashboard - Project Context

## Project Overview

**Stack**: React 19 + Vite + TypeScript + Tailwind CSS v4 + Zustand
**Package Manager**: bun
**Backend**: Go microservices (gateway pattern with gRPC)
**Backend URL**: http://localhost:3000/api/v1
**Backend Repo**: ../lms-monorepo

## Project Structure

```
src/
├── api/          # API client configuration
├── components/   # Reusable React components
├── pages/        # Page components
├── router/       # React Router configuration
└── stores/       # Zustand state management stores
```

## Backend Integration

- **Gateway Pattern**: HTTP gateway at localhost:3000 proxies to internal gRPC microservices
- **API Routes**: All routes prefixed with `/api/v1`
- **API Documentation**: ../lms-monorepo/API_DOCS.md
- **Gateway Routes**: ../lms-monorepo/gateway/main.go

## State Management (Zustand Stores)

### Implemented Stores (src/stores/)

1. **useAuthStore** - Authentication
   - Teacher login/logout
   - Student login/logout
   - Admin login NOT yet implemented

2. **useCourseStore** - Course Management
   - Full CRUD operations (create, read, update, delete)
   - Fetch all courses, fetch by ID

3. **useGradeStore** - Grade Management
   - assignGrade: Assign/update grades
   - fetchGradebook: Get all grades for a course

4. **useStudentStore** - Student Management
   - Full CRUD operations
   - fetchStudentReportCard: Get student grades
   - fetchStudentCourses: Get courses for a student

5. **useTeacherStore** - Teacher Management (Recently Added)
   - Full CRUD operations
   - Fetch all teachers, fetch by ID

6. **useEnrollmentStore** - Enrollment Management (Recently Added)
   - enrollStudent: Enroll student in a course
   - fetchCourseEnrollments: Get all enrolled students for a course

## Pages Implemented (src/pages/)

### Auth
- **Login** (src/pages/auth/Login.tsx) - Teacher/Student login
- **Register** (src/pages/auth/Register.tsx) - Registration flow

### Dashboard
- **Dashboard** (src/pages/dashboard/Dashboard.tsx) - Router/layout
- **TeacherDashboard** (src/pages/dashboard/TeacherDashboard.tsx) - Teacher view
- **StudentDashboard** (src/pages/dashboard/StudentDashboard.tsx) - Student view

### Courses
- **CourseList** (src/pages/courses/CourseList.tsx) - Browse all courses
- **CourseDetails** (src/pages/courses/CourseDetails.tsx) - Course details with inline student enrollment

### Grades
- **Gradebook** (src/pages/grades/Gradebook.tsx) - Manage grades
  - Shows all enrolled students (including ungraded)
  - Supports first-time grade assignment
  - Uses GET /courses/:id/enrollments endpoint

### Students
- **StudentReport** (src/pages/students/StudentReport.tsx) - Student report card

## Not Yet Implemented

### Admin Domain (Deferred)
- Admin login/authentication
- Admin CRUD pages
- School management (CRUD)
- Class management (CRUD)

**Note**: Backend endpoints for admin functionality exist in ../lms-monorepo but no frontend implementation yet.

## Recent Configuration Fixes

### Project Setup Cleanup
- Removed Next.js dependencies (were incorrectly included)
- Fixed Tailwind CSS v4 PostCSS configuration (postcss.config.js)
- Added Vite path alias (@/ maps to ./src)
- Removed React Server Component 'use client' directives
- Updated TypeScript configuration for Vite

### Key Configuration Files
- **postcss.config.js**: Tailwind v4 PostCSS plugin setup
- **vite.config.ts**: Path aliases, React plugin
- **tsconfig.json**: Path mappings for @/ imports

## Recent Session Work

### Teacher Store (useTeacherStore)
- Created full CRUD operations for teacher management
- Endpoints: GET/POST /teachers, GET/PUT/DELETE /teachers/:id

### Enrollment Store (useEnrollmentStore)
- Created enrollment management store
- enrollStudent: POST /enrollments
- fetchCourseEnrollments: GET /courses/:id/enrollments

### Gradebook Enhancement
- Updated Gradebook page to show all enrolled students
- Supports assigning grades to previously ungraded students
- Uses course enrollments endpoint to get complete student list
- Handles both existing grades and new grade assignments

## Development Commands

```bash
bun install          # Install dependencies
bun dev             # Start dev server
bun build           # Build for production
bun preview         # Preview production build
```

## Key Dependencies

- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API calls
- **Zustand**: Lightweight state management
- **React Hook Form + Zod**: Form handling and validation
- **Radix UI**: Headless UI components
- **Lucide React**: Icon library
- **Recharts**: Data visualization
- **Tailwind CSS v4**: Utility-first CSS (beta version)

## Next Steps / Potential Work

- Implement admin domain (login, pages, routes)
- Add school management UI
- Add class management UI
- Expand error handling and loading states
- Add more comprehensive validation
- Consider adding enrollment removal functionality

# AI Coach - Structured Coaching Framework

A modern web application built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase for managing AI-powered coaching projects through an 8-layer structured framework.

## Features

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes with session management
- Login, sign-up, and sign-up confirmation pages
- Automatic redirect to dashboard for authenticated users

### Dashboard
- View all user projects in a clean card-based layout
- Create new projects with a modal dialog
- Display project progress (current layer / total layers)
- Quick access to workspaces
- User profile display with sign-out functionality

### Workspace
- **Sidebar Navigation**: Shows 8 coaching layers with status indicators
  - Pending (gray clock icon)
  - Generated (yellow lightning icon)
  - Approved (green checkmark icon)
- **Main Panel**: 
  - Layer title and description
  - User input textarea for capturing thoughts/responses
  - AI output display area
  - Action buttons: Generate, Approve, Edit, Next
  - Character count for user input

### Layer Management
- 8 pre-configured coaching layers (automatically created for each project)
- Layer descriptions tailored to each stage of the coaching process
- Track layer status: pending → generated → approved
- Store user input and AI-generated output per layer
- Save approval timestamps

### Project Management
- Create projects with title only
- Automatic initialization with 8 layers
- Track current layer progress
- Display creation date and status

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Next.js 16 (App Router)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Server Actions**: Next.js Server Actions for data mutations
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Directory Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx              # Root layout with metadata
├── actions.ts              # Server actions for data operations
├── auth/
│   ├── login/page.tsx      # Login page
│   ├── sign-up/page.tsx    # Sign-up page
│   ├── sign-up-success/    # Confirmation page
│   ├── error/page.tsx      # Auth error page
│   └── callback/route.ts   # Auth callback handler
├── dashboard/
│   ├── layout.tsx          # Dashboard layout with header
│   └── page.tsx            # Projects listing
└── workspace/
    └── [projectId]/
        └── page.tsx        # Workspace page
components/
├── ui/                     # shadcn/ui components
├── dashboard/
│   └── create-project-dialog.tsx
└── workspace/
    ├── workspace-client.tsx
    ├── sidebar.tsx
    ├── content.tsx
    ├── layer-actions.tsx
    └── layer-descriptions.ts
lib/
├── supabase/
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client
│   └── proxy.ts           # Session proxy
└── utils.ts               # Utility functions
middleware.ts             # Session refresh middleware
```

## Database Schema

### Projects Table
- `id` (uuid): Primary key
- `user_id` (uuid): Owner of the project
- `title` (text): Project title
- `status` (text): Project status
- `current_layer` (integer): Current layer progress
- `problem_statement` (text): Optional problem description
- `created_at` (timestamp): Creation date
- `updated_at` (timestamp): Last update

### Project Layers Table
- `id` (uuid): Primary key
- `project_id` (uuid): Foreign key to projects
- `layer_number` (integer): Layer sequence (1-8)
- `layer_key` (text): Unique layer identifier
- `title` (text): Layer title
- `status` (text): Pending, Generated, or Approved
- `user_input` (jsonb): User's input for this layer
- `ai_output` (jsonb): AI-generated output
- `approved_at` (timestamp): Approval timestamp
- `created_at` (timestamp): Creation date
- `updated_at` (timestamp): Last update

### Profiles Table
- `id` (uuid): Foreign key to auth.users
- `full_name` (text): User's full name
- `avatar_url` (text): Profile image URL
- `created_at` (timestamp): Creation date
- `updated_at` (timestamp): Last update

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only:
- View their own projects and layers
- Create new projects and layers
- Update their own projects and layers
- Delete their own projects and layers

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local with the Supabase credentials

# Run development server
pnpm dev
```

### Database Setup

The application uses Supabase with PostgreSQL. Tables and RLS policies are automatically configured through the Supabase integration.

## Features Ready for Integration

### Generate Button
The Generate button is fully wired up and ready for API integration. Currently it:
- Validates that user input is provided
- Updates the layer status to "generated"
- Awaits API response (placeholder for AI generation)

To integrate AI generation:
1. Call your AI API in the `handleGenerate` function in `components/workspace/layer-actions.tsx`
2. Pass the layer context and user input
3. Update the `ai_output` field with the generated content

### Approve Button
The Approve button saves the current state as approved and sets an approval timestamp.

### Next Button
The Next button advances to the following layer (only available when current layer is approved).

## Navigation

- `/` - Landing page with overview and auth links
- `/auth/login` - Login form
- `/auth/sign-up` - Sign-up form
- `/auth/sign-up-success` - Confirmation message
- `/auth/error` - Auth error page
- `/dashboard` - Projects dashboard (protected)
- `/workspace/[projectId]` - Workspace for a specific project (protected)

## Security

- All routes are protected with Supabase authentication
- Session management via middleware
- Row-Level Security (RLS) on all database tables
- Server-side data validation
- Protected API routes through server actions

## Design System

- Clean, minimal interface focused on productivity
- No animations - emphasizes efficiency
- Semantic color tokens via CSS variables
- Responsive design for mobile and desktop
- Clear typography hierarchy
- Accessible form controls and navigation

## Future Enhancements

- AI integration for content generation
- Layer editing and revision history
- Project sharing and collaboration
- Export/download project results
- Advanced filtering and search
- Analytics dashboard
- Mobile app

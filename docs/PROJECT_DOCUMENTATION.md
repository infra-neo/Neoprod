# Neogenesys Zero Trust Platform - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Frontend Development](#frontend-development)
6. [Backend Development](#backend-development)
7. [Infrastructure Setup](#infrastructure-setup)
8. [Security & Authentication](#security--authentication)
9. [Deployment](#deployment)
10. [API Documentation](#api-documentation)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

Neogenesys is an enterprise Zero Trust Remote Access Platform that provides secure access to applications and resources through a unified dashboard. The platform integrates multiple security and networking technologies to create a comprehensive access management solution.

### Key Features

- **Modern Login Interface**: SSO, WebAuthn, MFA support
- **Zero Trust Network**: Access only through Netbird VPN mesh
- **Identity Management**: Zitadel OIDC provider with group-based access
- **Application Proxy**: Pomerium Zero Trust proxy for all applications
- **Device Enrollment**: Automated device onboarding with custom Netbird client
- **TSplus Integration**: Remote desktop access to Windows applications
- **RBAC**: Role-based access control with granular permissions
- **Supabase Backend**: Scalable database and authentication

### Project Goals

1. Provide a unified user portal for all enterprise applications
2. Enforce Zero Trust security at every access point
3. Simplify device enrollment and management
4. Enable secure remote access to legacy applications
5. Maintain complete audit trail of all access

---

## Architecture

### High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├──────────► Frontend (Next.js)
       │            - Login Page
       │            - Dashboard
       │            - Device Enrollment
       │
       ├──────────► Backend API (Node.js/Express)
       │            - Auth API
       │            - Netbird Integration
       │            - Pomerium Integration
       │            - Enrollment API
       │
       └──────────► Netbird Client (Required)
                    │
                    ├──► Netbird Management (VM1)
                    │
                    └──► Pomerium Proxy (VM2)
                         │
                         ├──► Test Applications (Docker)
                         ├──► TSplus Remote Access
                         └──► Admin Tools
```

### Component Architecture

#### Frontend (Next.js + React)
```
frontend/
├── src/
│   ├── app/              # Next.js 14 app router
│   │   ├── page.tsx      # Login page
│   │   ├── layout.tsx    # Root layout
│   │   └── dashboard/    # Dashboard pages
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── enrollment/   # Device enrollment
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utilities
│   ├── services/         # API client services
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
```

#### Backend (Node.js + TypeScript)
```
backend/
├── src/
│   ├── api/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── netbird.routes.ts
│   │   ├── pomerium.routes.ts
│   │   ├── enrollment.routes.ts
│   │   ├── applications.routes.ts
│   │   └── admin.routes.ts
│   ├── services/         # Business logic
│   │   ├── netbird.service.ts
│   │   ├── zitadel.service.ts
│   │   ├── pomerium.service.ts
│   │   └── supabase.service.ts
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   └── config/           # Configuration
```

### Network Architecture

```
Internet
   │
   ├──► gate.kappa4.com (VM1 - Public IP)
   │    ├── Zitadel (OIDC/SSO)
   │    └── Netbird Management
   │
   └──► Netbird Mesh Network (Encrypted WireGuard)
        │
        ├──► VM2 (No Public IP)
        │    ├── Pomerium Proxy
        │    └── Test Applications
        │
        └──► User Devices (Netbird Clients)
             └── Browser → Frontend → Backend → Pomerium → Apps
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **Authentication**: JWT + Zitadel OIDC
- **Database**: Supabase (PostgreSQL)
- **Logging**: Winston
- **API Docs**: OpenAPI/Swagger (TODO)

### Infrastructure
- **Cloud**: Google Cloud Platform
- **IaC**: Terraform
- **VPN**: Netbird (WireGuard)
- **Proxy**: Pomerium
- **Identity**: Zitadel
- **Remote Access**: TSplus
- **Secrets**: Infisical
- **CI/CD**: GitHub Actions

### Security
- **Zero Trust**: Pomerium
- **Network Isolation**: Netbird mesh
- **Identity Provider**: Zitadel
- **MFA**: Zitadel (TOTP, WebAuthn)
- **TLS**: Let's Encrypt / Self-signed

---

## Getting Started

### Prerequisites

1. **Node.js 18+** - For frontend and backend development
2. **Docker & Docker Compose** - For running test applications
3. **Netbird Client** - For accessing internal resources
4. **Git** - Version control
5. **GCP Account** - For infrastructure deployment

### Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/infra-neo/Neoprod.git
cd Neoprod
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.template .env.local
# Edit .env.local with your configuration
npm run dev
```

Frontend will be available at `http://localhost:3000`

#### 3. Setup Backend

```bash
cd backend
npm install
cp .env.template .env
# Edit .env with your configuration
npm run dev
```

Backend API will be available at `http://localhost:3001`

#### 4. Start Test Applications

```bash
cd configs/test-apps
docker-compose up -d
```

Test applications will be available through Pomerium proxy.

---

## Frontend Development

### Project Structure

The frontend is built with Next.js 14 using the App Router pattern.

### Key Pages

#### Login Page (`src/app/page.tsx`)
- Modern, responsive login interface
- Three authentication methods:
  - Password-based (traditional)
  - SSO (Zitadel, Google, Microsoft)
  - WebAuthn (passwordless)
- MFA reminder
- Netbird connection status

#### Dashboard (`src/app/dashboard/page.tsx`)
- User profile
- Available applications (filtered by groups)
- Device management
- Quick actions

### Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ZITADEL_DOMAIN=https://gate.kappa4.com
NEXT_PUBLIC_ZITADEL_CLIENT_ID=your-client-id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Styling

The project uses TailwindCSS with a custom design system:

- **Primary Color**: Blue (#3B82F6)
- **Secondary Color**: Purple (#8B5CF6)
- **Fonts**: Inter
- **Components**: Radix UI primitives

---

## Backend Development

### API Structure

The backend is organized into modular route handlers:

#### Authentication (`/api/v1/auth`)
- `POST /callback` - Handle OAuth callback
- `POST /validate` - Validate JWT token
- `GET /config` - Get auth configuration

#### Netbird (`/api/v1/netbird`)
- `GET /peers` - List all peers
- `POST /setup-keys` - Create enrollment key
- `DELETE /peers/:id` - Remove peer
- `GET /groups` - List groups
- `GET /acls` - Get ACL rules

#### Applications (`/api/v1/applications`)
- `GET /` - List user's applications
- `GET /:id` - Get application details

#### Enrollment (`/api/v1/enrollment`)
- `POST /device` - Enroll new device
- `GET /status/:token` - Check enrollment status

#### Admin (`/api/v1/admin`)
- `GET /users` - List all users (admin only)
- `GET /network/status` - Network statistics
- `POST /groups` - Create group

### Service Layer

Services encapsulate integration with external systems:

- **NetbirdService**: Netbird API integration
- **ZitadelService**: Zitadel OIDC and user management
- **PomeriumService**: Pomerium configuration (TODO)
- **SupabaseService**: Database operations (TODO)

### Middleware

- **authenticate**: Validates JWT tokens
- **authorize**: Checks user roles
- **rateLimiter**: Rate limiting
- **errorHandler**: Centralized error handling

### Development Commands

```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
```

---

## Infrastructure Setup

### Terraform Deployment

The infrastructure is defined in `infra/gcp/`:

```bash
cd infra/gcp
terraform init
terraform plan
terraform apply
```

### Components Deployed

1. **VPC Network** - Private network for all resources
2. **VM1 (Gateway)** - Zitadel + Netbird Management
3. **VM2 (Proxy)** - Pomerium + Applications
4. **Firewall Rules** - Restricted access
5. **Cloud SQL** - PostgreSQL for Zitadel (optional)

### Manual Setup Steps

After Terraform deployment:

1. **Configure Zitadel** (see `docs/setup-guide.md`)
2. **Setup Netbird** (see `docs/pomerium-zitadel-integration.md`)
3. **Deploy Pomerium** (see `configs/pomerium/README.md`)
4. **Configure DNS** - Point domains to VM1

---

## Security & Authentication

### Authentication Flow

1. User accesses login page
2. User selects authentication method
3. Redirect to Zitadel for authentication
4. Zitadel validates credentials + MFA
5. Zitadel returns to backend with auth code
6. Backend exchanges code for tokens
7. Backend creates internal JWT
8. Frontend stores JWT and redirects to dashboard

### Authorization

- **Groups**: Defined in Zitadel
- **Roles**: Admin, User, Developer, etc.
- **ACLs**: Network access rules in Netbird
- **Policies**: Application access in Pomerium

### Network Security

- **Netbird Required**: All internal resources accessible only via Netbird
- **Zero Trust**: No implicit trust, continuous verification
- **Encryption**: WireGuard VPN, TLS for all traffic
- **No Public IPs**: Applications not directly exposed

---

## Deployment

### Production Checklist

- [ ] Configure production environment variables
- [ ] Setup SSL certificates (Let's Encrypt)
- [ ] Configure production secrets in Infisical
- [ ] Deploy infrastructure with Terraform
- [ ] Configure Zitadel with production domains
- [ ] Setup Netbird with production keys
- [ ] Deploy Pomerium configuration
- [ ] Configure CI/CD pipelines
- [ ] Setup monitoring and alerting
- [ ] Configure backups
- [ ] Document runbooks

### CI/CD Pipelines

GitHub Actions workflows are in `.github/workflows/`:

- `terraform-deploy.yaml` - Infrastructure deployment
- `codeql.yml` - Security scanning
- TODO: Frontend build and deploy
- TODO: Backend build and deploy
- TODO: Integration tests

---

## API Documentation

### Base URL

- Development: `http://localhost:3001/api/v1`
- Production: `https://api.yourdomain.com/api/v1`

### Authentication

All authenticated endpoints require a Bearer token:

```
Authorization: Bearer <jwt-token>
```

### Example API Calls

#### Get Applications

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/applications
```

#### Create Setup Key

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-device","autoGroups":["user-devices"]}' \
  http://localhost:3001/api/v1/netbird/setup-keys
```

---

## Testing

### Frontend Tests

```bash
cd frontend
npm test              # Run Jest tests
npm run test:watch    # Watch mode
```

### Backend Tests

```bash
cd backend
npm test              # Run Jest tests
npm run test:watch    # Watch mode
```

### Integration Tests

TODO: E2E tests with Playwright

---

## Troubleshooting

### Common Issues

#### Frontend doesn't connect to backend
- Check CORS configuration in backend
- Verify API_URL in frontend .env
- Check network connectivity

#### Authentication fails
- Verify Zitadel configuration
- Check client ID and secret
- Verify redirect URIs

#### Cannot access applications
- Ensure Netbird client is running
- Check user groups in Zitadel
- Verify Pomerium policies

#### Device enrollment fails
- Check Netbird API token
- Verify setup key hasn't expired
- Check network connectivity

### Debug Mode

Enable debug logging:

```bash
# Backend
LOG_LEVEL=debug npm run dev

# Frontend
NEXT_PUBLIC_DEBUG=true npm run dev
```

### Support

- Documentation: `docs/`
- Issues: GitHub Issues
- Internal: Contact DevOps team

---

## Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit: `git commit -m "feat: add feature"`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## License

Proprietary - Neogenesys Platform

---

## Changelog

### Version 1.0.0 (2024-12-04)

Initial release with:
- Modern login page with SSO, WebAuthn, MFA
- Backend API with Zitadel and Netbird integration
- Infrastructure as Code with Terraform
- 10 test applications
- Device enrollment system
- Comprehensive documentation

---

For more detailed information, see:
- [Setup Guide](setup-guide.md)
- [Pomerium Integration](pomerium-zitadel-integration.md)
- [Architecture Details](arquitectura.md)

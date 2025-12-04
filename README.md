# Neoprod — Zero Trust Remote Access Platform  
**Pomerium + Zitadel + Netbird + Supabase + Next.js + TSplus**

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)](https://www.typescriptlang.org/)

Enterprise-grade Zero Trust platform providing secure remote access to applications and resources through a unified, modern dashboard.

---

## ✨ Features

### 🔐 Security First
- **Zero Trust Architecture**: No implicit trust, continuous verification
- **Multi-Factor Authentication**: TOTP, WebAuthn, SMS
- **Single Sign-On**: Integration with major identity providers
- **Network Isolation**: WireGuard-based mesh VPN
- **Role-Based Access Control**: Granular permissions and policies

### 🚀 Modern User Experience
- **Beautiful Login Page**: SSO, WebAuthn, and traditional authentication
- **Unified Dashboard**: Single pane of glass for all applications
- **Self-Service Device Enrollment**: Easy onboarding with one-line installer
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🛠️ Developer Friendly
- **TypeScript**: Full type safety across the stack
- **Modern Stack**: Next.js 14, React 18, Express, Supabase
- **Infrastructure as Code**: Terraform for reproducible deployments
- **API First**: RESTful API with comprehensive documentation
- **Extensive Documentation**: Complete guides and runbooks

### 🌐 Enterprise Features
- **Remote Desktop Access**: TSplus integration for Windows applications
- **Application Proxy**: Secure access to internal applications
- **Audit Logging**: Complete trail of all access and changes
- **Multi-Tenant Ready**: Support for multiple organizations
- **Scalable Architecture**: Horizontal scaling capabilities

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Netbird client installed
- GCP account (for infrastructure)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/infra-neo/Neoprod.git
   cd Neoprod
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.template .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.template .env
   # Edit .env with your configuration
   npm run dev
   ```

4. **Start Test Applications**
   ```bash
   cd configs/test-apps
   docker-compose up -d
   ```

5. **Access the Platform**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                              │
│                                                          │
│  ┌────────────┐                                         │
│  │   User     │ ──────► Netbird Client (Required)       │
│  └────────────┘                                         │
└────────────┬────────────────────────────────────────────┘
             │
             │ WireGuard VPN
             │
┌────────────▼────────────────────────────────────────────┐
│              Netbird Mesh Network                        │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │     VM1      │      │     VM2      │                │
│  │  (Gateway)   │      │   (Proxy)    │                │
│  │              │      │              │                │
│  │ - Zitadel    │      │ - Pomerium   │                │
│  │ - Netbird    │      │ - Frontend   │                │
│  │   Management │      │ - Backend    │                │
│  │              │      │ - Test Apps  │                │
│  └──────────────┘      └──────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Access Flow

1. User connects via Netbird VPN (mandatory)
2. User authenticates via Zitadel (SSO + MFA)
3. Backend validates token and checks permissions
4. Pomerium proxies requests to internal applications
5. All traffic encrypted and logged

### Security Layers

1. **Network**: WireGuard VPN mesh (Netbird)
2. **Identity**: OIDC authentication (Zitadel)
3. **Authorization**: Group-based policies (Pomerium)
4. **Application**: RBAC and audit logging (Backend)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Radix UI
- **State**: Zustand + SWR
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + Zitadel OIDC

### Infrastructure
- **Cloud**: Google Cloud Platform
- **IaC**: Terraform
- **VPN**: Netbird (WireGuard)
- **Proxy**: Pomerium
- **Identity**: Zitadel
- **Secrets**: Infisical
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
Neoprod/
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and helpers
│   │   └── services/     # API client services
│   └── package.json
│
├── backend/              # Express backend API
│   ├── src/
│   │   ├── api/         # API route handlers
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Express middleware
│   │   └── config/      # Configuration
│   └── package.json
│
├── infra/               # Infrastructure as Code
│   └── gcp/            # Google Cloud Platform
│       ├── *.tf        # Terraform modules
│       └── scripts/    # Setup scripts
│
├── configs/             # Configuration files
│   ├── pomerium/       # Pomerium proxy config
│   └── test-apps/      # Docker test applications
│
├── docs/               # Documentation
│   ├── PROJECT_DOCUMENTATION.md
│   ├── setup-guide.md
│   └── pomerium-zitadel-integration.md
│
├── scripts/            # Utility scripts
│   ├── bootstrap_vm2_pomerium.sh
│   └── bootstrap_ubuntu_gateway.sh
│
└── .github/            # GitHub Actions workflows
    └── workflows/
```

---

## 📚 Documentation

### Core Documentation
- **[Complete Project Documentation](docs/PROJECT_DOCUMENTATION.md)** - Comprehensive guide
- **[Setup Guide](docs/setup-guide.md)** - Step-by-step installation
- **[Pomerium Integration](docs/pomerium-zitadel-integration.md)** - Zero Trust setup
- **[Architecture](docs/arquitectura.md)** - System architecture details

### Component Documentation
- **[Frontend README](frontend/README.md)** - Frontend development guide (TODO)
- **[Backend README](backend/README.md)** - Backend API documentation (TODO)
- **[Infrastructure Guide](infra/README.md)** - Terraform deployment (TODO)
- **[Test Apps](configs/test-apps/README.md)** - Sample applications

### Operational Documentation
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues (TODO)
- **[Security Guide](SECURITY.md)** - Security best practices
- **[API Reference](docs/API.md)** - API endpoint documentation (TODO)

---

## 💻 Development

### Environment Setup

1. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd backend && npm install
   ```

2. **Configure environment**
   ```bash
   # Copy templates
   cp frontend/.env.template frontend/.env.local
   cp backend/.env.template backend/.env
   
   # Edit with your configuration
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   cd frontend && npm run dev
   
   # Terminal 2 - Backend
   cd backend && npm run dev
   
   # Terminal 3 - Test Apps
   cd configs/test-apps && docker-compose up
   ```

### Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with commits following [Conventional Commits](https://www.conventionalcommits.org/)
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Create Pull Request

### Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e  # TODO
```

---

## 🚀 Deployment

### Infrastructure Deployment

```bash
cd infra/gcp
terraform init
terraform plan
terraform apply
```

### Application Deployment

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Deploy (using your CI/CD pipeline)
```

### Production Checklist

- [ ] Configure production environment variables
- [ ] Setup SSL certificates
- [ ] Configure secrets in Infisical
- [ ] Deploy infrastructure
- [ ] Configure Zitadel production instance
- [ ] Setup Netbird production network
- [ ] Deploy Pomerium configuration
- [ ] Configure monitoring and alerts
- [ ] Setup backup procedures
- [ ] Document runbooks

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

Proprietary - © 2024 Neogenesys. All rights reserved.

---

## 🙏 Acknowledgments

This project integrates and builds upon several excellent open-source projects:

- [Pomerium](https://www.pomerium.com/) - Zero Trust proxy
- [Zitadel](https://zitadel.com/) - Identity provider
- [Netbird](https://netbird.io/) - VPN mesh network
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend platform

---

## 📞 Support

- **Documentation**: See `docs/` directory
- **Issues**: [GitHub Issues](https://github.com/infra-neo/Neoprod/issues)
- **Email**: support@neogenesys.com (TODO)

---

## 🗺️ Roadmap

### Phase 1: Foundation (Current)
- [x] Modern login page with SSO, WebAuthn, MFA
- [x] Backend API with core integrations
- [x] Infrastructure as Code
- [x] Test applications suite
- [x] Device enrollment system
- [x] Comprehensive documentation

### Phase 2: Core Features (Q1 2025)
- [ ] Complete Supabase integration
- [ ] Dashboard UI implementation
- [ ] TSplus remote desktop integration
- [ ] Password injection (Authentik/Infisical)
- [ ] Netbird client rebranding
- [ ] PowerShell one-line installer

### Phase 3: Enterprise Features (Q2 2025)
- [ ] Advanced RBAC with ACLs
- [ ] Audit logging and compliance
- [ ] n8n workflow automation
- [ ] Multi-tenant support
- [ ] Advanced monitoring and alerting
- [ ] Mobile app

### Phase 4: Optimization (Q3 2025)
- [ ] Performance optimization
- [ ] High availability setup
- [ ] Disaster recovery
- [ ] Load balancing
- [ ] Caching strategies

---

**Built with ❤️ by the Neogenesys team**

# ChopFlow Platform Super Admin Console (`chopflow-admin`)

Completely isolated SaaS administrative governance console for platform owners.

## Subdomain & Ports
- **Local Dev**: `http://localhost:5175`
- **Production**: `https://admin.chopflow.com`

## Key Capabilities
- **Zero Restaurant/POS/Customer Code**: Clean codebase dedicated solely to SaaS administration.
- **Tenant Management & Onboarding**: Enroll new restaurant businesses, toggle active/suspended statuses, review store codes and franchise branches.
- **Subscription Plans & MRR Pricing**: Configure Starter, Pro, and Enterprise tiers, monthly/annual pricing in GH₵, user limits, and feature flags.
- **Platform Analytics**: Track total tenants, active MRR growth, aggregate order count across all restaurants, and system health status.
- **Security & Audit Logs**: Immutable trail tracking administrative logins, tenant provisioning, and security events.

## Quick Start
```bash
# Run locally
npm run dev

# Build for production
npm run build
```

## GitHub Repository
This directory can be pushed as an independent repository:
```bash
git init
git remote add origin https://github.com/<your-org>/chopflow-admin.git
git push -u origin main
```

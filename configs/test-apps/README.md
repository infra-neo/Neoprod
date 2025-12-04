# Test Applications

This directory contains Docker Compose configuration for 10 test applications that demonstrate the Pomerium Zero Trust architecture.

## Applications Included

1. **App1** (HTTP Echo) - Simple echo server for testing
2. **App2** (Nginx) - Static website example
3. **Whoami** - Identity inspection tool
4. **File Browser** - Web-based file manager (admin only)
5. **Code Server** - VS Code in the browser (for developers)
6. **Grafana** - Monitoring dashboard with SSO integration
7. **Portainer** - Docker container management (admin only)
8. **Uptime Kuma** - Service monitoring
9. **Wekan** - Kanban board for project management
10. **Draw.io** - Diagramming tool

## Usage

### Start all test applications:
```bash
cd configs/test-apps
docker-compose up -d
```

### Stop all applications:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

## Access Requirements

Each application has different group requirements:
- **Public apps** (all users): whoami, draw.io
- **Developer apps**: code-server
- **Monitoring apps**: grafana, uptime-kuma
- **Project management**: wekan
- **Admin only**: filebrowser, portainer

## Network Configuration

All applications run on the `pomerium-network` Docker network and are only accessible through Pomerium proxy at:
- `https://app1.pomerium.local`
- `https://app2.pomerium.local`
- `https://whoami.pomerium.local`
- `https://files.pomerium.local`
- `https://code.pomerium.local`
- `https://grafana.pomerium.local`
- `https://portainer.pomerium.local`
- `https://uptime.pomerium.local`
- `https://wekan.pomerium.local`
- `https://drawio.pomerium.local`

## Integration with Pomerium

These applications are configured with labels that can be used to automatically configure Pomerium routes. The labels include:
- `pomerium.route.from` - External URL
- `pomerium.route.to` - Internal service URL
- `pomerium.route.policy.allow.groups` - Required groups

## Notes

- All applications are for testing purposes only
- Default passwords should be changed in production
- File volumes are stored in the current directory
- Database volumes use Docker named volumes

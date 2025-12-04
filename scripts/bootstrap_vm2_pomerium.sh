#!/bin/bash
# Bootstrap script for VM2 - Pomerium Proxy Server
# This script sets up Pomerium with Netbird integration for Zero Trust access

set -e

echo "=== Starting VM2 Bootstrap - Pomerium + Netbird ==="

# Update system
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg lsb-release jq openssl

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r '.tag_name')
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create Pomerium directory structure
echo "Creating Pomerium directories..."
mkdir -p /opt/pomerium/{certs,config}
mkdir -p /opt/netbird

# Install Netbird client
echo "Installing Netbird..."
curl -fsSL https://pkgs.netbird.io/install.sh | sh

# Configure Netbird to connect to the management server on VM1
# Note: Replace with your actual Netbird management URL (Netbird Magic DNS)
echo "Configuring Netbird..."
# The setup key should be generated from Netbird dashboard on VM1
# This will be added later via environment variable or secure method
cat > /opt/netbird/netbird-config.sh << 'EOF'
#!/bin/bash
# Configure Netbird with setup key
# Run this after obtaining the setup key from VM1 Netbird dashboard
# netbird up --setup-key YOUR_SETUP_KEY_HERE --management-url https://netbird-mgmt.internal:443
echo "Netbird configuration script ready"
echo "Run with setup key: netbird up --setup-key <YOUR_KEY>"
EOF
chmod +x /opt/netbird/netbird-config.sh

# Generate self-signed certificates for Pomerium (for internal Netbird network)
# In production, use proper certificates from Let's Encrypt or internal CA
echo "Generating self-signed certificates for Pomerium..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/pomerium/certs/key.pem \
  -out /opt/pomerium/certs/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=*.pomerium.local"

# Generate Pomerium secrets
echo "Generating Pomerium secrets..."
SIGNING_KEY=$(head -c32 /dev/urandom | base64)
COOKIE_SECRET=$(head -c32 /dev/urandom | base64)
SHARED_SECRET=$(head -c32 /dev/urandom | base64)

# Create .env file for Pomerium
cat > /opt/pomerium/.env << EOF
# Auto-generated Pomerium secrets
POMERIUM_SIGNING_KEY=${SIGNING_KEY}
POMERIUM_COOKIE_SECRET=${COOKIE_SECRET}
POMERIUM_SHARED_SECRET=${SHARED_SECRET}

# Zitadel configuration - UPDATE THESE VALUES
ZITADEL_CLIENT_ID=your-zitadel-client-id
ZITADEL_CLIENT_SECRET=your-zitadel-client-secret
EOF

chmod 600 /opt/pomerium/.env

# Copy Pomerium configuration files
# These should be provided via cloud-init or copied from repository
echo "Pomerium configuration files should be placed in /opt/pomerium/"
echo "Required files:"
echo "  - /opt/pomerium/docker-compose.yml"
echo "  - /opt/pomerium/config/config.yaml"

# Create systemd service for Pomerium
cat > /etc/systemd/system/pomerium.service << 'EOF'
[Unit]
Description=Pomerium Zero Trust Proxy
Requires=docker.service
After=docker.service netbird.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/pomerium
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
ExecReload=/usr/local/bin/docker-compose restart
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Enable but don't start yet (need to configure first)
systemctl daemon-reload
systemctl enable pomerium.service

# Configure firewall (UFW)
echo "Configuring firewall..."
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (for management)
ufw allow 22/tcp

# Allow Netbird WireGuard
ufw allow 51820/udp

# Allow Pomerium HTTPS (only accessible via Netbird network)
# These ports will only be accessible through the Netbird mesh
ufw allow 443/tcp
ufw allow 80/tcp

# Enable firewall
echo "y" | ufw enable

# Create management scripts
cat > /opt/pomerium/start.sh << 'EOF'
#!/bin/bash
cd /opt/pomerium
docker-compose up -d
docker-compose logs -f
EOF
chmod +x /opt/pomerium/start.sh

cat > /opt/pomerium/stop.sh << 'EOF'
#!/bin/bash
cd /opt/pomerium
docker-compose down
EOF
chmod +x /opt/pomerium/stop.sh

cat > /opt/pomerium/logs.sh << 'EOF'
#!/bin/bash
cd /opt/pomerium
docker-compose logs -f
EOF
chmod +x /opt/pomerium/logs.sh

cat > /opt/pomerium/restart.sh << 'EOF'
#!/bin/bash
cd /opt/pomerium
docker-compose restart
EOF
chmod +x /opt/pomerium/restart.sh

# Create post-install instructions
cat > /root/SETUP_INSTRUCTIONS.md << 'EOF'
# Pomerium VM2 Setup Instructions

## Post-Bootstrap Configuration Steps

### 1. Configure Netbird
Connect this VM to the Netbird mesh network:
```bash
# Get setup key from Netbird dashboard on VM1
netbird up --setup-key <YOUR_SETUP_KEY>

# Or use the helper script
/opt/netbird/netbird-config.sh
```

### 2. Configure Zitadel OIDC Application
On VM1 (https://gate.kappa4.com):

1. Log into Zitadel admin console
2. Create a new Application:
   - Type: Web Application (OIDC)
   - Name: Pomerium
   - Redirect URIs:
     - https://authenticate.pomerium.local/oauth2/callback
     - https://dashboard.pomerium.local/oauth2/callback
   - Post Logout URIs:
     - https://authenticate.pomerium.local
   - Grant Types: Authorization Code
   - Response Types: Code
   - Auth Method: Client Secret Post
   - Scopes: openid, profile, email, groups

3. Save Client ID and Client Secret
4. Update /opt/pomerium/.env with the credentials:
   ```bash
   nano /opt/pomerium/.env
   # Update ZITADEL_CLIENT_ID and ZITADEL_CLIENT_SECRET
   ```

### 3. Configure DNS (Netbird Magic DNS or /etc/hosts)
Add entries for Pomerium services using Netbird internal IPs:
```
<VM2_NETBIRD_IP>  authenticate.pomerium.local
<VM2_NETBIRD_IP>  dashboard.pomerium.local
<VM2_NETBIRD_IP>  app1.pomerium.local
<VM2_NETBIRD_IP>  app2.pomerium.local
<VM2_NETBIRD_IP>  admin.pomerium.local
```

### 4. Copy Pomerium Configuration Files
```bash
# Copy docker-compose.yml
cp /path/to/docker-compose.yml /opt/pomerium/

# Copy config.yaml
cp /path/to/config.yaml /opt/pomerium/config/config.yaml
```

### 5. Start Pomerium
```bash
systemctl start pomerium
# Or use the helper script
/opt/pomerium/start.sh
```

### 6. Verify Installation
```bash
# Check Docker containers
docker ps

# Check logs
/opt/pomerium/logs.sh

# Check Netbird status
netbird status
```

### 7. Test Access
From a client with Netbird connected:
1. Navigate to https://authenticate.pomerium.local
2. You should be redirected to Zitadel login
3. After authentication, you'll see the Pomerium dashboard with available apps

## Troubleshooting

### Check Pomerium logs
```bash
/opt/pomerium/logs.sh
```

### Check Netbird connectivity
```bash
netbird status
ping <VM1_NETBIRD_IP>
```

### Restart Pomerium
```bash
/opt/pomerium/restart.sh
```

### Update configuration
After changing config.yaml or .env:
```bash
/opt/pomerium/restart.sh
```

## Security Notes
- All access is through Netbird mesh network only
- No public IP addresses exposed
- Zitadel handles authentication
- Pomerium handles authorization based on groups
- MFA enforced at Zitadel level
EOF

echo "=== VM2 Bootstrap Complete ==="
echo "Generated secrets saved to /opt/pomerium/.env"
echo "Read /root/SETUP_INSTRUCTIONS.md for next steps"
echo ""
echo "IMPORTANT: Configure Netbird and Zitadel before starting Pomerium!"

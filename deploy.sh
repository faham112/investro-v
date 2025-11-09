#!/bin/bash

echo "Starting Investro Backend Deployment Script..."

# 1. Load environment variables
echo "Loading environment variables from .env..."
if [ -f .env ]; then
  source .env
  echo "Environment variables loaded."
else
  echo "WARNING: .env file not found. Please ensure your environment variables are set."
fi

# 2. Install project dependencies
echo "Installing project dependencies..."
npm install
if [ $? -ne 0 ]; then
  echo "ERROR: npm install failed. Exiting."
  exit 1
fi
echo "Project dependencies installed."

# 3. Install pm2 globally
echo "Installing pm2 globally..."
npm install -g pm2
if [ $? -ne 0 ]; then
  echo "ERROR: pm2 installation failed. Exiting."
  exit 1
fi
echo "pm2 installed."

# 4. Build the client project
echo "Building the client project for production..."
(cd client && npm install && npm run build)
if [ $? -ne 0 ]; then
  echo "ERROR: Client project build failed. Exiting."
  exit 1
fi
echo "Client project built successfully."

# 5. Build the server project
echo "Building the server project for production..."
(cd server && npm install && npm run build)
if [ $? -ne 0 ]; then
  echo "ERROR: Server project build failed. Exiting."
  exit 1
fi
echo "Server project built successfully."

# 6. Create uploads folder and set permissions
echo "Creating server/uploads directory and setting permissions..."
mkdir -p server/uploads
chmod 755 server/uploads
echo "server/uploads directory created and permissions set."

# 7. Start the server in production mode using pm2
echo "Starting Investro backend server with pm2..."
pm2 start dist/index.js --name investro-backend
if [ $? -ne 0 ]; then
  echo "ERROR: pm2 failed to start the server. Exiting."
  exit 1
fi
echo "Investro backend server started with pm2. You can check logs with 'pm2 logs investro-backend'."

echo ""
echo "--- Deployment Complete ---"
echo "Additional Manual Steps:"
echo "1. Ensure PostgreSQL is running and accessible via your DATABASE_URL."
echo "   You can test the connection with: psql \$DATABASE_URL"
echo "2. The initial admin user will be created automatically on first run using ADMIN_USERNAME and ADMIN_PASSWORD from your .env."
echo "3. Consider configuring a reverse proxy (e.g., Nginx) if you want the API accessible through a domain path (e.g., http://yourdomain.com/api)."
echo "4. Ensure your VPS firewall allows WebSocket connections (default port 5000) for real-time features."

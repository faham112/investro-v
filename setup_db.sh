#!/bin/bash

# --- Configurable variables ---
DB_USER="investro_user"
DB_PASSWORD="MySuperStrongPassword123"
DB_NAME="investro_db"
DB_HOST="127.0.0.1"
DB_PORT="5432"

ENV_FILE=".env"

echo "Starting PostgreSQL setup for Investro..."

# 1. Ensure PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL not found. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# 2. Start PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 3. Create PostgreSQL user
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1
if [ $? -ne 0 ]; then
    echo "Creating PostgreSQL user '$DB_USER'..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
else
    echo "User '$DB_USER' already exists. Updating password..."
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
fi

# 4. Create PostgreSQL database
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1
if [ $? -ne 0 ]; then
    echo "Creating database '$DB_NAME'..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
else
    echo "Database '$DB_NAME' already exists. Assigning owner..."
    sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"
fi

# 5. Grant all privileges on database to user
echo "Granting all privileges on '$DB_NAME' to '$DB_USER'..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 6. Update .env file with correct DATABASE_URL
if [ -f "$ENV_FILE" ]; then
    echo "Updating DATABASE_URL in $ENV_FILE..."
    sed -i "/^DATABASE_URL=/d" $ENV_FILE
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" >> $ENV_FILE
else
    echo "$ENV_FILE not found. Creating one..."
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" > $ENV_FILE
fi

echo ""
echo "✅ PostgreSQL setup complete."
echo "You can now run: npm run dev"

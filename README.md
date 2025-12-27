# ✈️ Travel API

A Platform for Sharing Travel Experiences.

## 📝 Description

Travel API enables users to share travel experiences, connect with others, and discover new destinations through a modern REST API.

## ✨ Features

- **Session-Based Authentication** – Authentication based on server-side sessions.
- **Permission-Based Authorization (PBAC)** – Flexible authorization system where admins define roles and assign fine-grained permissions.
- **Image Optimization** – Automatic image minification and conversion to WebP format.
- **Database Integration** – MySQL database integration using Drizzle ORM for type-safe queries.
- **Input Validation** – Request validation and schema enforcement using Zod.

## 🚀 Quick Start

> Make sure Docker and Docker Compose are installed on your system.

Follow the steps below to run the project locally using Docker:

#### 1. Clone the repository

```bash
git clone https://github.com/mRYasinQ/travel-api.git
cd travel-api
```

#### 2. Create environment file

```bash
cp .env.example .env
```

#### 3. Build and start containers

```bash
docker compose -f docker-compose-demo.yml up -d --build
```

#### 4. Enter application container

```bash
docker compose -f docker-compose-demo.yml exec app sh
```

#### 5. Create superuser

```bash
bun run db:superuser
```

#### 6. Access the application

- **API Base URL:** http://localhost:3000
- **API Documentation (Swagger):** http://localhost:3000/docs

## 🔧 Environment Configuration

```env
# Application.
NODE_ENV="development" # development | production
APP_PORT="3000"
BASE_URL="http://localhost:3000"
MAX_LIMIT_PAGINATION="20" # Number, Example: 20

# Redis.
REDIS_URL="redis://:YOUR_PASSWORD@redis:6379"
REDIS_PASSWORD="YOUR_PASSWORD"

# Database.
DB_HOST="mysql"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD="YOUR_PASSWORD"
DB_NAME="travel_app"
DB_CONNECTION_LIMIT="10"
DB_CACHE_QUERY_DEFAULT="30m" # Time.

# SMTP.
MAIL_SECURE="0" # 0: false | 1: true
MAIL_HOST="smtp4dev"
MAIL_PORT="5001"
MAIL_USER="root"
MAIL_PASSWORD="YOUR_PASSWORD"

# Time, Example: 2m: 2 minute, 1d: 1 day
TOKEN_EXPIRE="7d"
OTP_EXPIRE="3m"
OTP_CACHE="2h"
REQUEST_TIMEOUT="30s"

# File Size, Example: 2mb: 2_097_152, 200kb: 204_800
ACTIVITY_FILE_SIZE="2mb"
```

## 🤝 Contributing

1. Fork the repository
2. Create branch: `git checkout -b feature/your-feature-name`
3. Commit: `git commit -m "feat(area): add feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Create Pull Request

**Branch Naming:**

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent fixes

## 📄 License

This project is licensed under the MIT License.

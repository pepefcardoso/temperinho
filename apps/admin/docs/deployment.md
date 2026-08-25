# Deployment Guide

This guide covers how to deploy the Temperinho Admin dashboard to production.

## Environment Variables

Before deploying, ensure you have the following environment variables configured in your deployment environment:

```env
# The public URL of the backend API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# The URL where this dashboard is hosted
NEXT_PUBLIC_URL=https://admin.yourdomain.com
```

## Option 1: Deploying to Vercel (Recommended)

Vercel is the creator of Next.js and provides the most seamless deployment experience.

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Vercel will automatically detect that it's a Next.js project.
4.  Configure the Environment Variables in the Vercel dashboard.
5.  Click **Deploy**.

Future pushes to the `main` branch will automatically trigger production deployments.

## Option 2: Deploying via Docker

For agnostic environments (AWS ECS, DigitalOcean App Platform, self-hosted), a `Dockerfile` is provided. The Dockerfile uses Next.js Standalone mode for minimal image sizes.

### 1. Build the Docker Image

```bash
docker build -t temperinho-admin .
```

### 2. Run the Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api \
  -e NEXT_PUBLIC_URL=https://admin.yourdomain.com \
  temperinho-admin
```

The app will be accessible at `http://localhost:3000`.

# Step 1: Build the Vite SPA production bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy full application code
COPY . .

# Build production bundle (outputs to /app/dist)
RUN npm run build

# Step 2: Serve static files with lightweight Nginx web server
FROM nginx:alpine AS runner

# Copy custom Nginx configuration for SPA & PWA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

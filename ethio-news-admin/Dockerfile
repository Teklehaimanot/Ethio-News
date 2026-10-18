# Build CRA admin with production API URL
FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_BACKEND_URL=https://api.diroconsultancy.com/api/v1
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve static build
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

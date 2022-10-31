FROM node:16-buster-slim AS frontend
#ENV NODE_ENV=production
WORKDIR /frontend
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# nginx state for serving content
FROM nginx:alpine
COPY --from=frontend /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
EXPOSE 443/tcp

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
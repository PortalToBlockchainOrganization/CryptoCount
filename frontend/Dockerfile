FROM node:16-buster-slim AS frontend
WORKDIR /frontend
# Copy frontend codebase into /frontend
COPY . /frontend/
# Build the client
RUN npm install 

# nginx state for serving content
FROM nginx:alpine
COPY --from=frontend /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf 
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

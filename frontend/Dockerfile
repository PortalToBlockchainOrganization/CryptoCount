FROM node:16-buster-slim AS frontend
#ENV NODE_ENV=production
WORKDIR /frontend
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# # nginx state for serving content
# FROM httpd:2.4-alpine
# COPY --from=frontend /frontend/build /usr/local/apache2/htdocs



FROM nginx:alpine
COPY --from=frontend /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE "80"
EXPOSE "443/tcp"
# CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]

# # Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
#FROM nginx:stable-alpine
# COPY --from=frontend /app/build /usr/share/nginx/html
# COPY - from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

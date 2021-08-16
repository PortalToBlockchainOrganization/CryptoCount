
# Backend
FROM node:14-buster-slim as backend
ENV NODE_ENV=production
# Copy code from backend codebase into /backend
COPY . ./backend/
RUN cd backend && ls . && npm install

EXPOSE 3001

CMD ["node", "./backend/main.js", "-p", "3001"]

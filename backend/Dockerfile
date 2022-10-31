# Backend
FROM node:16-buster-slim as backend
ENV NODE_ENV=production
# Copy code from backend codebase into /backend
RUN mkdir ./backend
COPY . ./backend
RUN cd ./backend npm install

EXPOSE 3001


#RUN npm run build
#["npm run build", "./backend/build/index.js", "-p", "3001"]
CMD ["node", "./backend/build/index.js", "-p", "3001"]
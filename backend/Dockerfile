# Backend
FROM node:16-buster-slim as backend
#ENV NODE_ENV=production
# Copy code from backend codebase into /backend
RUN mkdir ./backend
WORKDIR /CryptoCount/backend/


COPY package.json ./
COPY . ./
#COPY ./CryptoCount/backend/package.json /backendImage/package.json
RUN npm install
#USER node


EXPOSE "3001"


#RUN npm run build
#["npm run build", "./backend/build/index.js", "-p", "3001"]
#CMD npm run build
#CMD npm run dev

CMD [ "npm", "start" ]
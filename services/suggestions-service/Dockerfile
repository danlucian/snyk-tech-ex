FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY dist/ ./dist/

EXPOSE 8085
CMD [ "npm", "start" ]
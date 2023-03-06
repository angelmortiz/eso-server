FROM node:18.14.2-alpine3.17

WORKDIR /usr/src/app
COPY ["package*.json", "./"]

#this sets 'root' as the owner of all node_modules files to prevent deployment on Azure App Service
RUN npm install && \
    find /usr/src/app/node_modules/ ! -user root | xargs chown root:root

COPY . .

ENV NODE_ENV=production
ENV PROJECT_PATH=/usr/src/app
ENV SERVER_PORT=8080
ENV CLIENT_ADDRESS=localhost
ENV CLIENT_PORT=3001

EXPOSE 8080

RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start:prod"]
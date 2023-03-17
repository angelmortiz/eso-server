# FROM node:18.14.2-alpine3.17
FROM node:lts-alpine

WORKDIR /usr/src/app
COPY package*.json ./

#Arguments
ARG AZURE_KEY_VAULT_URI
ARG AZURE_TENANT_ID
ARG AZURE_CLIENT_ID
ARG AZURE_CLIENT_SECRET

#Variables
ENV CLIENT_ADDRESS=www.tusaludoptima.com
ENV AZURE_KEY_VAULT_URI=$AZURE_KEY_VAULT_URI
ENV AZURE_TENANT_ID=$AZURE_TENANT_ID
ENV AZURE_CLIENT_ID=$AZURE_CLIENT_ID
ENV AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET

#this sets 'root' as the owner of all node_modules files to prevent deployment on Azure App Service
RUN npm install && \
    find /usr/src/app/node_modules/ ! -user root | xargs chown root:root

COPY . .

EXPOSE 8080

RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start:prod"]
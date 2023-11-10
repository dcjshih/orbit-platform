FROM node:latest as development
# Set working directory within image
WORKDIR /home/strapi
# Copy package.json into image WORKDIR
COPY package*.json ./
# Install Node Modules into this image
RUN npm install
# Copy application to image WORKDIR
COPY . ./
# Builds the administration panel and minimizes the assets
RUN npm run build
ENTRYPOINT ["npm"]
CMD ["run", "develop"]

FROM node:latest as production
WORKDIR /home/strapi
COPY package*.json ./
RUN npm install
COPY . ./
# Builds the administration panel and minimizes the assets
#RUN npm run build
ENTRYPOINT ["npm"]
CMD ["run", "start"]

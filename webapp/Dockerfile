FROM node:latest as development
# Set working directory within image
WORKDIR /home/node
# Copy package.json into image WORKDIR
COPY package*.json ./
# Install Node Modules into this image
RUN npm install
# Copy applicatin to image WORKDIR
COPY . ./
# Startup command when running this image via `docker run development`
CMD ["npm", "start"]

FROM node:latest as build
WORKDIR /home/node
COPY --from=development /home/node /home/node
RUN npm run build

FROM nginx:latest as production
COPY --from=build /home/node/dist /usr/share/nginx/html
COPY ./production.conf /etc/nginx/conf.d/default.conf

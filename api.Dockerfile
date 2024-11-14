FROM node:latest
# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json .

# Install dependencies
RUN yarn install

COPY . .
# Expose port 3005
EXPOSE 3005

RUN yarn run dev

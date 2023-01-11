FROM node:15.3.0-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
#COPY package*.json pokemons-api/

COPY ../app-errors/package*.json app-errors/
COPY ../app-utils/package*.json app-utils/
COPY ../app-middlewares/package*.json app-middlewares/

RUN cd app-errors && npm install
RUN cd app-utils && npm install
RUN cd app-middlewares && npm install

COPY pokemons-api/package*.json pokemons-api/
RUN cd pokemons-api && npm install

COPY . .
EXPOSE 4000
CMD cd pokemons-api && npm run start

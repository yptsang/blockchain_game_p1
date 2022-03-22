FROM node

WORKDIR /bclp

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm i
RUN npm install pm2 -g

CMD ["pm2-runtime", "./bin/www"]
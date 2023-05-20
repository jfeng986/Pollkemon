FROM node:18

RUN npm install -g pnpm

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .
EXPOSE 8081
ENV ADDRESS=0.0.0.0 PORT=8081 DB_HOST=postgres DB_PORT=5433 DB_NAME=pollkemon DB_USER=pollkemon DB_PASS=pollkemon

RUN pnpm build

#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#NOTE WE CANNOT DO {RUN pnpm db:reset} HERE BECAUSE DOCKER WILL NOT CONNECT THE NETWORK AT BUILD TIME!
#RUN pnpm db:reset

CMD ["pnpm", "startProd"]
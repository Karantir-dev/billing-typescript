FROM  node:16.13.1-alpine AS build

WORKDIR /app
COPY . .

RUN npm install && \
  npm run build


FROM nginx:1.25-alpine-slim

COPY --from=build /app/build/ /web

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /web

# USER portal 

EXPOSE 8080
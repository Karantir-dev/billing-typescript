FROM node:16.13.1-alpine as build

WORKDIR /build

COPY . .
RUN npm install -g npm@8.1.2 && npm install && npm run build


FROM nginx:1.25.4-alpine-slim as local

WORKDIR /web

EXPOSE 8080

COPY --from=build /build/build/ /web

COPY ./nginx.conf /etc/nginx/nginx.conf

# USER portal

FROM nginx:1.25.4-alpine-slim as github

WORKDIR /web

EXPOSE 8080

COPY build/ /web

COPY ./nginx.conf /etc/nginx/nginx.conf


# USER portal


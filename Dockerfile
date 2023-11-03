FROM nginx:1.25-alpine-slim

COPY build/ /web

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /web

# USER portal 

EXPOSE 8080
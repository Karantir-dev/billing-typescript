FROM  nikolaik/python-nodejs:latest AS build

COPY . /usr/local/src

RUN cd /usr/local/src && \
       npm install  && \
       npm run build


FROM nginx:1.21.4-alpine

RUN apk add --no-cache apache2-utils openssl && \
    echo 'admin:$apr1$kme5sfz3$je0SQadFV7bUoX0dtFSEB0' > /etc/nginx/.htpasswd && \
    mkdir -p /etc/nginx/ssl/ && \
    openssl req -x509 -nodes -days 365 \
        -subj  "/C=CA/ST=QC/O=Company Inc/CN=portal.com" \
        -newkey rsa:2048 -keyout /etc/nginx/ssl/cert.key \
        -out etc/nginx/ssl/cert.crt && \
    addgroup -S portal && adduser -S portal -G portal && \
    chown -R portal:portal /etc/nginx/ssl/ && \
    chown -R portal:portal /var/cache/nginx/

COPY --from=build /usr/local/src/build/ /web

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /web

USER portal 

EXPOSE 80
EXPOSE 443

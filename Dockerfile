FROM  node:16.13.1-alpine AS build

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL ${REACT_APP_API_URL}

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
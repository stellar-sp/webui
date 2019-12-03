FROM node:10.15

WORKDIR /app
ADD . /app

RUN npm install && \
    npm build

CMD ["ng", "serve"]

#FROM nginx

#COPY --from=0 /app/dist/ /usr/share/nginx/html/

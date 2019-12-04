#FROM node:10.15

#WORKDIR /app
#ADD . /app

#RUN npm install

#CMD ["./node_modules/.bin/ng", "serve"]

FROM nginx

#COPY --from=0 /app/dist/ /usr/share/nginx/html/

ADD ./dist/webui/ /usr/share/nginx/html/

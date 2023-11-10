FROM nginx:latest as development
COPY ./proxy.conf /etc/nginx/conf.d/proxy.conf
COPY ./development.conf /etc/nginx/conf.d/default.conf

FROM nginx:latest as production
COPY ./proxy.conf /etc/nginx/conf.d/proxy.conf
COPY ./production.conf /etc/nginx/conf.d/default.conf

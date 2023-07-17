FROM nginx:1.19.1-alpine
LABEL version=1.0.0.alpha
ENV DOCKER_IMAGEVER=1.0.0.alpha
ENV DIANA_MODULE=nginx

RUN apk add inotify-tools openssl
WORKDIR /opt

RUN mkdir /etc/nginx/conf.d/extra
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/default.conf /etc/nginx/conf.d/default.conf
COPY config/ssl-options /etc/ssl-options

COPY config/entrypoint.sh /opt/nginx.sh
RUN chmod +x /opt/nginx.sh

ENTRYPOINT ["/opt/nginx.sh"]

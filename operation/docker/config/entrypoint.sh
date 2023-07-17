#!/bin/sh

if [[ ! -f /usr/share/nginx/certificates/fullchain.pem ]]; then
    mkdir -p /usr/share/nginx/certificates
fi

# If certificates don't exist yet we must ensure we create them to start nginx
if [[ ! -f /usr/share/nginx/certificates/fullchain.pem ]]; then
    openssl genrsa -out /usr/share/nginx/certificates/privkey.pem 4096
    openssl req -new -key /usr/share/nginx/certificates/privkey.pem -out /usr/share/nginx/certificates/cert.csr -nodes -subj \
    "/C=US/ST=California/L=San Jose/O=${CERT_DOMAIN:-kyros.ai}/OU=kyros/CN=${CERT_DOMAIN:-kyros.ai}"
    openssl x509 -req -days 3650 -in /usr/share/nginx/certificates/cert.csr -signkey /usr/share/nginx/certificates/privkey.pem -out /usr/share/nginx/certificates/fullchain.pem
fi

# Watch the load balancer configure and root directory to reload.
$(while inotifywait -e close_write -e modify -e attrib --format 'INOTIFY] %T %w' --timefmt '%F %T' /etc/nginx/conf.d/extra /var/www /usr/share/nginx/certificates; do nginx -s reload; sleep 2; done) &

# Start nginx with daemon off as our main pid
nginx -g "daemon off;"

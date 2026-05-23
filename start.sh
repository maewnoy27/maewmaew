#!/bin/sh
PORT=${PORT:-8080}
cat > /etc/nginx/conf.d/default.conf << CONF
server {
    listen $PORT;
    server_name _;
    root /usr/share/nginx/html;
    index fashion-pos.html;
    location / {
        try_files \$uri \$uri/ /fashion-pos.html;
    }
}
CONF
exec nginx -g 'daemon off;'

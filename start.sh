#!/bin/sh
PORT=${PORT:-8080}

cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen $PORT;
    server_name _;
    root /usr/share/nginx/html;
    index fashion-pos.html;

    location / {
        try_files \$uri \$uri/ /fashion-pos.html;
    }

    gzip on;
    gzip_types text/html text/css application/javascript;
}
EOF

echo "Starting nginx on port $PORT..."
exec nginx -g 'daemon off;'

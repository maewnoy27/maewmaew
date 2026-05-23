FROM nginx:alpine

# คัดลอก nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# คัดลอกไฟล์ HTML ทั้งหมด
COPY . /usr/share/nginx/html

# ลบไฟล์ที่ไม่จำเป็น
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/server.ps1 \
          /usr/share/nginx/html/.gitignore

# Railway จะ inject $PORT ให้เอง
ENV PORT=8080
EXPOSE 8080

# envsubst แทนค่า $PORT ใน config แล้วเปิด nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

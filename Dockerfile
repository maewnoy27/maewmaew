FROM nginx:alpine

# คัดลอก nginx config ที่ฟัง port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ทั้งหมดไปยัง nginx web root
COPY . /usr/share/nginx/html

# ลบไฟล์ที่ไม่ต้องการออก
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/server.ps1 \
          /usr/share/nginx/html/.gitignore

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

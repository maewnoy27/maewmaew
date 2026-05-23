FROM nginx:alpine

# คัดลอกไฟล์ทั้งหมดไปยัง nginx web root
COPY . /usr/share/nginx/html

# ลบไฟล์ที่ไม่ต้องการออก
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/server.ps1 \
          /usr/share/nginx/html/.gitignore

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

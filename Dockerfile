FROM nginx:alpine

# คัดลอกไฟล์ HTML ทั้งหมด
COPY . /usr/share/nginx/html

# คัดลอก startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# ลบไฟล์ที่ไม่จำเป็นออกจาก web root
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/start.sh \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/server.ps1 \
          /usr/share/nginx/html/.gitignore

ENV PORT=8080
EXPOSE 8080

CMD ["/start.sh"]

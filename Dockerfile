FROM nginx:alpine

# copy start script ก่อน แล้วแปลง line ending CRLF -> LF ทันที
COPY start.sh /start.sh
RUN sed -i 's/\r//' /start.sh && chmod +x /start.sh

# copy ไฟล์ HTML
COPY . /usr/share/nginx/html

# ลบไฟล์ที่ไม่ต้องการใน web root
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/start.sh \
          /usr/share/nginx/html/server.ps1 \
          /usr/share/nginx/html/.gitignore \
          /usr/share/nginx/html/.gitattributes && \
    rm -f /etc/nginx/conf.d/default.conf

ENV PORT=8080
EXPOSE 8080

CMD ["/start.sh"]

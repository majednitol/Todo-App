# Use Nginx base image
FROM nginx:latest

# Copy Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80 
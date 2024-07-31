# Use MongoDB as the base image
FROM mongo:latest

# Create necessary directories
RUN mkdir -p /data/db /data/log && chown -R mongodb:mongodb /data/db /data/log

# Copy mongod.conf
COPY mongod.conf /etc/mongo/mongod.conf

# Command to run MongoDB with the custom configuration
CMD ["mongod", "--config", "/etc/mongo/mongod.conf"]

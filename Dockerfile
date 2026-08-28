FROM python:3.11-slim

WORKDIR /app

COPY . /app

# Expose default Cloud Run port (8080)
EXPOSE 8080

# Environment variable for port
ENV PORT=8080

# Start server
CMD ["python", "server.py"]

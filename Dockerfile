FROM python:3.11-slim

WORKDIR /app

COPY . /app

EXPOSE 8080

ENV PORT=8080

# Start server
CMD ["python", "server.py"]

FROM node:current-alpine

COPY frontend /frontend
WORKDIR /frontend
RUN npm install && npm run build

WORKDIR /
COPY satisfactory-buddy /satisfactory-buddy

ENV SAVES_DIR "/config/saved/server"
ENV JSON_DIR "/tmp"

ENTRYPOINT ["/satisfactory-buddy"]

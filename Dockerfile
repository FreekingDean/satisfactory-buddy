FROM scratch

COPY satisfactory-buddy /satisfactory-buddy

ENV SAVES_DIR "/config/saved/server"
ENV JSON_DIR "/tmp"

ENTRYPOINT ["/statisfactory-buddy"]

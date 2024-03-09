FROM node:18
RUN mkdir /app
RUN mkdir /common

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

EXPOSE 25586
EXPOSE 25587
CMD ["node", "index.js" ]
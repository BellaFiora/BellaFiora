FROM ubuntu:latest

RUN apt-get update && apt-get install -y apt-utils
RUN apt-get install -y build-essential libcurl4-openssl-dev wget tar autoconf libtool 

RUN mkdir /app
RUN mkdir /common

ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY src/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

WORKDIR /app
EXPOSE 25586
EXPOSE 25587
CMD ["/usr/local/bin/init.sh"]
#!/bin/bash
set -e
# make server
gcc -Wall -Wextra -c main.c -o obj/main.o
gcc -Wall -Wextra -c src/server.c -o obj/server.o
gcc -Wall -Wextra -o bin/bm_manager obj/main.o obj/server.o -lcurl -lpthread
# make -B
# run server
cd bin
./bm_manager
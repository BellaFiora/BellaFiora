CC=gcc
CFLAGS+=-Werror -Wall	
LDLIBS=-lcurl -lpcre -lsocket

CFILES = \
	src/debug.c \
	src/list.c \
	src/math.c \
	src/os.c \
	src/queue.c \
	src/server.c \
	src/web.c \
	src/format.c
OFILES = $(CFILES:.c=.o)

test: test.o $(OFILES)
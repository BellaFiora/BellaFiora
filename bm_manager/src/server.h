#ifndef SERVER_H
#define SERVER_H

// #define _POSIX_C_SOURCE 200112L

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>

#include <pthread.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

typedef struct {
	char* name;
	void* (*callback)(void*);
	int socket;
	int port;
	pthread_t th;
} Server;

Server* new_server(char* name, char* port, void* (*callback)(void*));
int start_server(Server* server);
int wait_server(Server* server);

#endif /* SERVER_H */

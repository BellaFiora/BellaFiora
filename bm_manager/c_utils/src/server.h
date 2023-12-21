#ifndef SERVER_H
#define SERVER_H

// #define _POSIX_C_SOURCE 200112L

#ifdef SERVER_SERVERS
extern Server **servers;
extern size_t nb_servers;
#endif

#include <arpa/inet.h>
#include <netdb.h>
#include <sys/socket.h>
#include <unistd.h>

#include "debug.h"

typedef struct {
  char *name;
  void *(*callback)(void *);
  void *(*sigint_handler)(void *);
  int running;
  int socket;
  int port;
  pthread_t th;
} Server;

// protos_flag
Server *new_server(char *name, char *port, void *(*callback)(void *),
                   void *(*sigint_handler)(void *));
int start_server(Server *server);
int wait_server(Server *server);
void free_server(Server *server);
int setup_sigint_handlers(void);

#endif /* SERVER_H */

#include "server.h"

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <pthread.h>
#include <sys/types.h>

static Server** servers = NULL;
static size_t nb_servers = 0;

__attribute__ ((constructor)) static void setup_servers(void) {
    servers = calloc(1, sizeof(Server));
    if (!servers)
        report(stderr, "calloc failed: %s", strerror(errno));
}

__attribute__ ((destructor)) static void free_servers(void) {
    for (size_t i = 0; i < nb_servers; i++)
        free(servers[i]);
    free(servers);
}

Server* new_server(char* name, char* port, void* (*callback)(void*), void* (*sigint_handler)(void*)) {
    // Get address info
    int status = 0;
    struct addrinfo hints, *res, *p;
    memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_UNSPEC; // IPv4 or IPv6
    hints.ai_socktype = SOCK_STREAM; // TCP
    hints.ai_flags = AI_PASSIVE; // Use my IP
    if ((status = getaddrinfo(NULL, port, &hints, &res))) {
        report(stderr, "getaddrinfo failed: %s", gai_strerror(status));
        return NULL;
    }

    // Iterate through results and bind to the first suitable address
    int server_socket = 0;
    for (p = res; p; p = p->ai_next) {
        if ((server_socket = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
            report(stdout, "socket failed: %s", strerror(errno));
            continue;
        }

        // Allow for the socket to quickly close when debugging locally
        int optval = 1;
        if (setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) == -1)
            report(stderr, "setsockopt failed: %s", strerror(errno));

        if (bind(server_socket, p->ai_addr, p->ai_addrlen) == -1) {
            report(stdout, "bind failed: %s", strerror(errno));
            close(server_socket);
            continue;
        }
        break;
    }

    freeaddrinfo(res);
    if (!p) {
        report(stderr, "no suitable address was found: %s", strerror(errno));
        return NULL;
    }

    // Listen for incoming connections
    if (listen(server_socket, 10) == -1) {
        report(stderr, "listen failed: %s", strerror(errno));
        close(server_socket);
        return NULL;
    }

    report(stdout, "Server is now listening on localhost:%s", port);

    // Create a Server
    Server* r = malloc(sizeof(Server));
    if (!r) {
        report(stderr, "malloc failed: %s", strerror(errno));
        close(server_socket);
        return NULL;
    }
    r->name = name;
    r->callback = callback;
    r->sigint_handler = sigint_handler;
    r->running = 1;
    r->socket = server_socket;
    r->port = atoi(port);
    r->th = 0; // Will be set by start_server

    // Keep track of it for its sigint_handler
    servers[nb_servers++] = r;
    servers = realloc(servers, (nb_servers + 1) * sizeof(Server));
    if (!servers) {
        report(stderr, "realloc failed: %s", strerror(errno));
        close(server_socket);
        free_server(r);
        return NULL;
    }

    return r;
}

int start_server(Server* server) {
    if (pthread_create(&server->th, NULL, server->callback, (void*)server)) {
        report(stderr, "pthread_create failed: %s", strerror(errno));
        free(server);
        return 1;
    }
    return 0;
}

int wait_server(Server* server) {
    if (pthread_join(server->th, NULL)) {
        report(stderr, "pthread_join failed: %s", strerror(errno));
        free(server);
        return 1;
    }
    return 0;
}

void free_server(Server* server) {
    free(server);
}

static void sigint_handlers(int signal) {
    if (signal != SIGINT)
        return;
    printf("\n");
    for (size_t i = 0; i < nb_servers; i++)
        servers[i]->sigint_handler(servers[i]);
}

int setup_sigint_handlers(void) {
    if (signal(SIGINT, sigint_handlers) == SIG_ERR) {
        report(stderr, "signal failed: %s", strerror(errno));
        return 1;
    }
    return 0;
}

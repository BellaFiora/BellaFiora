#include "server.h"

Server* new_server(char* name, char* port, void* (*callback)(void*)) {
	// Get address info
	int status = 0;
	struct addrinfo hints, *res, *p;
	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_UNSPEC; // IPv4 or IPv6
	hints.ai_socktype = SOCK_STREAM; // TCP
	hints.ai_flags = AI_PASSIVE; // Use my IP
	if ((status = getaddrinfo(NULL, port, &hints, &res))) {
		fprintf(stderr, "new_server: getaddrinfo failed: %s\n", gai_strerror(status));
		return NULL;
	}

	// Iterate through results and bind to the first suitable address
	int server_socket = 0;
	for (p = res; p; p = p->ai_next) {
		if ((server_socket = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
			fprintf(stdout, "new_server: socket failed: %s\n", strerror(errno));
			continue;
		}
		if (bind(server_socket, p->ai_addr, p->ai_addrlen) == -1) {
			fprintf(stdout, "new_server: bind failed: %s\n", strerror(errno));
			close(server_socket);
			continue;
		}
		break;
	}
	freeaddrinfo(res);
	if (!p) {
		fprintf(stderr, "new_server: no suitable address was found: %s\n", strerror(errno));
		return NULL;
	}

	// Listen for incoming connections
	if (listen(server_socket, 10) == -1) {
		fprintf(stderr, "new_server: listen failed: %s\n", strerror(errno));
		close(server_socket);
		return NULL;
	}

	printf("Server is now listening on localhost:%s\n", port);

	// Create a Server
	Server* r = malloc(sizeof(Server));
	if (!r) {
		fprintf(stderr, "new_server: malloc failed: %s\n", strerror(errno));
		close(server_socket);
		return NULL;
	}
	r->name = name;
	r->callback = callback;
	r->socket = server_socket;
	r->port = atoi(port);
	r->th = 0; // Will be set by start_server
	return r;
}

int start_server(Server* server) {
	if (pthread_create(&server->th, NULL, server->callback, (void*)server)) {
		fprintf(stderr, "start_server: %s\n", strerror(errno));
		free(server);
		return 1;
	}
	return 0;
}

int wait_server(Server* server) {
	if (pthread_join(server->th, NULL)) {
		fprintf(stderr, "wait_server: %s\n", strerror(errno));
		free(server);
		return 1;
	}
	return 0;
}

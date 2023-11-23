#include "src/server.h"

#define BUF_SIZE 2048

void* callback(void* data) {
	Server* server = (Server*)data;
	
	struct sockaddr client_addr = { 0 };
	socklen_t client_addr_len = sizeof(client_addr);
	char buf[BUF_SIZE] = { 0 };
	ssize_t bytes_received = 0;
	// char host[NI_MAXHOST] = { 0 };
	// char service[NI_MAXSERV] = { 0 };
	char* hello = "HTTP/1.1 200 OK\nContent-Length: 50\nContent-Type: text/html\nConnection: Closed\n\n<html><body><h1>salut au revoir</h1></body></html>";
	ssize_t bytes_to_send = strlen(hello);

	while (1) {

		int client_socket = accept(server->socket, &client_addr, &client_addr_len);
		if (client_socket == -1) {
			fprintf(stderr, "%s: %s\n", server->name, strerror(errno));
			continue;
		}

		// Read data from the client socket
		bytes_received = recvfrom(client_socket, buf, BUF_SIZE, 0, &client_addr, &client_addr_len);
		// bytes_received = recv(client_socket, buf, BUF_SIZE, 0);
		
		if (bytes_received == -1) {
			fprintf(stderr, "%s: recv failed: %s\n", server->name, strerror(errno));
			close(client_socket);
			continue;
		}
		else if (bytes_received == 0) {
			// Connection closed by the client
			fprintf(stdout, "%s: client disconnected\n", server->name);
			close(client_socket);
			continue;
		}

		// int s = getnameinfo(&client_addr, client_addr_len, host, NI_MAXHOST, service, NI_MAXSERV, NI_NUMERICSERV);
		// if (s)
		// 	fprintf(stderr, "%s: getnameinfo failed: %s\n", server->name, gai_strerror(s));
		// else
		// 	printf("%s: received %ld bytes from %s:%s\n", server->name, (long) bytes_received, host, service);

		// Print the received data
		fprintf(stdout, "%s: received: %.*s (%zu)\n", server->name, (int)bytes_received, buf, bytes_received);

		// send back the received data
		if (sendto(client_socket, hello, bytes_to_send, 0, &client_addr, client_addr_len) != bytes_to_send)
			fprintf(stderr, "%s: sendto failed: %s\n", server->name, strerror(errno));
		
		close(client_socket);
	}
}

int main(void) {
	Server* server1 = new_server("25586", "25586", callback);
	if (!server1) {
		fprintf(stderr, "main: failed to create server1\n");
		return 1;
	}
	Server* server2 = new_server("25587", "25587", callback);
	if (!server2) {
		fprintf(stderr, "main: failed to create server2\n");
		return 1;
	}

	if (start_server(server1)) {
		fprintf(stderr, "main: failed to start server1\n");
		return 1;
	}
	if (start_server(server2)) {
		fprintf(stderr, "main: failed to start server2\n");
		return 1;
	}

	if (wait_server(server1)) {
		fprintf(stderr, "main: failed to wait server1\n");
		return 1;
	}
	fprintf(stdout, "main: %s terminted\n", server1->name);
	if (wait_server(server2)) {
		fprintf(stderr, "main: failed to wait server2\n");
		return 1;
	}
	fprintf(stdout, "main: %s terminted\n", server2->name);
	return 0;
}

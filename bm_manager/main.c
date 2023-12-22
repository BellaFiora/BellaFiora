#include "c_utils/all.h"

#include <string.h>

#define BUF_SIZE 2048

#define creport(fd, msg, ...) report(fd, "%s: "msg, server->name, ##__VA_ARGS__)

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
/*
    // Make the server socket non blocking
    int optval = 1;
    if (setsockopt(server->socket, SOL_SOCKET, SOCK_NONBLOCK, &optval, sizeof(optval)) == -1)
        report(stderr, "first setsockopt failed: %s", strerror(errno));
*/
    // Set a timeout of 1s
    struct timeval timeout;
    timeout.tv_sec = 1;
    timeout.tv_usec = 0;
    if (setsockopt(server->socket, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout)) == -1)
        report(stderr, "second setsockopt failed: %s", strerror(errno));

    while (server->running) {
/*

        // All this mess basically makes sure there is data to read on server->socket
        // while adding a timeout of 1s to check for SIGINT
        FD_ZERO(&read_fds);
        FD_SET(server->socket, &read_fds);
        if (select(server->socket + 1, &read_fds, NULL, NULL, &timeout) <= 0) {
            // Either select failed or timeout is over
            //creport(stdout, "select timeout");
            continue;
        }
        if (!(FD_ISSET(server->socket, &read_fds))) {
            // There is nothing to read
            creport(stdout, "nothing to read");
            continue;
        }

        // Now we are sure this call will not be blocking
*/

        int client_socket = accept(server->socket, &client_addr, &client_addr_len);
        if (client_socket == -1) {
            // Error or timeout
            if (errno != EAGAIN && errno != EWOULDBLOCK)
                creport(stderr, "%s", strerror(errno));
            //else
            //    creport(stdout, "timeout");
            continue;
        }

        // Read data from the client socket
        bytes_received = recvfrom(client_socket, buf, BUF_SIZE, 0, &client_addr, &client_addr_len);
        // bytes_received = recv(client_socket, buf, BUF_SIZE, 0);

        if (bytes_received == -1) {
            creport(stderr, "recvfrom failed: %s", strerror(errno));
            close(client_socket);
            continue;
        }
        else if (bytes_received == 0) {
            // Connection closed by the client
            creport(stdout, "client disconnected");
            close(client_socket);
            continue;
        }

        // int s = getnameinfo(&client_addr, client_addr_len, host, NI_MAXHOST, service, NI_MAXSERV, NI_NUMERICSERV);
        // if (s)
        //  fprintf(stderr, "%s: getnameinfo failed: %s\n", server->name, gai_strerror(s));
        // else
        //  printf("%s: received %ld bytes from %s:%s\n", server->name, (long) bytes_received, host, service);

        // Print the received data
        //creport(stdout, "received %zu bytes:\n%.*s", bytes_received, (int)bytes_received, buf);

        // Process the request

        size_t i = 0;
        while (buf[i] != ' ') i++;
        i += 2;
        size_t j = 0;
        while (buf[i+j] != ' ') j++;
        DBGI(j);
        printf("%.*s\n", (unsigned int)j, buf+i);

        // send back the received data
        if (sendto(client_socket, hello, bytes_to_send, 0, &client_addr, client_addr_len) != bytes_to_send)
            creport(stderr, "sendto failed: %s", strerror(errno));

        close(client_socket);
    }

    return NULL;
}

void* sigint_handler(void* data) {
    Server* server = (Server*)data;
    server->running = 0;
    return NULL;
}

int main(void) {
    int i = 5;
    DBGI(i);
    return 0;

    setup_sigint_handlers();
    char server1_name[] = "HTTP Server";
    Server* server1 = new_server(server1_name, "25586", callback, sigint_handler);
    if (!server1) {
        report(stderr, "failed to create %s", server1_name);
        return 1;
    }
    char server2_name[] = "WebSocket Server";
    Server* server2 = new_server(server2_name, "25587", callback, sigint_handler);
    if (!server2) {
        report(stderr, "failed to create %s", server2_name);
        return 1;
    }

    if (start_server(server1)) {
        report(stderr, "failed to start %s", server1->name);
        return 1;
    }
    if (start_server(server2)) {
        report(stderr, "failed to start %s", server2->name);
        return 1;
    }

    int r = 0;
    printf("\n");

    if (wait_server(server1)) {
        report(stderr, "failed to wait %s", server1->name);
        r = 1;
    }
    report(stdout, "%s terminted", server1->name);

    if (wait_server(server2)) {
        report(stderr, "failed to wait %s", server2->name);
        r = 1;
    }
    report(stdout, "%s terminted", server2->name);

    return r;
}

#include <unistd.h>
#include <signal.h>

#include "src/all.h"

#define MAIN_BODY_LINUX 

#define MAIN_BODY_WIN MAIN_BODY_LINUX

#ifndef _WIN32

int main(int argc, char* argv[]){
	MAIN_BODY_LINUX
	return 0;
}

#else

#include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
	MAIN_BODY_WIN
	return 0;
}

#endif
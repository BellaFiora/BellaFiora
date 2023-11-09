#include <time.h>

#include "src/all.h"

#define MAIN_BODY_LINUX 

#define MAIN_BODY_WIN 

#ifndef _WIN32

int main(int argc, char* argv[]){
	clock_t begin = clock();
	MAIN_BODY_LINUX
	clock_t end = clock();
	double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
	printf("time of execution: %lf\n", time_spent);
	return 0;
}

#else

#include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
	clock_t begin = clock();
	MAIN_BODY_WIN
	clock_t end = clock();
	double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
	printf("time of execution: %lf\n", time_spent);
	return 0;
}

#endif
# Bella Fiora Desktop Build Guide

* The source code can be compiled, however, please note that it is imperative to add your own management logic for the 'presence.conf' file.
* This file is encrypted and contains information specific to our version of Bella Fiora, compatible only with our servers and the Bella Fiora ecosystem.
* Your own implementation of the 'credentials' library will require an infrastructure for your application to function properly.
It is also essential to manually add the required libraries as well as the 'gosumemory.exe' file.


## To install the libraries, simply execute the following command:
```bash
npm install
```

## To compile the application, make sure you have Electron installed by using the following command:
```bash
npm install --save -g electron
```

## To start the application in development mode, use the following command:
```bash
npm run start
```

## To compile the application, execute the following command:
```bash
npm run build
```

Treel
===

Treel is a minimalistic learning management system.



## File Structure


The two lists below detail key folders/files of this project:


### Folders

- **other/** Miscellaneous files.
- **src/** The source code.
- **src/back/** Back-end code.
- **src/front/** Front-end code.
- **src/public/** Files to be served by the server.
- **src/public/css/** All CSS to be served.
- **src/public/img/** All images (excluding favicon.png) to be served.
- **src/public/js/** All JavaScript to be served.
- **src/sass/** All SASS files.


### Files

- **src/back/Server.js** Run this to start the server.
- **src/front/Treel.jsx** This is compiled intro _treel.js_ via `webpack`.
- **src/public/css/treel.css** Main CSS file (result of compiling _treel.scss_).
- **src/public/js/treel.js** Main JavaScript file (result of compiling _Treel.jsx_).
- **src/sass/treel.scss** This is compiled into _treel.css_ via `node-sass`.

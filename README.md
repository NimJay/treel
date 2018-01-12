Treel
===

Treel is a minimalistic learning management system.



## File Structure

The following list details key folders/files of this project:

- **other** Miscellaneous files.
- **src** The source code.
    - **back** Back-end code.
        - **Server.js** Run this to start the server.
    - **front** Front-end code.
        - **Treel.jsx** This is compiled intro _treel.js_ via `webpack`.
    - **public** Files to be served by the server.
        - **css** All CSS to be served.
            - **treel.css** Main CSS file (result of compiling _treel.scss_).
        - **img** All images (excluding favicon.png) to be served.
        - **js** All JavaScript to be served.
            - **treel.js** Main JavaScript file (result of compiling _Treel.jsx_).
    - **sass** All SASS files.
        - **treel.scss** This is compiled into _treel.css_ via `node-sass`.

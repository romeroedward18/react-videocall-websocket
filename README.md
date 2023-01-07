# react-videocall-websocket

Proyecto aplicación que permite a dos usuarios conectarse y realizar videollamadas entre sí utilizando la tecnología WebRTC.

La aplicación utiliza Socket.io y Peer.js para establecer y gestionar la conexión WebRTC, y React para construir la interfaz de usuario.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Demo

https://react-videocall-websocket.onrender.com

## Uso

Cuando abras la aplicación por primera vez, se te pedirá que ingreses un código de sesión. Si ingresas un código que ya existe, te unirás a una sala existente y podrás hablar con otro usuario que se haya unido a la misma sala. Si ingresas un código nuevo, se creará una nueva sala y podrás esperar a que otro usuario se una a ella.

Una vez que estés conectado a una sala, podrás ver el video de tu compañero de videollamada y hablar con él/ella. Si deseas finalizar la llamada, simplemente haz clic en el botón central de color rojo.

## Requisitos

Para ejecutar esta aplicación, necesitarás tener instalado:

- Node.js (versión 12 o superior)
- npm (viene instalado con Node.js)

## Instalación

Instalar dependencias con npm en las carpetas client y server.

```bash
  cd react-chat-websocket/client
  npm install

  cd react-chat-websocket/server
  npm install
```

## Despliegue

Desplegar la aplicación con npm usando siguiente comando en las carpetas client y server.

```bash
  cd react-chat-websocket/client
  npm start

  cd react-chat-websocket/server
  npm start
```

La aplicación se iniciará en el puerto 3000 de tu máquina. Abre tu navegador en http://localhost:3000.

## Características técnicas

**Cliente:** React, TailwindCSS, React Bootstrap, PeerJS

**Servidor:** Node, Express, Socket.IO

## Recursos

- [Create React App](https://create-react-app.dev)
- [React Bootstrap](https://react-bootstrap.github.io)
- [Socket.IO](https://socket.io)
- [PeerJS](https://peerjs.com)

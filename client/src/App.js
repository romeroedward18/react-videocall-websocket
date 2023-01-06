import "./App.css";
import logo from "./logo.svg";
import NotificationSound from "./notification-sound.mp3";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "dayjs/locale/es";
import { io } from "socket.io-client";
import { Peer } from "peerjs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// Establecer la conexión con Socket.io
const socket = io(
  window.location.toString().includes("localhost")
    ? process.env.REACT_APP_API
    : process.env.REACT_APP_RENDER_API
);

// Establecer la conexión WebRTC con Peer.js
const peer = new Peer();

function App() {
  const audioPlayer = useRef(null);
  const videoRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessionCode, setSessionCode] = useState("");

  // Función para reproducir el archivo de audio
  function playAudio() {
    audioPlayer.current.play();
  }

  useEffect(() => {
    socket.on("connect", () => {
      peer.on("open", (id) => {
        if (searchParams.get("sessionCode")) {
          socket.emit("join-room", searchParams.get("sessionCode"), id);
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              videoRef.current.srcObject = stream;
            });
        }
      });
    });
  }, []);

  function handleNewSession() {
    setSearchParams({ sessionCode: uuidv4() });
    window.location.reload();
  }

  function handleInputChange(event) {
    setSessionCode(event.target.value);
  }

  function handleSubmit() {
    setSearchParams({ session: sessionCode });
  }

  console.log(searchParams.get("sessionCode"));

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {searchParams.get("sessionCode") ? (
            <div>
              <video ref={videoRef} autoPlay={true} />
            </div>
          ) : (
            <Row>
              <Col xs sm="12" lg="6">
                <div className="join-room-container">
                  <h1>Puedes realizar videollamadas aquí.</h1>
                  <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum."
                  </p>
                  <Row>
                    <Col sm="12" md="5">
                      <Button onClick={() => handleNewSession()}>
                        Nueva sesión
                      </Button>
                    </Col>
                    <Col sm="12" md="7">
                      <Form className="d-flex" onSubmit={handleSubmit}>
                        <Form.Control
                          type="text"
                          placeholder="Introduce el código de la reunión"
                          name="sessionCode"
                          value={sessionCode}
                          onChange={handleInputChange}
                          className="me-2"
                          required
                        />
                        <Button type="submit" variant="outline-light">
                          Unirte
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs sm="12" lg="6">
                <div className="image-container">
                  <img src={logo} alt="Logo" className="App-logo" />
                </div>
              </Col>
            </Row>
          )}
        </Container>
        <audio ref={audioPlayer} src={NotificationSound} />
      </header>
    </div>
  );
}

export default App;

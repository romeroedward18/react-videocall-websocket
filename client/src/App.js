import "./App.css";
import logo from "./logo.svg";
import NotificationSound from "./notification-sound.mp3";
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import { Peer } from "peerjs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { MdCallEnd, MdShare } from "react-icons/md";

// Establecer la conexión con Socket.io
const socket = io(
  window.location.toString().includes("localhost")
    ? process.env.REACT_APP_API
    : process.env.REACT_APP_RENDER_API
);

// Establecer la conexión WebRTC con Peer.js
const peer = new Peer(undefined, {
  host: window.location.hostname,
  port: 9000,
  path: "/myapp",
});

function App() {
  const audioPlayer = useRef(null);
  const videoRef = useRef(null);
  const secondVideoRef = useRef(null);
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
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const hasCamera = devices.some(
              (device) => device.kind === "videoinput"
            );
            const hasMicrophone = devices.some(
              (device) => device.kind === "audioinput"
            );
            navigator.mediaDevices
              .getUserMedia({ video: hasCamera, audio: hasMicrophone })
              .then((stream) => {
                videoRef.current.srcObject = stream;
                peer.on("call", (call) => {
                  call.answer(stream);
                });
                peer.on("stream", (userVideoStream) => {
                  secondVideoRef.current.srcObject = userVideoStream;
                });
              });
          });
        }
      });
    });

    socket.on("user-connected", handleUserConnected);
    // Desconectamos los handlers cuando se desmonta el componente
    return () => {
      socket.off("connect");
      socket.off("user-connected");
    };
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

  function handleUserConnected(userId) {
    // Llamar al usuario conectado
    const call = peer.call(userId, videoRef.current.srcObject);
    // Escuchar el evento stream y obtener el stream de la llamada
    call.on("stream", (stream) => {
      // Asignar el stream al elemento de video
      secondVideoRef.current.srcObject = stream;
    });
    call.on("close", () => {
      videoRef.current.srcObject = null;
      playAudio();
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {searchParams.get("sessionCode") ? (
            <div className="videocall-container">
              <video
                ref={videoRef}
                style={{
                  backgroundImage: `url(${logo})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "black",
                  width: "45%",
                  margin: "50px 10px",
                }}
                autoPlay={true}
                muted
              />
              <video
                ref={secondVideoRef}
                style={{
                  backgroundImage: `url(${logo})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundColor: "black",
                  width: "45%",
                  margin: "50px 10px",
                }}
                autoPlay={true}
              />
              <Row className="bottom-actions-container">
                <Col xs sm="12" md="4" className="d-flex justify-content-start">
                  <p className="text-white">
                    {searchParams.get("sessionCode")}
                  </p>
                </Col>
                <Col
                  xs
                  sm="12"
                  md="4"
                  className="d-flex justify-content-center"
                >
                  <Link to="/">
                    <Button
                      className="btn-circle x1-5"
                      variant="danger"
                      onClick={() => playAudio()}
                    >
                      <MdCallEnd />
                    </Button>
                  </Link>
                </Col>
                <Col xs sm="12" md="4" className="d-flex justify-content-end">
                  <OverlayTrigger
                    trigger="click"
                    placement={"top"}
                    overlay={
                      <Popover id={`copy-btn`}>
                        <Popover.Header as="h3">
                          Comparte esta videollamada
                        </Popover.Header>
                        <Popover.Body>
                          <p>
                            <strong>Enlace directo: </strong>
                            {window.location.href}
                          </p>
                          <p>
                            <strong>Código: </strong>
                            {searchParams.get("sessionCode")}
                          </p>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <Button className="btn-circle x1-5" variant="outline-light">
                      <MdShare />
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </div>
          ) : (
            <Row>
              <Col xs sm="12" md="6">
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

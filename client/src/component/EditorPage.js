import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { intiSocket } from "../socket";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

function EditorPage() {
  const [clients, setClient] = useState([]);
  const socketRef = useRef(null);
  const editorRef = useRef(null); // Define editorRef
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await intiSocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      const handleError = (e) => {
        console.log("socket error ", e);
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on("joined", ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined`);
        }
        setClient(clients);
      });

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} leave`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId != socketId);
        });
      });

      socketRef.current.on("codeChange", ({ code }) => {
        const editor = editorRef.current?.view; // Access the editor view
        if (editor) {
          const currentCode = editor.state.doc.toString();
          if (currentCode !== code) {
            editor.dispatch({
              changes: { from: 0, to: editor.state.doc.length, insert: code },
            });
          }
        }
      });
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
      socketRef.current.off("codeChange");
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div
          className="col-md-2 bg-dark text-light d-flex flex-column h-100"
          style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.1)" }}
        >
          <img
            src="/images/codecast.png"
            alt="codecast logo"
            className="img-fluid mx-auto"
            style={{ maxWidth: "150px", marginTop: "-43px" }}
          />
          <hr style={{ marginTop: "-3rem" }} />
          <div className="d-flex flex-column overflow-auto">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <div className="mt-auto">
            <hr />
            <button className="btn btn-success">Copy Room Id</button>
            <button className="btn btn-danger mt-2 mb-2 px-3 btn-block">
              Leave Room
            </button>
          </div>
        </div>
        <div className="col-md-10 text-light d-flex flex-column h-100">
          <Editor socketRef={socketRef} roomId={roomId} editorRef={editorRef} />
        </div>
      </div>
    </div>
  );
}

export default EditorPage;

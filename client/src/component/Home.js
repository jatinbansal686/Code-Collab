import React, { useState } from "react";
import toast from "react-hot-toast";
import { v7 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUserName] = useState("");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    try {
      const id = uuid();
      setRoomId(id);
      toast.success("Room Id is generated");
    } catch (error) {
      console.log("error");
      toast.error("Failed to generate id");
    }
  };

  const joinRoom = (e) => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }
    // navigate
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room is joined");
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm p-2 mb-5 bg-secondry rounded">
              <div className="card-body text-center bg-dark">
                <img
                  className="img-fluid mx-auto d-block"
                  src="/images/codecast.png"
                  alt="codecast-logo"
                  style={{ maxWidth: "150px" }}
                />
                <h4 className="text-light">Enter the Room Id</h4>
                <div className="form-group">
                  <input
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                    }}
                    type="text"
                    className="form-control mb-2"
                    placeholder="ROOM ID"
                  />
                </div>
                <div className="form-group">
                  <input
                    value={username}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                    type="text"
                    className="form-control mb-2"
                    placeholder="Username"
                  />
                </div>
                <button
                  onClick={joinRoom}
                  className="btn btn-success btn-lg btn-block"
                >
                  JOIN
                </button>
                <p className="mt-3 text-light">
                  Don't have room Id?{" "}
                  <span
                    className="text-success p-2"
                    style={{ cursor: "pointer" }}
                    onClick={generateRoomId}
                  >
                    New Room
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

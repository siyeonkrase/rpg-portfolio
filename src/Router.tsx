import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./routes/GamePage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#020202",
                color: "#fff",
                fontFamily: "monospace",
                textAlign: "center",
              }}
            >
              <h1 style={{ marginBottom: 16 }}>Siyeon's RPG Portfolio</h1>
              <p>Press the button below to enter the world</p>
              <a
                href="/game"
                style={{
                  marginTop: 20,
                  padding: "10px 20px",
                  border: "1px solid #fff",
                  borderRadius: 6,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Enter Game
              </a>
            </div>
          }
        />

        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import ListInputMod from "./modules/ListInputMod.js";

const monday = mondaySdk();
const redirect_uri = "https://04b49b30074a.ngrok.app/oauth/token";
const client_id = "eb18d6836553020a3107559d979d31a8";
const client_secret = "ae0b0f705f2a9d99967c68fe1e61f308";

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token is already stored
    const storedToken = sessionStorage.getItem("mondayToken");
    if (storedToken) {
      setToken(storedToken);
      monday.setToken(storedToken);
      console.log("Token already stored");
    } else {
      // Redirect to OAuth authorization URL
      window.location.href = `https://auth.monday.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    }
  }, []);

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && !token) {
      // Exchange code for access token using the proxy server
      fetch(redirect_uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: client_id,
          client_secret: client_secret, // Ensure this is secure
          code: code,
          redirect_uri: redirect_uri,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            setToken(data.access_token);
            sessionStorage.setItem("mondayToken", data.access_token);
            monday.setToken(data.access_token);
            console.log("Token received and stored");
            // Clear the URL to prevent re-triggering
            window.history.replaceState({}, document.title, "/");
          } else {
            console.error("Failed to receive access token:", data);
          }
        })
        .catch((error) => console.error("Error fetching token:", error));
    }
  }, [token]);

  return (
    <div className="App container">
      <div className="row mt-5">
        <div className="col-12 py-3 mt-5">
          <ListInputMod />
        </div>
      </div>
    </div>
  );
};

export default App;
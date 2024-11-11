import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import List from "./modules/List.js"
import ListInput from "./modules/ListInput.js";
import ListInputMod from "./modules/ListInputMod.js";
import { Divider, Loader } from "monday-ui-react-core"

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
// monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");
const storageInstance = monday.storage.instance;

// const [token, setToken] = useState(null);

  // useEffect(() => {
  //   // Check if token is already stored
  //   const storedToken = sessionStorage.getItem("mondayToken");
  //   if (storedToken) {
  //     setToken(storedToken);
  //     monday.setToken(storedToken);
  //   } else {
  //     // Redirect to OAuth authorization URL
  //     window.location.href = `https://auth.monday.com/oauth2/authorize?client_id=d607d4ff104e14f6d98be7ce2d27483b&redirect_uri=YOUR_REDIRECT_URI&response_type=code`;
  //   }
  // }, []);

  // useEffect(() => {
  //   // Handle OAuth callback
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");
  //   if (code && !token) {
  //     // Exchange code for access token
  //     fetch("https://auth.monday.com/oauth2/token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         client_id: "YOUR_CLIENT_ID",
  //         client_secret: "YOUR_CLIENT_SECRET",
  //         code: code,
  //         redirect_uri: "YOUR_REDIRECT_URI",
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setToken(data.access_token);
  //         sessionStorage.setItem("mondayToken", data.access_token);
  //         monday.setToken(data.access_token);
  //       })
  //       .catch((error) => console.error("Error fetching token:", error));
  //   }
  // }, [token]);

const App = () => {
  
  return (
    <div className="App container">
      <div className="row mt-5">
        <div className="col-12 py-3 mt-5">
          {/* {context && <ListInput 
            // nameHandler={evt => updateNameValue(evt)} 
            // nameValue={nameInput}
            // countHandler={evt => updateCountValue(evt)} 
            // countValue={countInput}
            totalCount={totalCount} 
            dropdownHandler={evt => handleOptionsSelection(evt)}
            printerHandler={evt => handlePrinterSelection(evt)}
            clickFunction={handleInput}
            resetTotalFunction={handleTotalReset}
            parentContext={context}
            disabledCheck={selectedOption.value !== undefined ? false : true }
            selectedVal={selectedOption}
            printerVal={printerOptions}
            shouldLoad={shouldLoad}
            >
          </ListInput>} */}
          <ListInputMod 
            >
          </ListInputMod>
          
        </div>
      </div>
    </div>
  );
};
export default App;

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

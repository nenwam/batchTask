import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import List from "./modules/List.js"
import ListInput from "./modules/ListInput.js";
import { Divider } from "monday-ui-react-core"
import Onboard from "./pages/Onboard";
import BatchTask from "./pages/BatchTask";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { DataProvider } from './modules/DataContext';


const App = () => {
  return (
    // <DataProvider>
      <Router>   
          <div>
            <Routes>
              <Route path="/" element={<BatchTask />} />
              <Route path="/onboard/" element={<Onboard />} />
            </Routes>
          </div>
      </Router>
    /* </DataProvider> */
  );
}

export default App

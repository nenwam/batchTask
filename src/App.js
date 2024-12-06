import React, { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import ListInputMod from "./modules/ListInputMod.js";
import { Toast } from "monday-ui-react-core";

const monday = mondaySdk();

const App = () => {
  const [context, setContext] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [showViewerToast, setShowViewerToast] = useState(false);

  useEffect(() => {
    // Initialize the app and get context
    monday.listen("context", res => {
      setContext(res.data);
    });

    // Check if user is view-only
    monday.api(`query { me { is_view_only }}`)
      .then(res => {
        if (!res.data || !res.data.me) {
          console.error('Invalid API response:', res);
          return;
        }
        setIsViewOnly(res.data.me.is_view_only);
        if (res.data.me.is_view_only) {
          setShowViewerToast(true);
        } else {
          setShowWelcomeToast(true);
        }
      })
      .catch(err => {
        console.error('Error fetching view-only status:', err);
        setIsViewOnly(true);
        setShowViewerToast(true);
      });
  }, []);

  return (
    <div className="App container">
      {showViewerToast && (
        <Toast
          open={showViewerToast}
          type={Toast.types.NEGATIVE}
          onClose={() => setShowViewerToast(false)}
        >
          As a viewer, you are unable to use this app.
        </Toast>
      )}
      <div className="container">
        <div className="row">
          {showWelcomeToast && (
            <Toast
              open={showWelcomeToast}
              type={Toast.types.POSITIVE} 
              autoHideDuration={15000}
              onClose={() => setShowWelcomeToast(false)}
            >
              Welcome! Check out our <a href="https://rallyessentials.com/documentation/" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}> documentation </a> to help you get started.
            </Toast>
          )}
        </div>
        <div className="row">
          <div className="col-12">
            <ListInputMod />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
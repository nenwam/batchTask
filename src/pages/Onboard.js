import React from "react";
import { TextField, Button, Label, Dropdown, Divider, Heading, Text, Toggle, Flex } from "monday-ui-react-core"
import mondaySdk from "monday-sdk-js";
import { useState, useEffect, useRef } from "react";
import logo from '../assets/logo_cropped.png';
import { useLocation, useHistory } from "react-router-dom";
import { useData } from '../modules/DataContext';
import { useSelector } from 'react-redux'

const monday = mondaySdk();
const storageInstance = monday.storage.instance;

const Onboard = () => {
    const [context, setContext] = useState();
    const [customBatchName, setCustomBatchName] = useState(false)
    const [totalBatches, setTotalBatches] = useState(0);
    const channel = new BroadcastChannel('monday_app_channel');


    const handleCustomBatch = (evt) => {
        setCustomBatchName(evt) 
        storageInstance.setItem('customBatchName_'/* + context.itemId*/, JSON.stringify(evt));
        // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
        console.log("customBatchName: ", evt) 
    }

    channel.onmessage = (event) => {
        // Handle the received message
        console.log("Total Batch Message: ", event.data.updatedData);
        
        const messageVal = parseInt(event.data.updatedData)
        const newTotal = messageVal + totalBatches
        console.log("Type of data: ", (messageVal + totalBatches))
        setTotalBatches(newTotal)
    };


    useEffect(() => {
        console.log("----App.js UseEffect #1----")
        // Notice this method notifies the monday platform that user gains a first value in an app.
        // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
        monday.execute("valueCreatedForUser");
    
        monday.listen("context", (res) => {
          console.log("useEffect storage res: ", res)
          setContext(res.data);
          
          storageInstance.getItem('totalBatches_').then(response => { 
            console.log("Total Batches Response res: ", response)
            console.log("Total Batches Response: ", response.data.value)
            setTotalBatches(JSON.parse(response.data.value));
          });
        });
    
        
      }, []);

    useEffect(() => {
        console.log("----Onboard.js UseEffect #2----")
        if (context) {
            console.log("Context: ", context)
            storageInstance.setItem('totalBatches_', JSON.stringify(totalBatches));
            // localStorage.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
        }
        console.log("Total Batches: ", totalBatches)
    }, [totalBatches])

    console.log("Onboard totalBatches: ", totalBatches)
    return (
        <div className="container">
            <div className="row mb-2">
                <div className="col text-center"><img width="30%" src={logo} /></div>
            </div>
            <div className="row">
                <Divider></Divider>
            </div>
            <div className="row mb-2">
                <div className="col">
                    <div className="row">
                        <div className="col text-center">
                            <h4>Current Plan</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <Label text="Free" color="positive" kind="line"></Label>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col text-center">
                            <h4>Batches Created this Month</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <Label text={totalBatches} color="negative"></Label>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col text-center">
                            <h4>Batch Quota</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <Label text="100"></Label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <Divider></Divider>
            </div>
            {/* <div className="row my-3">
                <div className="col">
                    <h2 className="pb-3">Settings</h2>
                    <div className="row">
                        <div className="col-2">
                            <Toggle onChange={evt => handleCustomBatch(evt)}></Toggle>
                        </div>
                        <div className="col-4">
                            <h5 className="">Custom Batch Names</h5>
                        </div>
                        
                    </div>
                    
                </div>
            </div> */}

            <div className="row">
                <div className="container pt-3">
                    <div className="row">
                        <div className="col">
                            <h2>Welcome to the BatchTask Dashboard</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h5>This is where you can find information on your subscription status, monthly batch count, monthly batch quota, and usage instructions.</h5>
                        </div>
                    </div>
                </div>
                <div className="container pt-5">
                    <div className="row">
                        <div className="col">
                            <h2>Get Started</h2>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col">
                            <h4>Step 1: Adding BatchTask to your Item View</h4>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col">
                            <h4>Step 2: Select your output column</h4>
                        </div>
                    </div>
                    <div className="row pt-2">
                        <div className="col">
                            <h4>Step 3: Start adding batches</h4>
                        </div>
                    </div>
                </div>
                <Divider></Divider>
                
            </div>
            <div className="row">
                <div className="col text-center">
                    <p><a href="#">Send us your feedback</a></p>
                </div>
                <div className="col text-center">
                    <p><a href="#">Documentation</a></p>
                </div>
                <div className="col text-center">
                    <p><a href="#">Email Support</a></p>
                </div>
            </div>
        </div>
    )
}

export default Onboard;
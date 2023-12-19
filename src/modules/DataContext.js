import React, { createContext, useState, useContext, useEffect } from 'react';
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();
const storageInstance = monday.storage.instance;

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [totalBatches, setTotalBatches] = useState(0);

    useEffect(() => {
        // Fetch the initial totalBatches value from storage
        storageInstance.getItem('totalBatches_').then(response => {
        if (response.data && response.data.value) {
            const initialTotalBatches = JSON.parse(response.data.value);
            setTotalBatches(initialTotalBatches);
        }
        }).catch(err => {
        console.error("Error fetching initial totalBatches:", err);
        });
    }, []);
  
    console.log("Initial totalBatches:", totalBatches)
  
    return (
        <DataContext.Provider value={{ totalBatches, setTotalBatches }}>
        {children}
        </DataContext.Provider>
    );
};
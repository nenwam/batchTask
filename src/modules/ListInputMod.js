import React from "react";
import { TextField, Button, Label, Dropdown, Loader, Divider } from "monday-ui-react-core"
import mondaySdk from "monday-sdk-js";
import { useState, useEffect, useRef, useMemo } from "react";
import List from "./List"

const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5MTI1MjEwNSwiYWFpIjoxMSwidWlkIjo1MDY1MzM4MSwiaWFkIjoiMjAyMy0xMC0yM1QyMToyNzo1Ni4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTkzNTI3OTYsInJnbiI6InVzZTEifQ.IxSCkDC63caJ9dP_HobxQpVMEWXSJUDi-vcyRozQnKA");
// monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w") // rally essentials key
const storageInstance = monday.storage.instance;

const ListInputMod = ({dropdownHandler, printerHandler, clickFunction, resetTotalFunction, selectedVal, printerVal, disabledCheck}) => {
    const [context, setContext] = useState()
    console.log("Context from parent: ", context)
    const [isInitialized, setIsInitialized] = useState(false); // NEW
    const [listItems, setListItems] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [printerColumnValue, setPrinterColumnValue] = useState("Loading Printer..."); // NEW: State for fetched printer value
    const [printerColId, setPrinterColId] = useState(null); // NEW: State for Printer column ID
    const [optionSelected, setOptionSelected] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [initialShouldLoad, setInitialShouldLoad] = useState(false);
    const [colOptions, setColOptions] = useState([])
    const countRef = useRef();
    const [multiplier, setMultiplier] = useState(1);
    // NEW: Add states for printer dropdown
    const [printerOptions, setPrinterOptions] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState({});

    useEffect(() => {
        console.log("----App.js UseEffect #1----")
        // Notice this method notifies the monday platform that user gains a first value in an app.
        // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
        monday.execute("valueCreatedForUser");
    
        monday.listen("context", (res) => {
          console.log("useEffect storage res: ", res)
          setContext(res.data);
    
          // setShouldLoad(true)
    
          storageInstance.getItem('listItems_' + res.data.itemId).then(result1 => {
            setListItems(JSON.parse(result1.data.value) || []);  
            return storageInstance.getItem('listItems_' + res.data.itemId)
          }).then(result2 => {
            console.log("Loading Initial...")
            setListItems(JSON.parse(result2.data.value) || []);
            return storageInstance.getItem('totalCount_' + res.data.itemId)
          }).then(result3 => {
            const parsedCount = parseInt(result3.data.value)
            setTotalCount(parsedCount || 0);
            return storageInstance.getItem('selectedOption_'/* + res.data.itemId*/)
          }).then(result4 => { 
            setSelectedOption(JSON.parse(result4.data.value) || []);
          }).catch(error => { 
            console.log(error)
            // setShouldLoad(false)
          }).finally(() => { 
            // setShouldLoad(false)
          })

        console.log("ListInput: ", context)
    
        });
    
        
      }, []);

      useEffect(() => {
        if (context) {
          console.log("Parent Context 2", context)

            console.log("Context: ", context)
            const boardId = context.boardId;
            console.log("using boardID: ", context.boardId)
            
            const query = `query {
            boards(ids: ${boardId}) {
                columns {
                    id
                    title
                    type
                    settings_str
                }
            }
            }`;
            monday.api(query).then((res) => {
                console.log("ListInput res: ", res);
                const columns = res.data.boards[0].columns;
                console.log("Columns: ", columns);

                // Find the 'Printer' column ID
                const printerColumn = columns.find(col => col.title.includes("Printer"));
                if (printerColumn) {
                  setPrinterColId(printerColumn.id);
                  console.log("Found Printer column ID:", printerColumn.id);
                  
                  // NEW: Fetch printer column options if it's a dropdown-type column
                  if (printerColumn.type === 'color' || printerColumn.type === 'dropdown' || printerColumn.type === 'status') {
                    try {
                      // Parse the settings to get the dropdown options
                      const settings = JSON.parse(printerColumn.settings_str);
                      if (settings && settings.labels) {
                        const options = Object.entries(settings.labels).map(([value, label]) => ({
                          value,
                          label
                        }));
                        setPrinterOptions(options);
                        console.log("Printer options:", options);
                      }
                    } catch (e) {
                      console.error("Error parsing printer column settings:", e);
                    }
                  }
                } else {
                  console.error("Could not find column named 'Printer'");
                  setPrinterColumnValue("Error: 'Printer' column not found");
                }

                const filter = 'numbers'  //numbers
                const cols = columns.map(column => {                      
                    return {label: column.title, value: column.id, type: column.type}
                })
                console.log("cols: ", cols)
                const filteredCols = cols
                .filter(col => col.type.includes(filter))
                .map(col => {
                    return {label: col.label, value: col.value}
                })
                setColOptions(filteredCols)
                storageInstance.setItem(`colOptions`, JSON.stringify(cols)).then((res) => {
                    console.log("colOptions stored in board storage: ", res);
                })
            }).catch((err) => {
                console.log("Error fetching columns: ", err);
            }).finally(() => {
                // setShouldLoad(false)
            });
        }
        
      }, [context])

    // NEW
    // Modified useEffect to fetch existing value AND printer value
    useEffect(() => {
      // Ensure all necessary data is present before querying
      if (selectedOption?.value && context && printerColId) {
        const itemId = context.itemId;
        const targetColumnId = selectedOption.value;
        const columnsToFetch = [targetColumnId, printerColId]; // Fetch both target and printer columns

        console.log(`Fetching values for columns: ${columnsToFetch.join(', ')} for item: ${itemId}`);

        // Build the query to get column values
        const query = `query {
          items (ids: ${itemId}) {
            column_values (ids: ${JSON.stringify(columnsToFetch)}) {
              id
              value
              text
            }
          }
        }`;

        monday.api(query)
          .then((res) => {
            console.log("Target/Printer Column Values Response: ", res);
            if (res.data?.items?.length > 0 && res.data.items[0].column_values) {
              const columnValues = res.data.items[0].column_values;

              // Process Target Column (Total Count)
              const targetColumnData = columnValues.find(cv => cv.id === targetColumnId);
              if (targetColumnData) {
                const columnValue = targetColumnData.value;
                if (columnValue) {
                  let existingCount = 0;
                  try {
                    existingCount = JSON.parse(columnValue);
                  } catch (e) {
                    existingCount = parseInt(columnValue);
                  }
                  if (isNaN(existingCount)) {
                    existingCount = 0;
                  }
                  setTotalCount(existingCount);
                  console.log("Fetched Total Count:", existingCount);
                } else {
                  setTotalCount(0); // Reset if column is empty
                  console.log("Target column is empty, setting total count to 0.");
                }
              } else {
                 setTotalCount(0); // Reset if column data is missing
                 console.warn("Target column data not found in response.");
              }

              // Process Printer Column
              const printerColumnData = columnValues.find(cv => cv.id === printerColId);
              if (printerColumnData) {
                 // Prefer 'text' for dropdowns/status, fallback to 'value'
                 const printerVal = printerColumnData.text || (printerColumnData.value ? JSON.parse(printerColumnData.value) : null);
                 if (printerVal) {
                   setPrinterColumnValue(printerVal);
                   console.log("Fetched Printer Value:", printerVal);
                   
                   // NEW: Set the selected printer in the dropdown
                   // Find matching option from printerOptions based on text
                   if (printerOptions.length > 0) {
                     const matchingOption = printerOptions.find(option => 
                       option.label === printerVal || option.value === printerColumnData.value
                     );
                     if (matchingOption) {
                       setSelectedPrinter(matchingOption);
                       console.log("Set selected printer:", matchingOption);
                     }
                   }
                 } else {
                   setPrinterColumnValue("Printer N/A"); // Set default if empty
                   console.log("Printer column is empty, setting display to 'Printer N/A'.");
                 }
              } else {
                setPrinterColumnValue("Printer N/A"); // Set default if column data missing
                console.warn("Printer column data not found in response.");
              }

            } else {
               console.error("No items or column values found in response: ", res);
               setTotalCount(0);
               setPrinterColumnValue("Error Fetching Data");
            }
          })
          .catch((err) => {
            console.error("Error fetching column values: ", err);
            setTotalCount(0); // Reset on error
            setPrinterColumnValue("Error Fetching Printer");
          })
          .finally(() => {
            setIsInitialized(true); // Mark as initialized after attempting fetch
            console.log("Initialization fetch complete.");
          });
      } else if (context && !printerColId) {
          // Handle case where context is loaded but printerColId hasn't been found yet (e.g., column missing)
          setIsInitialized(true); // Still initialize, but with error state set in the other useEffect
      } else if (context && !selectedOption?.value) {
          // Handle case where context is loaded but no target column selected
          setTotalCount(0); // Reset total count if no target selected
          setIsInitialized(true);
          console.log("No target column selected, initializing total count to 0.");
          // We might still want to fetch the printer value if printerColId is known
          // Add separate fetch logic here or modify query if needed
      }
    }, [selectedOption, context, printerColId, printerOptions]); // Added printerOptions dependency



      const handleInput = (count) => {
        const countAsNum = parseInt(count);
        
        // Loop to add multiple batches
        const newItems = [];
        for (let i = 0; i < multiplier; i++) { // NEW: Loop based on multiplier
            const totalToAdd = countAsNum; // Each batch will have the same quantity
            const currentDate = new Date();
            const currentTime = currentDate.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true});
            const uniqueKey = Math.random().toString(36).substr(2, 9);
            const printerDisplay = printerColumnValue || "Printer N/A"; // Use fetched value or default
            const itemDisplayPos = "B" + (listItems.length + (i + 1)) + " | " + currentTime + " - " + 
                (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear() + "\n | " + printerDisplay;
            
            newItems.push({ uniqueKey, itemName: itemDisplayPos, itemCount: totalToAdd }); // Create new item for each batch
        }
    
        setListItems([...listItems, ...newItems]); // Add all new items at once
    
        setTotalCount(prevTotalCount => {
            console.log("new total: ", prevTotalCount);
            return parseInt(prevTotalCount) + (countAsNum * multiplier); // Update total count
        });
    
        console.log("handleInput Option: ", selectedOption);
      }
    
      const handleTotalReset = () => {
        setTotalCount(0)
      }
    
      const handleOptionsSelection = (evt) => {
        setSelectedOption(evt) 
      }
    
      // NEW: Handle printer dropdown selection
      const handlePrinterSelection = (evt) => {
        setSelectedPrinter(evt);
        
        // Update the printer column in Monday.com
        if (context && printerColId) {
          const boardId = context.boardId;
          const itemId = context.itemId;
          
          // Create query to update the printer column
          const query = `mutation {
            change_column_value(board_id: ${boardId}, item_id: ${itemId}, column_id: "${printerColId}", value: ${JSON.stringify(JSON.stringify({label: evt.label}))}) {
              id
            }
          }`;
          
          monday.api(query)
            .then((res) => {
              console.log("Printer column updated successfully:", res);
              // Update local state to reflect the change
              setPrinterColumnValue(evt.label);
            })
            .catch((err) => {
              console.error("Error updating printer column:", err);
            });
        }
      }
    
      const handleItemDelete = (itemName, itemCount, isChecked) => {
    
        setListItems(prevListItems => {
          const newListItems = prevListItems.filter(item => item.itemName !== itemName);
          prevListItems.map(item => console.log(item.itemName))
          // Update localStorage to store the new list items
          console.log("New Items", itemName)
          return newListItems;
        });
      
        setTotalCount(prevTotalCount => {
          let newTotalCount;
          if (!isChecked) {
            newTotalCount = prevTotalCount - parseInt(itemCount);
          } else {
            newTotalCount = prevTotalCount;
          }
          // Update localStorage to store the new total count
          return newTotalCount;
        });
      }
    
      const changeTotalCount = (isChecked, itemCount) => {
        console.log("isChecked type: ", typeof(isChecked))
        console.log("itemCount type: ", typeof(itemCount))
        setTotalCount(prevTotalCount => {
          if (isChecked) {
            return parseInt(prevTotalCount) - parseInt(itemCount);
          } else {
            return parseInt(prevTotalCount) + parseInt(itemCount);
          }
        })
    
        console.log("changeTotal Option: ", selectedOption)  
      }
    
      useEffect(() => {
        console.log("----App.js UseEffect #3----")
        if (context) {
          console.log("Context: ", context)
          setShouldLoad(true)
          storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems)
          ).catch(error => { 
            console.log(error)
            setShouldLoad(false)
          }).finally(() => { 
            console.log("Loading...")
            setTimeout(() => {
                setShouldLoad(false)
            }, 1000)
          });
          
        }
    
        
        
      }, [listItems]);

      useEffect(() => {
        if (isInitialized) {
          if (context) {
            // setShouldLoad(true)
            storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString())
            .catch(error => { 
                console.log(error)
                // setShouldLoad(false)
            }).finally(() => { 
                // setShouldLoad(false)
            });
        }

        if (selectedOption && context && totalCount != null) {
            console.log("Inner Context: ", selectedOption)
            const boardId = context.boardId
            console.log("using boardID: ", boardId)
            const query = `mutation {
              change_simple_column_value (board_id: ${boardId}, item_id: ${context.itemId}, column_id: "${selectedOption.value}", value: "${JSON.stringify(totalCount)}") {
                id
              }
            }`;
            
            monday.api(query)
              .then((res) => {
                console.log("Column updated successfully: ", res, "with ", totalCount);
              })
              .catch((err) => {
                console.log("Error updating column: ", err);
              });
          }
        }        
      }, [totalCount, isInitialized])
    
      // Update selectedOption in the board storage when it changes
      useEffect(() => {
        console.log("----App.js UseEffect #5----")
        if (context) {
          console.log("Context: ", context)
        //   setShouldLoad(true)
          storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(selectedOption)
          ).catch(error => { 
            console.log(error)
            setShouldLoad(false)
          }).finally(() => { 
            // setShouldLoad(false)
          });
          console.log("Option: ", selectedOption.value)
        }
        
        
      }, [selectedOption]);
    

    const handleClick = () => {
        const countVal = parseInt(countRef.current.value)
        handleInput(countVal)
    }

    const handleDeductClick = () => {
      const countVal = parseInt(countRef.current.value)
      handleInput(-countVal)
    }

    return (
        <div className="container">
            {console.log("Loading Remount")}
            <div className="row pb-3">
                <div className="col-3">
                    <Button onClick={handleTotalReset} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Reset Total</Button>
                </div>
                <div className="col-6 d-flex align-items-end">
                    { shouldLoad ? <Loader size={Loader.sizes.SMALL}></Loader> : null }
                </div>
                <div className="col-3">
                    <p className="text-end" style={{color: "grey"}}>Version 3</p>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <h4 style={{fontSize: "1rem"}}>Total Batches</h4>
                    <div className="row">
                        {/* <div className="col">
                            <h4>Total</h4>
                        </div> */}
                        <div className="col">
                            <Label text={totalCount}></Label>
                        </div>
                    </div>
                </div>  
                <div className="col-3">
                    
                </div>
                <div className="col-6">
                <h4 style={{fontSize: "1rem"}}>Output Column</h4>
                    <Dropdown placeholder="Target column" onChange={evt => handleOptionsSelection(evt)} options={colOptions} value={selectedOption}></Dropdown>
                </div>
            </div>
            <div className="row pt-4 pb-4">
                <div className="col-4 d-flex align-items-end">
                    <div style={{ marginBottom: '0px', width: '100%' }}>
                      {/* REPLACED: Label with Dropdown */}
                      <p style={{ marginBottom: '4px' }}>Printer</p>
                      <Dropdown 
                        placeholder="Select Printer" 
                        onChange={handlePrinterSelection} 
                        options={printerOptions} 
                        value={selectedPrinter}
                        disabled={printerOptions.length === 0}
                      />
                    </div>
                </div>
                <div className="col d-flex align-items-end">
                  <div>
                    <p style={{ marginBottom: '4px' }}>Multiplier</p>
                    <TextField type="number" value={multiplier} onChange={e => setMultiplier(parseInt(e) || 1)} placeholder="Multiplier" />
                  </div>
                </div>
                <div className="col d-flex align-items-end">
                   <div>
                    <p style={{ marginBottom: '4px' }}>Quantity</p>
                    <TextField ref={countRef} type="number" value="0" />
                  </div>
                </div>
                <div className="col-1 d-flex align-items-end">
                   <div className="row">
                     <Button disabled={shouldLoad ? true : false} onClick={handleClick} size={Button.sizes.SMALL} color={Button.colors.POSITIVE}>Add</Button>
                   </div>
                </div>
                <div className="col d-flex align-items-end">
                    <Button disabled={shouldLoad ? true : false} onClick={handleDeductClick} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Deduct</Button>
                </div>
            </div>
            <Divider></Divider>
            <div className="col-12">
                <List items={listItems} handleDelete={handleItemDelete}></List>
            </div> 
        </div>
    );
}

export default ListInputMod
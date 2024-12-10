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
    const [printerOptions, setPrinterOptions] = useState({})
    const [optionSelected, setOptionSelected] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [initialShouldLoad, setInitialShouldLoad] = useState(false);
    const [colOptions, setColOptions] = useState([])
    const nameRef = useRef();
    const countRef = useRef();
    const [multiplier, setMultiplier] = useState(1);
    const printerList = useMemo(() => ([
        {
            label: "Printer 1 (LEC2-640)",
            value: "printer1"
        },
        {
            label: "Printer 2 (LEC2-640)",
            value: "printer2",
        },
        {
            label: "Printer 3 (LEC2-640)",
            value: "printer3"
        },
        {
            label: "Printer 4 (LEC2-640)",
            value: "printer4"
        },
        {
            label: "Printer 5 (LEC2-640)",
            value: "printer5"
        },
        {
            label: "Printer 6 (MG-640)",
            value: "printer6"
        },
        {
          label: "Printer 7 (MG-640)",
          value: "printer7"
        },
        {
            label: "Printer 8 (MG-640)",
            value: "printer8"
        },
        {
          label: "Printer 9 (MG-640)",
          value: "printer9"
        },
        {
          label: "Printer 10 (MG-640)",
          value: "printer10"
        },
        {
          label: "Printer 11 (LG-640)",
          value: "printer11"
        },
        {
          label: "Printer 12 (LG-540)",
          value: "printer12"
        },
        {
          label: "Printer 13 (LG-640)",
          value: "printer13"
        },
        {
          label: "Printer 14 (LG-640)",
          value: "printer14"
        },
    ]), []);
    
    
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
            return storageInstance.getItem('printerOption_' + res.data.itemId)
          }).then(result5 => { 
            setPrinterOptions(JSON.parse(result5.data.value) || []);
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
                }
            }
            }`;
            monday.api(query).then((res) => {
                console.log("ListInput res: ", res);
                const columns = res.data.boards[0].columns;
                console.log("Columns: ", columns);
                const filter = 'numbers'
                const cols = columns.map(column => {                      
                    return {label: column.title, value: column.id}
                })
                console.log("cols: ", cols)
                const filteredCols = cols
                .filter(col => col.value.includes(filter))
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
    // New useEffect to fetch existing value from the output column
    useEffect(() => {
      if (selectedOption && context) {
        // Fetch the existing value from the selected output column for the current item
        const itemId = context.itemId;
        const columnId = selectedOption.value;

        // Build the query to get the column value
        const query = `query {
          items (ids: ${itemId}) {
            column_values (ids: "${columnId}") {
              value
              text
            }
          }
        }`;

        monday.api(query)
          .then((res) => {
            const columnValue = res.data.items[0].column_values[0].value;
            if (columnValue) {
              // Parse the value (it might be JSON)
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
            } else {
              setTotalCount(0);
            }
          })
          .catch((err) => {
            console.error("Error fetching column value: ", err);
          })
          .finally(() => {
            setIsInitialized(true);
          });
      }
    }, [selectedOption, context]);



      const handleInput = (name, count) => {
        console.log("count: ", totalCount);
        const countAsNum = parseInt(count);
        
        // Loop to add multiple batches
        const newItems = [];
        for (let i = 0; i < multiplier; i++) { // NEW: Loop based on multiplier
            const totalToAdd = countAsNum; // Each batch will have the same quantity
            const currentDate = new Date();
            const currentTime = currentDate.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true});
            const uniqueKey = Math.random().toString(36).substr(2, 9);
            const printerDisplay = printerOptions.label == undefined ? "Printer N/A" : printerOptions.label;
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
    
      const handlePrinterSelection = (evt) => {
        setPrinterOptions(evt)
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
    
      // Update printerOptions in the board storage when it changes
      useEffect(() => {
        console.log("----App.js UseEffect #6----")
        if (context) {
          console.log("Context: ", context)
        //   setShouldLoad(true)
          storageInstance.setItem('printerOption_' + context.itemId, JSON.stringify(printerOptions)
          ).catch(error => { 
            console.log(error)
            setShouldLoad(false)
          }).finally(() => { 
            // setShouldLoad(false)
          });
          console.log("Option: ", printerOptions.value)
        }
      }, [printerOptions])
    

    const handleClick = () => {
        const nameVal = nameRef.current.value
        const countVal = parseInt(countRef.current.value)
        handleInput(nameVal, countVal)
    }

    const handleDeductClick = () => {
      const nameVal = nameRef.current.value
      const countVal = parseInt(countRef.current.value)
      handleInput(nameVal, -countVal)
    }

    return (
        <div className="container">
            {console.log("Loading Remount")}
            <div className="row pb-3">
                <div className="col">
                    <Button onClick={handleTotalReset} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Reset Total</Button>
                </div>
                <div className="col">
                    <p style={{color: "grey"}}>Version 2.1.1</p>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <h4>Enter Batches</h4>
                </div>  
                <div className="col-3">
                    <div className="row">
                        {/* <div className="col">
                            <h4>Total</h4>
                        </div> */}
                        <div className="col">
                            <Label text={totalCount}></Label>
                        </div>
                    </div>
                    
                    
                </div>
                <div className="col-6">
                    <Dropdown placeholder="Target column" onChange={evt => handleOptionsSelection(evt)} options={colOptions} value={selectedOption}></Dropdown>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col-4">
                    <Dropdown placeholder="Printer" onChange={evt => handlePrinterSelection(evt)} options={printerList} value={printerOptions}></Dropdown>
                    <TextField disabled={true} ref={nameRef} type="text" placeholder="Batch name" />
                </div>
                <div className="col">
                  <div className="row">
                    <p>Multiplier</p>
                  </div>
                  <div className="row">
                    <TextField type="number" value={multiplier} onChange={e => setMultiplier(parseInt(e) || 1)} placeholder="Multiplier" /> {/* NEW: Input for multiplier */}
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <p>Quantity</p>
                  </div>
                  <div className="row">
                    <TextField ref={countRef} type="number" value="0" />  
                  </div>
                </div>
                <div className="col-1">
                    <Button disabled={shouldLoad ? true : false} onClick={handleClick} size={Button.sizes.SMALL} color={Button.colors.POSITIVE}>Add</Button>
                </div>
                <div className="col">
                    <Button disabled={shouldLoad ? true : false} onClick={handleDeductClick} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Deduct</Button>
                </div>
                <div className="col-1">
                    { shouldLoad ? <Loader size={Loader.sizes.SMALL}></Loader> : null }
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
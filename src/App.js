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
  // const [context, setContext] = useState();
  // const [listItems, setListItems] = useState([]);
  // // const [nameInput, setNameInput] = useState("")
  // // const [countInput, setCountInput] = useState()
  // const [totalCount, setTotalCount] = useState(0);
  // // const [colOptions, setColOptions] = useState([])
  // const [selectedOption, setSelectedOption] = useState({}); 
  // const [printerOptions, setPrinterOptions] = useState({})
  // const [optionSelected, setOptionSelected] = useState(false);
  // const [shouldLoad, setShouldLoad] = useState(false);
  // const [initialShouldLoad, setInitialShouldLoad] = useState(false);



  // const handleInput = (name, count) => {
  //   console.log("count: ", totalCount)
  //   const countAsNum = parseInt(count)
    
  //   setTotalCount(prevTotalCount => {
  //     console.log("new total: ", prevTotalCount)
  //     return parseInt(prevTotalCount) + countAsNum 
  //   })
  //   const currentDate = new Date()
  //   const currentTime = currentDate.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true})
  //   const uniqueKey = Math.random().toString(36).substr(2, 9);
  //   const printerDisplay = printerOptions.label == undefined ? "Printer N/A" : printerOptions.label
  //   const itemDisplayPos = "B" + (listItems.length + 1) + " | " + currentTime + " - " + 
  //     (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear() + "\n | " + printerDisplay
  //   const newItem = { uniqueKey: Math.random().toString(36).substr(2, 9), itemName: itemDisplayPos, itemCount: countAsNum };
  //   console.log("Key: ", uniqueKey)
  //   setListItems([...listItems, newItem])
    
    

  //   console.log("handleInput Option: ", selectedOption)
  // }

  // const handleTotalReset = () => {
  //   setTotalCount(0)
  // }

  // const handleOptionsSelection = (evt) => {
  //   setSelectedOption(evt) 
  //   setShouldLoad(true)
  //   storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(evt)
  //   ).catch(error => {
  //     console.log(error)
  //     setShouldLoad(false)
  //   }).finally(() => { 
  //     setShouldLoad(false)
  //   });
  //   console.log("handleOptions Option: ", evt) 
  // }

  // const handlePrinterSelection = (evt) => {
  //   setPrinterOptions(evt)
  //   setShouldLoad(true)
  //   storageInstance.setItem('printerOptions_' + context.itemId, JSON.stringify(evt)
  //   ).catch(error => {
  //     console.log(error)
  //     setShouldLoad(false)
  //   }).finally(() => {  
  //     setShouldLoad(false)
  //   });
  //   console.log("handleOptions Option: ", evt)
  // }

  // const handleItemDelete = (itemName, itemCount, isChecked) => {

  //   setListItems(prevListItems => {
  //     const newListItems = prevListItems.filter(item => item.itemName !== itemName);
  //     prevListItems.map(item => console.log(item.itemName))
  //     // Update localStorage to store the new list items
  //     console.log("New Items", itemName)
  //     return newListItems;
  //   });
  
  //   setTotalCount(prevTotalCount => {
  //     let newTotalCount;
  //     if (!isChecked) {
  //       newTotalCount = prevTotalCount - parseInt(itemCount);
  //     } else {
  //       newTotalCount = prevTotalCount;
  //     }
  //     // Update localStorage to store the new total count
  //     return newTotalCount;
  //   });
  // }

  // const changeTotalCount = (isChecked, itemCount) => {
  //   console.log("isChecked type: ", typeof(isChecked))
  //   console.log("itemCount type: ", typeof(itemCount))
  //   setTotalCount(prevTotalCount => {
  //     if (isChecked) {
  //       return parseInt(prevTotalCount) - parseInt(itemCount);
  //     } else {
  //       return parseInt(prevTotalCount) + parseInt(itemCount);
  //     }
  //   })

  //   console.log("changeTotal Option: ", selectedOption)  
  // }


  // useEffect(() => {
  //   console.log("----App.js UseEffect #1----")
  //   // Notice this method notifies the monday platform that user gains a first value in an app.
  //   // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
  //   monday.execute("valueCreatedForUser");

  //   monday.listen("context", (res) => {
  //     console.log("useEffect storage res: ", res)
  //     setContext(res.data);

  //     // setShouldLoad(true)

  //     storageInstance.getItem('listItems_' + res.data.itemId).then(result1 => {
  //       setListItems(JSON.parse(result1.data.value) || []);  
  //       return storageInstance.getItem('listItems_' + res.data.itemId)
  //     }).then(result2 => {
  //       setListItems(JSON.parse(result2.data.value) || []);
  //       return storageInstance.getItem('totalCount_' + res.data.itemId)
  //     }).then(result3 => {
  //       const parsedCount = parseInt(result3.data.value)
  //       setTotalCount(parsedCount || 0);
  //       return storageInstance.getItem('selectedOption_'/* + res.data.itemId*/)
  //     }).then(result4 => { 
  //       setSelectedOption(JSON.parse(result4.data.value) || []);
  //       return storageInstance.getItem('printerOption_' + res.data.itemId)
  //     }).then(result5 => { 
  //       setPrinterOptions(JSON.parse(result5.data.value) || []);
  //     }).catch(error => { 
  //       console.log(error)
  //       // setShouldLoad(false)
  //     }).finally(() => { 
  //       // setShouldLoad(false)
  //     })

  //     // storageInstance.getItem('listItems_' + res.data.itemId).then(response => {
  //     //   setListItems(JSON.parse(response.data.value) || []);  
  //     // }).catch(error => {
  //     //   console.log(error)
  //     //   // setShouldLoad(false)
  //     // })

  //     // storageInstance.getItem('totalCount_' + res.data.itemId).then(response => {
  //     //   console.log("Count Response: ", response.data.value)
  //     //   const parsedCount = parseInt(response.data.value)
  //     //   setTotalCount(parsedCount || 0);
  //     // }).catch(error => { 
  //     //   console.log(error)
  //     //   // setShouldLoad(false)
  //     // })

  //     // storageInstance.getItem('selectedOption_'/* + res.data.itemId*/).then(response => {
  //     //   console.log("Option Response: ", response)
  //     //   setSelectedOption(JSON.parse(response.data.value) || []);
  //     // }).catch(error => { 
  //     //   console.log(error)
  //     //   // setShouldLoad(false)
  //     // })

  //     // storageInstance.getItem('printerOption_' + res.data.itemId).then(response => {
  //     //   console.log("Printer Response: ", response.data.value)
  //     //   setPrinterOptions(JSON.parse(response.data.value) || []);
  //     // }).catch(error => { 
  //     //   console.log(error)
  //     // }).finally(() => {
  //     //   setShouldLoad(false)
  //     // });

  //   });

    
  // }, []);

  // // useEffect(() => { 
  // //   console.log("----App.js UseEffect #2----")
  // //   if (selectedOption && context && totalCount != null) {
  // //     console.log("Inner Context: ", selectedOption)
  // //     const boardId = context.boardId
  // //     console.log("using boardID: ", boardId)
  // //     const query = `mutation {
  // //       change_simple_column_value (board_id: ${boardId}, item_id: ${context.itemId}, column_id: "${selectedOption.value}", value: "${JSON.stringify(totalCount)}") {
  // //         id
  // //       }
  // //     }`;
      
  // //     monday.api(query)
  // //       .then((res) => {
  // //         console.log("Column updated successfully: ", res, "with ", totalCount);
  // //       })
  // //       .catch((err) => {
  // //         console.log("Error updating column: ", err);
  // //       });
  // //   }
    
    
  // // }, [totalCount]);

  // // Update listItems in the board storage when it changes
  // // useEffect(() => {
  // //   console.log("----App.js UseEffect #3----")
  // //   if (context) {
  // //     console.log("Context: ", context)
  // //     setShouldLoad(true)
  // //     storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems)
  // //     ).catch(error => { 
  // //       console.log(error)
  // //       setShouldLoad(false)
  // //     }).finally(() => { 
  // //       setShouldLoad(false)
  // //     });
      
  // //   }
    
  // // }, [listItems]);

  // useEffect(() => {
  //   console.log("----App.js UseEffect #3----")
  //   if (context) {
  //     console.log("Context: ", context)
  //     setShouldLoad(true)
  //     storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems)
  //     ).then(result1 => { 
  //       return storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString())
  //     }).catch(error => { 
  //       console.log(error)
  //       setShouldLoad(false)
  //     }).finally(() => { 
  //       setShouldLoad(false)
  //     });

  //     // storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString()
  //     // ).catch(error => { 
  //     //   console.log(error)
  //     //   // setShouldLoad(false)
  //     // }).finally(() => { 
  //     //   setShouldLoad(false)
  //     // });
      
  //   }

  //   if (selectedOption && context && totalCount != null) {
  //     console.log("Inner Context: ", selectedOption)
  //     const boardId = context.boardId
  //     console.log("using boardID: ", boardId)
  //     const query = `mutation {
  //       change_simple_column_value (board_id: ${boardId}, item_id: ${context.itemId}, column_id: "${selectedOption.value}", value: "${JSON.stringify(totalCount)}") {
  //         id
  //       }
  //     }`;
      
  //     monday.api(query)
  //       .then((res) => {
  //         console.log("Column updated successfully: ", res, "with ", totalCount);
  //       })
  //       .catch((err) => {
  //         console.log("Error updating column: ", err);
  //       });
  //   }
    
  // }, [listItems, totalCount]);

  // // Update totalCount in the board storage when it changes
  // // useEffect(() => {
  // //   console.log("----App.js UseEffect #4----")
  // //   if (context) {
  // //     console.log("Context: ", context)
  // //     setShouldLoad(true)
  // //     storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString()
  // //     ).catch(error => { 
  // //       console.log(error)
  // //       setShouldLoad(false)
  // //     }).finally(() => { 
  // //       setShouldLoad(false)
  // //     });
  // //     // localStorage.setItem('totalCount_' + context.itemId, totalCount.toString());
      
  // //   }
    
  // // }, [totalCount]);

  // // Update selectedOption in the board storage when it changes
  // useEffect(() => {
  //   console.log("----App.js UseEffect #5----")
  //   if (context) {
  //     console.log("Context: ", context)
  //     // setShouldLoad(true)
  //     storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(selectedOption)
  //     ).catch(error => { 
  //       console.log(error)
  //       // setShouldLoad(false)
  //     }).finally(() => { 
  //       // setShouldLoad(false)
  //     });
  //     console.log("Option: ", selectedOption.value)
  //   }
    
    
  // }, [selectedOption]);

  // // Update printerOptions in the board storage when it changes
  // useEffect(() => {
  //   console.log("----App.js UseEffect #6----")
  //   if (context) {
  //     console.log("Context: ", context)
  //     // setShouldLoad(true)
  //     storageInstance.setItem('printerOption_' + context.itemId, JSON.stringify(printerOptions)
  //     ).catch(error => { 
  //       console.log(error)
  //       // setShouldLoad(false)
  //     }).finally(() => { 
  //       // setShouldLoad(false)
  //     });
  //     console.log("Option: ", printerOptions.value)
  //   }
  // }, [printerOptions])


  // useEffect(() => {
  //   console.log("----App.js UseEffect #7----")
  //   if (context) {
  //     const storedSelectedOption = storageInstance.getItem('selectedOption_'/* + context.itemId*/).then(response => {
  //       if (response.data && response.data.value) {
  //         const defaultSelectedOption = JSON.parse(storedSelectedOption);
  //         handleOptionsSelection(defaultSelectedOption);
  //       }
  //     })
  //     // const storedSelectedOption = storageInstance.getItem('selectedOption_' + context.itemId);
  //     // if (storedSelectedOption) {
  //     //   // Set it as the default selected option
  //     //   // You may need to adapt this part to match the data structure of your `Dropdown` component
  //     //   const defaultSelectedOption = JSON.parse(storedSelectedOption);
  //     //   handleOptionsSelection(defaultSelectedOption);
  //     // }
  //   }
    
  // }, [])


  
  return (
    <div className="App container">
      <div className="row">
        <div className="col-12 py-3">
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
            // nameHandler={evt => updateNameValue(evt)} 
            // nameValue={nameInput}
            // countHandler={evt => updateCountValue(evt)} 
            // countValue={countInput}
            >
          </ListInputMod>
          
        </div>
        {/* <Divider></Divider>
        <div className="col-12">
          <List items={listItems} handleDelete={handleItemDelete} parentContext={context} handleTotalCount={changeTotalCount}></List>
        </div>  */}
      </div>
    </div>
  );
};
export default App;

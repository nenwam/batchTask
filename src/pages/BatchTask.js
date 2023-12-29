import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import List from "../modules/List.js"
import ListInput from "../modules/ListInput.js";
import { Divider, Label, Loader } from "monday-ui-react-core"
import {Link , useNavigate, useHistory } from "react-router-dom";
import { useData } from '../modules/DataContext';
import { useDispatch } from 'react-redux'

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
// monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");
const storageInstance = monday.storage.instance;

const BatchTask = () => {
  const [context, setContext] = useState();
  const [listItems, setListItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState({}); 
  const [printerOptions, setPrinterOptions] = useState({})
  const [themeSetting, setThemeSetting] = useState();
  const [optionSelected, setOptionSelected] = useState(false);
  const [totalBatches, setTotalBatches] = useState();
  const [shouldLoad, setShouldLoad] = useState(false);

  

  const handleInput = (name, count) => {
    console.log("count: ", totalCount)
    const countAsNum = parseInt(count)
    
    setTotalCount(prevTotalCount => {
      console.log("new total: ", prevTotalCount)
      return parseInt(prevTotalCount) + countAsNum 
    })
    const currentDate = new Date()
    const currentTime = currentDate.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true})
    const uniqueKey = Math.random().toString(36).substr(2, 9);
    const itemDisplayPos = "B" + (listItems.length + 1) + " | " + currentTime + " - " + 
      (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear()
    const newItem = { uniqueKey: Math.random().toString(36).substr(2, 9), itemName: itemDisplayPos, itemCount: countAsNum };
    console.log("Key: ", uniqueKey)
    setListItems([...listItems, newItem])
    setTotalBatches(prevTotalItems => {
      return prevTotalItems + 1
    })
    setShouldLoad(true)
    console.log("BatchTask totalBatches: ", totalBatches)
    console.log("handleInput Option: ", selectedOption)
  }

  const handleTotalReset = () => {
    setTotalCount(0)
  }

  const handleOptionsSelection = (evt) => {
    setSelectedOption(evt) 
    storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(evt));
    console.log("handleOptions Option: ", evt) 
  }

  const handlePrinterSelection = (evt) => {
    setPrinterOptions(evt)
    storageInstance.setItem('printerOptions_' + context.itemId, JSON.stringify(evt));
    console.log("handleOptions Option: ", evt)
  }

  const handleItemDelete = (itemName, itemCount, isChecked) => {
    setShouldLoad(true)
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
    console.log("----App.js UseEffect #1----")
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    monday.listen("context", (res) => {
      console.log("useEffect storage res: ", res)
      setContext(res.data);
      setThemeSetting(res.data.theme)

      storageInstance.getItem('listItems_' + res.data.itemId).then(response => {
        setListItems(JSON.parse(response.data.value) || []);  
      });
      storageInstance.getItem('totalCount_' + res.data.itemId).then(response => {
        console.log("Count Response: ", response.data.value)
        const parsedCount = parseInt(response.data.value)
        setTotalCount(parsedCount || 0);
      });
      storageInstance.getItem('selectedOption_'/* + res.data.itemId*/).then(response => {
        console.log("Option Response: ", response)
        setSelectedOption(JSON.parse(response.data.value) || []);
        // if (response.data && response.data.value) {
        //   const defaultSelectedOption = JSON.parse(storedSelectedOption);
        //   handleOptionsSelection(defaultSelectedOption);
        // }
      });
      storageInstance.getItem('printerOption_' + res.data.itemId).then(response => {
        console.log("Printer Response: ", response.data.value)
        setPrinterOptions(JSON.parse(response.data.value) || []);
      });
      storageInstance.getItem('totalBatches_').then(response => { 
        console.log("Total Batches Response res: ", response)
        console.log("Total Batches Response: ", response.data.value)
        setTotalBatches(JSON.parse(response.data.value));
      });
      storageInstance.getItem('themeSetting_').then(response => {
        console.log("Theme Response: ", response)
        console.log("Theme Response: ", response.data.value)
        setThemeSetting(JSON.parse(response.data.value));
      })
    });

    
  }, []);

  useEffect(() => { 
    console.log("----App.js UseEffect #2----")
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
    setShouldLoad(false)
  }, [totalCount]);

  // Update listItems in the board storage when it changes
  useEffect(() => {
    console.log("----App.js UseEffect #3----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
    }
    
  }, [listItems]);

  // Update totalCount in the board storage when it changes
  useEffect(() => {
    console.log("----App.js UseEffect #4----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString());
    }
    
  }, [totalCount]);


  // Update selectedOption in the board storage when it changes
  useEffect(() => {
    console.log("----App.js UseEffect #5----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(selectedOption));
      console.log("Option: ", selectedOption.value)
    }
    
    
  }, [selectedOption]);


  // Update printerOptions in the board storage when it changes
  useEffect(() => {
    console.log("----App.js UseEffect #6----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('printerOption_' + context.itemId, JSON.stringify(printerOptions));
      console.log("Option: ", printerOptions.value)
    }
  }, [printerOptions])


  // Update totalBatches in the board storage when it changes
  useEffect(() => {
    
    console.log("----App.js UseEffect #7----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('totalBatches_', JSON.stringify(totalBatches));
    }
    console.log("Total Batches: ", totalBatches)
  }, [totalBatches])

  // Update themeSetting in the board storage when it changes (for dark/light/black mode)
  useEffect(() => {
    
    console.log("----App.js UseEffect #8----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('themeSetting_', JSON.stringify(themeSetting));
    }
    console.log("Total Batches: ", themeSetting)
  }, [themeSetting])



  // useEffect(() => {
  //   console.log("----App.js UseEffect #8----")
  //   if (context) {
  //     const storedSelectedOption = storageInstance.getItem('selectedOption_'/* + context.itemId*/).then(response => {
  //       if (response.data && response.data.value) {
  //         const defaultSelectedOption = JSON.parse(storedSelectedOption);
  //         handleOptionsSelection(defaultSelectedOption);
  //       }
  //     })
  //   }
    
  // }, [])

  const testSub = () => {

    // const query = "query { app_subscription { billing_period days_left is_trial plan_id renewal_date } }";
    const query = "query { app_subscription { plan_id } }";
    monday.api(query)
    .then((res) => {
      console.log("Subscription: ", res);
    })
    .catch((err) => {
      console.log("Error finding subscription: ", err);
    });
    
  }

  // testSub()

  const lightMode = <div className="App container mt-5">
                      <div className="row pt-5">
                        <div className="col-12 py-3">
                          {context && <ListInput 
                            // nameHandler={evt => updateNameValue(evt)} 
                            // nameValue={nameInput}
                            // countHandler={evt => updateCountValue(evt)} 
                            // countValue={countInput}
                            totalCount={totalCount} 
                            dropdownHandler={evt => handleOptionsSelection(evt)}
                            clickFunction={handleInput}
                            resetTotalFunction={handleTotalReset}
                            parentContext={context}
                            disabledCheck={selectedOption.value !== undefined ? false : true }
                            selectedVal={selectedOption}
                            batches={totalBatches}>
                          </ListInput>}
                        </div>
                        {context && context.user.isViewOnly ? <Label color="negative" text="As a viewer, you are unable to use this app"></Label> : null}
                        <Divider></Divider>
                        <div className="col-12">
                          
                          {context && !shouldLoad ? <List items={listItems} handleDelete={handleItemDelete} parentContext={context} handleTotalCount={changeTotalCount}></List> : <Loader hasBackground size={40} />}
                        </div> 
                        <div className="row">
                          <div className="col text-center">
                              <p><a href="https://rallyessentials.com/get-in-touch/">Send us your feedback</a></p>
                          </div>
                          <div className="col text-center">
                              <p><a href="#">Documentation</a></p>
                          </div>
                          <div className="col text-center">
                              <p><a href="https://rallyessentials.com/get-in-touch/">Email Support</a></p>
                          </div>
                      </div>
                      </div>
                      
                    </div>;
  
  const darkMode = <div className="App container mt-5" style={{background: '#505050'}}> 
                      <div className="row pt-5" style={{background: '#505050'}}>
                        <div className="col-12 py-3" style={{background: '#505050', color: 'white'}}>
                          {context && <ListInput 
                            // nameHandler={evt => updateNameValue(evt)} 
                            // nameValue={nameInput}
                            // countHandler={evt => updateCountValue(evt)} 
                            // countValue={countInput}
                            style={{color: 'white'}}
                            totalCount={totalCount} 
                            dropdownHandler={evt => handleOptionsSelection(evt)}
                            clickFunction={handleInput}
                            resetTotalFunction={handleTotalReset}
                            parentContext={context}
                            disabledCheck={selectedOption.value !== undefined ? false : true }
                            selectedVal={selectedOption}
                            batches={totalBatches}
                            theme={themeSetting}>
                          </ListInput>}
                        </div>
                        {context && context.user.isViewOnly ? <Label color="negative" text="As a viewer, you are unable to use this app"></Label> : null}
                        <Divider></Divider>
                        <div className="col-12">
                          {context && !shouldLoad ? <List theme={themeSetting} items={listItems} handleDelete={handleItemDelete} parentContext={context} handleTotalCount={changeTotalCount}></List> : <Loader hasBackground size={40} />}
                        </div> 
                        <div className="row">
                          <div className="col text-center">
                              <p><a href="https://rallyessentials.com/get-in-touch/">Send us your feedback</a></p>
                          </div>
                          <div className="col text-center">
                              <p><a href="#">Documentation</a></p>
                          </div>
                          <div className="col text-center">
                              <p><a href="https://rallyessentials.com/get-in-touch/">Email Support</a></p>
                          </div>
                      </div>
                      </div>
                      
                    </div>;
  
  return (
    
    themeSetting === "light" ? lightMode : darkMode
    
  );
};
export default BatchTask;

import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import List from "./modules/List.js"
import ListInput from "./modules/ListInput.js";
import { Divider } from "monday-ui-react-core"

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5MTI1MjEwNSwiYWFpIjoxMSwidWlkIjo1MDY1MzM4MSwiaWFkIjoiMjAyMy0xMC0yM1QyMToyNzo1Ni4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTkzNTI3OTYsInJnbiI6InVzZTEifQ.IxSCkDC63caJ9dP_HobxQpVMEWXSJUDi-vcyRozQnKA");
const storageInstance = monday.storage.instance;

const App = () => {
  const [context, setContext] = useState();
  const [listItems, setListItems] = useState([]);
  // const [nameInput, setNameInput] = useState("")
  // const [countInput, setCountInput] = useState()
  const [totalCount, setTotalCount] = useState(0);
  // const [colOptions, setColOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState({}); 
  const [printerOptions, setPrinterOptions] = useState({})
  const [optionSelected, setOptionSelected] = useState(false);



  const handleInput = (name, count) => {
    console.log("count: ", totalCount)
    const countAsNum = parseInt(count)
    // const newTotalCount = totalCount + countAsNum
    
    setTotalCount(prevTotalCount => {
      console.log("new total: ", prevTotalCount)
      return parseInt(prevTotalCount) + countAsNum 
    })
    const currentDate = new Date()
    const currentTime = currentDate.toLocaleTimeString('en-US', {timeStyle: 'short', hour12: true})
    const uniqueKey = Math.random().toString(36).substr(2, 9);
    const printerDisplay = printerOptions.label == undefined ? "Printer N/A" : printerOptions.label
    const itemDisplayPos = "B" + (listItems.length + 1) + " | " + currentTime + " - " + 
      (currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear() + "\n | " + printerDisplay
    const newItem = { uniqueKey: Math.random().toString(36).substr(2, 9), itemName: itemDisplayPos, itemCount: countAsNum };
    console.log("Key: ", uniqueKey)
    setListItems([...listItems, newItem])
    // setListItems([...listItems, <ListItem key={uniqueKey} itemName={nameInput} itemCount={countInput} handleDelete={handleItemDelete} handleTotalCount={changeTotalCount}></ListItem>])
    // setNameInput("")
    // setCountInput()
    console.log("handleInput Option: ", selectedOption)
  }

  const handleTotalReset = () => {
    setTotalCount(0)
  }

  const handleOptionsSelection = (evt) => {
    setSelectedOption(evt) 
    storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(evt));
    // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
    console.log("handleOptions Option: ", evt) 
  }

  const handlePrinterSelection = (evt) => {
    setPrinterOptions(evt)
    storageInstance.setItem('printerOptions_' + context.itemId, JSON.stringify(evt));
    // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
    console.log("handleOptions Option: ", evt)
  }

  const handleItemDelete = (itemName, itemCount, isChecked) => {
    setListItems(prevListItems => {
      const newListItems = prevListItems.filter(item => item.itemName !== itemName);
      prevListItems.map(item => console.log(item.itemName))
      // Update localStorage to store the new list items
      console.log("New Items", itemName)
      // storageInstance.setItem('listItems', JSON.stringify(newListItems));  -- NEWEST
      // localStorage.setItem('listItems', JSON.stringify(newListItems));
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
      // storageInstance.setItem('totalCount', newTotalCount); -- NEWEST
      // localStorage.setItem('totalCount', newTotalCount);
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
    // setTimeout(() => {}, 2000)

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

      storageInstance.getItem('listItems_' + res.data.itemId).then(response => {
        // console.log("Item Response: ", response)
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
      });
      storageInstance.getItem('printerOption_' + res.data.itemId).then(response => {
        console.log("Printer Response: ", response.data.value)
        setPrinterOptions(JSON.parse(response.data.value) || []);
      });
    });

    
  }, [/*listItems, colOptions*/]);

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
  }, [totalCount/*, selectedOption,context*/]);

  useEffect(() => {
    console.log("----App.js UseEffect #3----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
      // localStorage.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
    }
    
  }, [listItems/*, context*/]);

  useEffect(() => {
    console.log("----App.js UseEffect #4----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString());
      // localStorage.setItem('totalCount_' + context.itemId, totalCount.toString());
    }
    
  }, [totalCount/*, context*/]);

  useEffect(() => {
    console.log("----App.js UseEffect #5----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('selectedOption_'/* + context.itemId*/, JSON.stringify(selectedOption));
      // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
      console.log("Option: ", selectedOption.value)
    }
    
    
  }, [selectedOption/*, context*/]);

  useEffect(() => {
    console.log("----App.js UseEffect #6----")
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('printerOption_' + context.itemId, JSON.stringify(printerOptions));
      // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
      console.log("Option: ", printerOptions.value)
    }
  }, [printerOptions])

  useEffect(() => {
    console.log("----App.js UseEffect #7----")
    if (context) {
      const storedSelectedOption = storageInstance.getItem('selectedOption_'/* + context.itemId*/).then(response => {
        if (response.data && response.data.value) {
          const defaultSelectedOption = JSON.parse(storedSelectedOption);
          handleOptionsSelection(defaultSelectedOption);
        }
      })
      // const storedSelectedOption = storageInstance.getItem('selectedOption_' + context.itemId);
      // if (storedSelectedOption) {
      //   // Set it as the default selected option
      //   // You may need to adapt this part to match the data structure of your `Dropdown` component
      //   const defaultSelectedOption = JSON.parse(storedSelectedOption);
      //   handleOptionsSelection(defaultSelectedOption);
      // }
    }
    
  }, [])


  
  return (
    <div className="App container">
      <div className="row mt-5">
        <div className="col-12 py-3 mt-5">
          {context && <ListInput 
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
            printerVal={printerOptions}>
          </ListInput>}
        </div>
        <Divider></Divider>
        <div className="col-12">
          { context && <List items={listItems} handleDelete={handleItemDelete} parentContext={context} handleTotalCount={changeTotalCount}></List>}
        </div> 
      </div>
    </div>
  );
};
export default App;

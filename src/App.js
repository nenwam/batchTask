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
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");
const storageInstance = monday.storage.instance;

const App = () => {
  const [context, setContext] = useState();
  const [listItems, setListItems] = useState([]);
  const [nameInput, setNameInput] = useState("")
  const [countInput, setCountInput] = useState()
  const [totalCount, setTotalCount] = useState(0);
  // const [colOptions, setColOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState({}); 
  const [optionSelected, setOptionSelected] = useState(false);

  const handleInput = () => {
    setTotalCount(totalCount + parseInt(countInput))
    const uniqueKey = Math.random().toString(36).substr(2, 9);
    const newItem = { uniqueKey: Math.random().toString(36).substr(2, 9), itemName: nameInput, itemCount: countInput };
    console.log("Key: ", uniqueKey)
    setListItems([...listItems, newItem])
    // setListItems([...listItems, <ListItem key={uniqueKey} itemName={nameInput} itemCount={countInput} handleDelete={handleItemDelete} handleTotalCount={changeTotalCount}></ListItem>])
    setNameInput("")
    setCountInput()
    console.log("Option: ", selectedOption)
  }

  const handleTotalReset = () => {
    setTotalCount(0)
  }

  const handleOptionsSelection = (evt) => {
    setSelectedOption(evt) 
    storageInstance.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
    // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
    console.log("Option: ", evt) 
  }

  const handleItemDelete = (itemName, itemCount, isChecked) => {
    // setListItems(prevListItems => prevListItems.filter(item => item.itemName !== itemName));
    // setTotalCount(prevTotalCount => {
    //   console.log("PrevTotal Count: ", prevTotalCount)
    //   if (!isChecked) {
    //     return prevTotalCount - parseInt(itemCount)
    //   } else if (isChecked) {
    //     return prevTotalCount
    //   }
      
    // });
    setListItems(prevListItems => {
      const newListItems = prevListItems.filter(item => item.itemName !== itemName);
      prevListItems.map(item => console.log(item.itemName))
      // Update localStorage to store the new list items
      console.log("New Items", itemName)
      storageInstance.setItem('listItems', JSON.stringify(newListItems));
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
      storageInstance.setItem('totalCount', newTotalCount);
      // localStorage.setItem('totalCount', newTotalCount);
      return newTotalCount;
    });
  }


  const changeTotalCount = (isChecked, itemCount) => {
    setTotalCount(prevTotalCount => {
      if (isChecked) {
        return prevTotalCount - parseInt(itemCount);
      } else {
        return prevTotalCount + parseInt(itemCount);
      }
    })

    console.log("Option: ", selectedOption)  
  }


  const updateNameValue = (evt) => {
    setNameInput(evt);
  }


  const updateCountValue = (evt) => {
    setCountInput(evt);
  }


  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    monday.execute("valueCreatedForUser");

    // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    monday.listen("context", (res) => {
      console.log("res: ", res)
      setContext(res.data);

      storageInstance.getItem('listItems_' + res.data.itemId).then(response => {
        console.log("Response: ", response)
        setListItems(JSON.parse(response.data.value) || []);
      });
      storageInstance.getItem('totalCount_' + res.data.itemId).then(response => {
        setTotalCount(JSON.parse(response.data.value) || []);
      });
      storageInstance.getItem('selectedOption_' + res.data.itemId).then(response => {
        setSelectedOption(JSON.parse(response.data.value) || []);
      });

      // const localListItems = JSON.parse(localStorage.getItem('listItems_' + res.data.itemId)) || []
      // setListItems(localListItems)
      // const localTotalCount = parseInt(localStorage.getItem('totalCount_' + res.data.itemId)) || 0
      // setTotalCount(localTotalCount)
      // const localSelectedOption = JSON.parse(localStorage.getItem('selectedOption_' + res.data.itemId)) || {}
      // setSelectedOption(localSelectedOption)
    });

    if (context) {
      // console.log("Context: ", context)
      // const boardId = context.boardId;
      
      // const query = `query {
      //   boards(ids: ${boardId}) {
      //     columns {
      //       id
      //       title
      //     }
      //   }
      // }`;
      // monday.api(query).then((res) => {
      //   console.log("res: ", res);
      //   const columns = res.data.boards[0].columns;
      //   console.log("Columns: ", columns);
      //   const cols = columns.map(column => {
      //       return {label: column.title, value: column.id}
      //   })
      //   console.log("cols: ", cols)
      //   setColOptions(cols)
      // }).catch((err) => {
      //   console.log("Error fetching columns: ", err);
      // });
    }
    
    
    // console.log("inputTotal:", parseInt(totalCount))
    
  }, [/*listItems, colOptions*/]);

  useEffect(() => { // Need to make it so that the add item deletes the previous item input and so that the subitems can be selected rather than just items
    if (selectedOption && context && totalCount != null) {
      console.log("Inner Context: ", selectedOption)
      const query = `mutation {
        change_simple_column_value (board_id: ${context.boardId}, item_id: ${context.itemId}, column_id: "${selectedOption.value}", value: "${JSON.stringify(totalCount)}") {
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
  }, [totalCount, selectedOption]);

  useEffect(() => {
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
      // localStorage.setItem('listItems_' + context.itemId, JSON.stringify(listItems));
    }
    
  }, [listItems/*, context*/]);

  useEffect(() => {
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('totalCount_' + context.itemId, totalCount.toString());
      // localStorage.setItem('totalCount_' + context.itemId, totalCount.toString());
    }
    
  }, [totalCount/*, context*/]);

  useEffect(() => {
    if (context) {
      console.log("Context: ", context)
      storageInstance.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
      // localStorage.setItem('selectedOption_' + context.itemId, JSON.stringify(selectedOption));
      console.log("Option: ", selectedOption.value)
    }
    
    
  }, [selectedOption/*, context*/]);

  useEffect(() => {
    if (context) {
      // const storedSelectedOption = localStorage.getItem('selectedOption_' + context.itemId);
      const storedSelectedOption = storageInstance.getItem('selectedOption_' + context.itemId);
      if (storedSelectedOption) {
        // Set it as the default selected option
        // You may need to adapt this part to match the data structure of your `Dropdown` component
        const defaultSelectedOption = JSON.parse(storedSelectedOption);
        handleOptionsSelection(defaultSelectedOption);
      }
    }
    
  }, [])


  
  return (
    <div className="App container">
      <div className="row">
        <div className="col-12 py-3">
          <ListInput 
            nameHandler={evt => updateNameValue(evt)} 
            nameValue={nameInput}
            countHandler={evt => updateCountValue(evt)} 
            countValue={countInput}
            totalCount={totalCount} 
            dropdownHandler={evt => handleOptionsSelection(evt)}
            clickFunction={handleInput}
            resetTotalFunction={handleTotalReset}
            disabledCheck={selectedOption.value !== undefined ? false : true }>
          </ListInput>
        </div>
        <Divider></Divider>
        <div className="col-12">
          <List items={listItems} handleDelete={handleItemDelete} handleTotalCount={changeTotalCount}></List>
        </div> 
      </div>
    </div>
  );
};
export default App;

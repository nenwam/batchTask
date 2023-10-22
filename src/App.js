import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
import List from "./modules/List.js"
import ListItem from "./modules/ListItem.js";
import ListInput from "./modules/ListInput.js";
import { Divider } from "monday-ui-react-core"

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/
const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");

const App = () => {
  const [context, setContext] = useState();
  const [listItems, setListItems] = useState([])
  const [nameInput, setNameInput] = useState("")
  const [countInput, setCountInput] = useState()
  const [totalCount, setTotalCount] = useState(0)
  const [colOptions, setColOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState({})  

  const handleInput = () => {
    setTotalCount(totalCount + parseInt(countInput))
    const uniqueKey = Math.random().toString(36).substr(2, 9);
    console.log("Key: ", uniqueKey)
    setListItems([...listItems, <ListItem key={uniqueKey} itemName={nameInput} itemCount={countInput} handleDelete={handleItemDelete} handleTotalCount={changeTotalCount}></ListItem>])
    setNameInput("")
    setCountInput()
    console.log("Option: ", selectedOption)
  }

  const handleOptionsSelection = (evt) => {
    setSelectedOption(evt) 
    console.log("Option: ", evt) 
  }

  const handleItemDelete = (itemName, itemCount, isChecked) => {
    setListItems(prevListItems => prevListItems.filter(item => item.key !== itemName));
    setTotalCount(prevTotalCount => {
      if (!isChecked) {
        return prevTotalCount - parseInt(itemCount)
      } else if (isChecked) {
        return prevTotalCount
      }
      
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
      // console.log("res: ", res)
      setContext(res.data);
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
    
  }, [listItems, colOptions]);

  useEffect(() => { // Need to make it so that the add item deletes the previous item input and so that the subitems can be selected rather than just items
    if (selectedOption && context && totalCount != null) {
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



  //Some example what you can do with context, read more here: https://developer.monday.com/apps/docs/mondayget#requesting-context-and-settings-data
  const attentionBoxText = `Hello, your user_id is: ${
    context ? context.user.id : "still loading"
  }.
  Let's start building your amazing app, which will change the world!`;


  
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
            clickFunction={handleInput}>
          </ListInput>
        </div>
        <Divider></Divider>
        <div className="col-12">
          <List items={listItems}></List>
        </div> 
      </div>
    </div>
  );
};
export default App;

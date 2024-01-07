import React from "react"
import mondaySdk from "monday-sdk-js";
import { Checkbox, Label, Divider, IconButton } from "monday-ui-react-core"
import { Erase } from "monday-ui-react-core/icons" 
import { useState, useEffect } from "react";

const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");

const ListItem = ({itemName, itemCount, handleDelete}) => {
    const [isChecked, setIsChecked] = useState(false);
    // const [context, setContext] = useState();
    // const {context } = parentContext;

    // useEffect(() => {
    //     // Notice this method notifies the monday platform that user gains a first value in an app.
    //     // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    //     monday.execute("valueCreatedForUser");
    
    //     // TODO: set up event listeners, Here`s an example, read more here: https://developer.monday.com/apps/docs/mondaylisten/
    //     monday.listen("context", (res) => {
    //       // console.log("res: ", res)
    //       setContext(res.data);
    //     });
        
    //   }, [/*context*/]);

    // useEffect(() => {
    //     // Read isChecked state from localStorage when the component mounts
    //     console.log("ListItem Context: " , context)
    //     const storedIsChecked = context ? localStorage.getItem(`isChecked-${itemName}_${context.itemId}`) : null;
    //     if (storedIsChecked !== null) {
    //       setIsChecked(JSON.parse(storedIsChecked));
    //     }
    
    //     // Save isChecked state to localStorage whenever it changes
    //     if (context) {
    //         localStorage.setItem(`isChecked-${itemName}_${context.itemId}`, JSON.stringify(isChecked));
    //     }
    //   }, [itemName, context]);




    return (
        <div className="container align-middle">
            <div className="row">
                <div className="col-7">
                    <Checkbox className="align-middle" disabled={/*isChecked ? true : */true} /*onChange={() => {setIsChecked(!isChecked); handleTotalCount(!isChecked, parseInt(itemCount)); console.log('---CHECKED---')}}*/ label={itemName}></Checkbox>
                </div>                
                <div className="col-3">
                    <div className="row">
                        <div className="col">
                            <Label text={itemCount} color={Label.colors.Dark} kind={Label.kinds.LINE}></Label>
                        </div>
                        <div className="col">
                            <IconButton icon={Erase} color onClick={() => handleDelete(itemName, itemCount, isChecked)}></IconButton>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <Divider></Divider>
                </div>
            </div>
        </div>
    );
}

export default ListItem
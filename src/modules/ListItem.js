import React from "react"
import mondaySdk from "monday-sdk-js";
import { Checkbox, Label, Divider, IconButton } from "monday-ui-react-core"
import { Erase } from "monday-ui-react-core/icons" 
import { useState, useEffect } from "react";

const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI5MTI1MjEwNSwiYWFpIjoxMSwidWlkIjo1MDY1MzM4MSwiaWFkIjoiMjAyMy0xMC0yM1QyMToyNzo1Ni40NTBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTkzNTI3OTYsInJnbiI6InVzZTEifQ.6IFWFt7JJq7-tQjaLIPa2rLB8kGFRxp0bA6lrb564BI");

const ListItem = ({itemName, itemCount, handleDelete, parentContext, handleTotalCount}) => {
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
                <div className="col-5">
                    <Checkbox className="align-middle" disabled={true} onChange={() => {setIsChecked(!isChecked); handleTotalCount(isChecked, parseInt(itemCount));}} label={itemName}></Checkbox>
                </div>                
                <div className="col-5">
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
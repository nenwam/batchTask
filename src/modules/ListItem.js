import React from "react"
import mondaySdk from "monday-sdk-js";
import { Checkbox, Label, Divider, IconButton } from "monday-ui-react-core"
import { Erase } from "monday-ui-react-core/icons" 
import { useState, useEffect } from "react";

const monday = mondaySdk();
// monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");

const ListItem = ({itemName, itemCount, handleDelete, colorTheme, parentContext, handleTotalCount}) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="container align-middle">
            <div className="row">
                <div className="col-5">
                    {/* <Checkbox className="align-middle" disabled={isChecked ? true : true} onChange={() => {setIsChecked(!isChecked); handleTotalCount(!isChecked, parseInt(itemCount)); console.log('---CHECKED---')}} label={itemName}></Checkbox> */}
                    {colorTheme == "dark" ? <p style={{color: 'white'}}>{itemName}</p> : <p style={{color: 'black'}}>{itemName}</p>}
                </div>                
                <div className="col-5">
                    <div className="row">
                        <div className="col">
                            {colorTheme == 'dark' || colorTheme == 'black' ? <Label text={itemCount} color={Label.colors.Dark}></Label> : <Label text={itemCount} color={Label.colors.Dark} kind={Label.kinds.LINE}></Label>}
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
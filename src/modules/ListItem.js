import React from "react"
import { Checkbox, Label, Divider, IconButton } from "monday-ui-react-core"
import { Erase } from "monday-ui-react-core/icons" 
import { useState, useEffect } from "react";

const ListItem = ({itemName, itemCount, handleDelete, handleTotalCount}) => {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // Read isChecked state from localStorage when the component mounts
        const storedIsChecked = localStorage.getItem(`isChecked-${itemName}`);
        if (storedIsChecked !== null) {
          setIsChecked(JSON.parse(storedIsChecked));
        }
    
        // Save isChecked state to localStorage whenever it changes
        return () => {
          localStorage.setItem(`isChecked-${itemName}`, JSON.stringify(isChecked));
        };
      }, [isChecked, itemName]);


    return (
        <div className="container align-middle">
            <div className="row">
                <div className="col-5">
                    <Checkbox className="align-middle" onChange={() => {setIsChecked(!isChecked); handleTotalCount(!isChecked, parseInt(itemCount));}} label={itemName}></Checkbox>
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
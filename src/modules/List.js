import React from "react"
import ListItem from "./ListItem.js";

const List = ({items, handleDelete, parentContext, handleTotalCount, theme}) => {

    return (
        <div style={{overflow: "auto", height: '22.25rem'}}>
            
                {items.map((item) => (
                    <ListItem colorTheme={theme} key={item.uniqueKey} itemName={item.itemName} itemCount={item.itemCount} parentContext={parentContext} handleDelete={handleDelete} handleTotalCount={handleTotalCount}></ListItem>
                    ))
                }
            
        </div>
    );
}
// <ListItem key={item.key} itemName={item.itemName} itemCount={item.itemCount} handleDelete={item.handleDelete} handleTotalCount={item.changeTotalCount}></ListItem>
export default List
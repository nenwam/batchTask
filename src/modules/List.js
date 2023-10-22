import React from "react"
import { Box } from "monday-ui-react-core"
import ListItem from "./ListItem.js";

const List = ({items, handleDelete, handleTotalCount}) => {

    return (
        <div>
            <Box textColor={Box.textColors.PRIMARY_TEXT_COLOR} border={Box.borders.DEFAULT} rounded={Box.roundeds.MEDIUM}>
                {items.map((item) => (
                    <ListItem key={item.uniqueKey} itemName={item.itemName} itemCount={item.itemCount} handleDelete={handleDelete} handleTotalCount={handleTotalCount}></ListItem>
                    ))
                }
            </Box>
        </div>
    );
}
// <ListItem key={item.key} itemName={item.itemName} itemCount={item.itemCount} handleDelete={item.handleDelete} handleTotalCount={item.changeTotalCount}></ListItem>
export default List
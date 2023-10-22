import React from "react"
import { Box } from "monday-ui-react-core"

const List = ({items}) => {

    return (
        <div>
            <Box textColor={Box.textColors.PRIMARY_TEXT_COLOR} border={Box.borders.DEFAULT} rounded={Box.roundeds.MEDIUM}>
                {items.map((item) => (
                    item
                    ))
                }
            </Box>
        </div>
    );
}
// <ListItem key={item.key} itemName={item.itemName} itemCount={item.itemCount} handleDelete={item.handleDelete} handleTotalCount={item.changeTotalCount}></ListItem>
export default List
import React from "react";
import { TextField, Button, Label, Dropdown } from "monday-ui-react-core"
import mondaySdk from "monday-sdk-js";
import { useState, useEffect } from "react";

const monday = mondaySdk();
monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");

const ListInput = ({nameHandler, nameValue, countHandler, countValue, totalCount, dropdownHandler, clickFunction, resetTotalFunction, disabledCheck}) => {
    const [context, setContext] = useState();
    const [colOptions, setColOptions] = useState([])

    // useEffect(() => {
    //     localStorage.setItem('colOptions_' + context.itemId, JSON.stringify(colOptions));
    //   }, [colOptions]);

    useEffect(() => {
        const contextUnsubscribe = monday.listen("context", (res) => {
          setContext(res.data);
          const localColOptions = JSON.parse(localStorage.getItem('colOptions_' + res.data.itemId)) || []
          setColOptions(localColOptions)
        });
      
        // Clean up the subscription when the component unmounts
        return () => {
          contextUnsubscribe && contextUnsubscribe.unsubscribe();
        };
      }, []);

    useEffect(() => {

        // setColOptions(() => {
        //     console.log(context)

        //     console.log("Context: ", context)
        //     const boardId = context.boardId;
            
        //     const query = `query {
        //     boards(ids: ${boardId}) {
        //         columns {
        //         id
        //         title
        //         }
        //     }
        //     }`;
        //     monday.api(query).then((res) => {
        //         console.log("res: ", res);
        //         const columns = res.data.boards[0].columns;
        //         console.log("Columns: ", columns);
        //         const cols = columns.map(column => {
        //             return {label: column.title, value: column.id}
        //         })
        //         console.log("cols: ", cols)
        //         return cols
        //     }).catch((err) => {
        //         console.log("Error fetching columns: ", err);
        //     });
        // })

        if (!context) return;


        console.log(context)

        console.log("Context: ", context)
        const boardId = context.boardId;
        
        const query = `query {
        boards(ids: ${boardId}) {
            columns {
            id
            title
            }
        }
        }`;
        monday.api(query).then((res) => {
            console.log("res: ", res);
            const columns = res.data.boards[0].columns;
            console.log("Columns: ", columns);
            const cols = columns.map(column => {
                return {label: column.title, value: column.id}
            })
            console.log("cols: ", cols)
            setColOptions(cols)
        }).catch((err) => {
            console.log("Error fetching columns: ", err);
        });
        
        

        
    }, [context])

    return (
        <div className="container">
            <div className="row pb-3">
                <div className="col">
                    <Button onClick={resetTotalFunction} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Reset Total</Button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Enter Batches</h4>
                </div>  
                <div className="col">
                    <div className="row">
                        {/* <div className="col">
                            <h4>Total</h4>
                        </div> */}
                        <div className="col">
                            <Label text={totalCount}></Label>
                        </div>
                    </div>
                    
                    
                </div>
                <div className="col">
                    <Dropdown placeholder="Target column" onChange={dropdownHandler} options={colOptions}></Dropdown>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col">
                    <TextField onChange={nameHandler} value={nameValue} type="text" placeholder="Batch name" />
                </div>
                <div className="col">
                    <TextField onChange={countHandler} value={countValue} type="number" placeholder="Batch count" />  
                </div>
                <div className="col">
                    <Button disabled={disabledCheck} onClick={clickFunction} size={Button.sizes.SMALL} color={Button.colors.POSITIVE}>Add</Button>
                </div>
            </div>
        </div>
    );
}

export default ListInput
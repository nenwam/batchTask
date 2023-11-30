import React from "react";
import { TextField, Button, Label, Dropdown } from "monday-ui-react-core"
import mondaySdk from "monday-sdk-js";
import { useState, useEffect, useRef } from "react";

const monday = mondaySdk();
// monday.setToken("eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3Mjk5MDQ5NiwiYWFpIjoxMSwidWlkIjozNjI5NTI0NywiaWFkIjoiMjAyMy0wOC0wM1QyMToyMjozNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3MTA0ODYsInJnbiI6InVzZTEifQ.XIrSWOWgg3U7oRd9zrKzL0WAr8Peo5b4ZIU1vfw0T2w");
const storageInstance = monday.storage.instance;

const ListInput = ({nameHandler, countHandler, totalCount, dropdownHandler, printerHandler, clickFunction, resetTotalFunction, parentContext, selectedVal, printerVal, disabledCheck}) => {
    // const [context, setContext] = useState();
    console.log("parentContext: ", parentContext)
    const {context} = parentContext
    console.log("Context from parent: ", context)
    const [colOptions, setColOptions] = useState([])
    const nameRef = useRef();
    const countRef = useRef();
    const printerOptions = [
        {
            label: "Printer 1",
            value: "printer1"
        },
        {
            label: "Printer 2",
            value: "printer2",
        },
        {
            label: "Printer 3",
            value: "printer3"
        },
        {
            label: "Printer 4",
            value: "printer4"
        },
        {
            label: "Printer 5",
            value: "printer5"
        },
        {
            label: "Printer 6",
            value: "printer6"
        }
    ]

    // useEffect(() => {
    //     localStorage.setItem('colOptions_' + context.itemId, JSON.stringify(colOptions));
    //   }, [colOptions]);

    // useEffect(() => {
    //     const contextUnsubscribe = monday.listen("context", (res) => {
    //       setContext(res.data);
    //     //   storageInstance.getItem(`colOptions` + res.data.itemId).then(response => {
    //     //     setColOptions(JSON.parse(response.data.value) || []);
    //     //   });
    //     //   const localColOptions = JSON.parse(localStorage.getItem('colOptions_' + res.data.itemId)) || []
    //     //   setColOptions(localColOptions)
    //     });
      
    //     // Clean up the subscription when the component unmounts
    //     return () => {
    //       contextUnsubscribe && contextUnsubscribe.unsubscribe();
    //     };
    //   }, []);

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
        console.log("ListInput: ", parentContext)

        if (parentContext){
            console.log("Parent Context 2", parentContext)

            console.log("Context: ", parentContext)
            const boardId = parentContext.boardId;
            
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
                storageInstance.setItem(`colOptions`, JSON.stringify(cols)).then((res) => {
                    console.log("colOptions stored in board storage: ", res);
                });
            }).catch((err) => {
                console.log("Error fetching columns: ", err);
            });
        } 


        
        
        

        
    }, [parentContext])

    const handleClick = () => {
        const nameVal = nameRef.current.value
        const countVal = parseInt(countRef.current.value)
        clickFunction(nameVal, countVal)
    }

    return (
        <div className="container">
            <div className="row pb-3">
                <div className="col">
                    <Button onClick={resetTotalFunction} size={Button.sizes.SMALL} color={Button.colors.NEGATIVE}>Reset Total</Button>
                </div>
            </div>
            <div className="row">
                <div className="col-3">
                    <h4>Enter Batches</h4>
                </div>  
                <div className="col-3">
                    <div className="row">
                        {/* <div className="col">
                            <h4>Total</h4>
                        </div> */}
                        <div className="col">
                            <Label text={totalCount}></Label>
                        </div>
                    </div>
                    
                    
                </div>
                <div className="col-6">
                    <Dropdown placeholder="Target column" onChange={dropdownHandler} options={colOptions} value={selectedVal}></Dropdown>
                </div>
            </div>
            <div className="row pt-4">
                <div className="col">
                    <Dropdown placeholder="Printer" onChange={printerHandler} options={printerOptions} value={printerVal}></Dropdown>
                    <TextField disabled={true} ref={nameRef} onChange={nameHandler} type="text" placeholder="Batch name" />
                </div>
                <div className="col">
                    <TextField ref={countRef} onChange={countHandler} type="number" placeholder="Batch count" />  
                </div>
                <div className="col">
                    <Button onClick={handleClick} size={Button.sizes.SMALL} color={Button.colors.POSITIVE}>Add</Button>
                </div>
            </div>
        </div>
    );
}

export default ListInput
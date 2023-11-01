import React from "react"
import TextField from "@mui/material/TextField"
import Input from "@mui/material/Input"

export function MinMaxInput({
    onSetMinMax=()=>{}, 
    min, 
    max, 
    calMin, 
    calMax,
    children, 
    ...props 
}){

    function handleMinChange(event){
        console.log(event.target.value)
        onSetMinMax(Number(event.target.value), max)
    }

    function handleMaxChange(event){
        console.log(event.target.value)
        onSetMinMax(min, Number(event.target.value))
    }

    // on double click, set the min to the cal_min to reset
    function handleMinDoubleClick(event){
        onSetMinMax(calMin, max)
    }

    // on double click, set the max to the cal_max to reset
    function handleMaxDoubleClick(event){
        onSetMinMax(min, calMax)
    }

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '50px',
            gap: '10px',
            ...props
        }}
        >
            <TextField
                sx={{
                    minWidth: '50%',
                }}
                id="min-number"
                label="Min"
                helperText="double click to reset"
                type="number"
                // value should be set to 3 decimal places
                value={min}
                inputProps={{
                    min:calMin,
                    max:calMax,
                    type: 'number'
                }}
                variant="standard"
                size="small"
                onInput={handleMinChange}
                onDoubleClick={handleMinDoubleClick}
            />
            <TextField
                sx={{
                    minWidth: '50%',
                }}
                id="max-number"
                label="Max"
                helperText="double click to reset"
                type="number"
                value={max}
                inputProps={{
                    min:calMin,
                    max:calMax,
                    type: 'number'
                }}
                variant="standard"
                size="small"
                onInput={handleMaxChange}
                onDoubleClick={handleMaxDoubleClick}
            />
        </div>
    )
}
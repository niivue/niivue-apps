import React from "react"
import TextField from "@mui/material/TextField"

export function MinMaxInput({ children, ...props }){
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
            // marginLeft: '8px',
            // marginRight: '8px',
            ...props
        }}
        >
            <TextField
                id="min-number"
                label="Min"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="standard"
                size="small"
            />
            <TextField
                id="max-number"
                label="Max"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="standard"
                size="small"
            />
        </div>
    )
}
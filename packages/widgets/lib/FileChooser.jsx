import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';

/**
 * A component that displays a file chooser.
 * @param {Object} props - The component props.
 * @param {string} props.value - The value of the file chooser.
 * @param {string} props.textLabel - The label of the file chooser.
 * @param {string} props.buttonLabel - The label of the file chooser button.
 * @param {string} props.helperLabel - The helper text of the file chooser.
 * @param {function} props.onChange - The function to call when the file chooser value changes.
 * @param {function} props.onClick - The function to call when the file chooser button is clicked.
 * @returns {JSX.Element} The rendered component.
 * @example
 * <FileChooser
 * value="/path/to/file"
 * label="Input"
 * onChange={(value) => console.log(value)}
 * onClick={() => console.log('clicked')}
 * />
 */
export function FileChooser({ value, textLabel='input', helperLabel='', onChange, onClick, buttonLabel='choose', ...props }) {
    
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 4
        }}
        >
        <TextField
            sx={{ 
                width: '100%'
            }}
            label={textLabel}
            helperText={helperLabel}
            onChange={handleChange}
            value={value}
        />
        <Button variant="contained" onClick={onClick}>{buttonLabel}</Button>
        </Box>
    );
    }
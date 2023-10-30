import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

export function ColormapSelect({
  colormaps=[], 
  onSetColormap=()=>{},
  colormap,
  ...props 
}){

    const [color, setColor] = React.useState(colormap)

    function handleColorChange(event) {
        let clr = event.target.value
        setColor(clr)
        onSetColormap(clr)
      }

    function makeColorGradients(colormapValues) {
        let gradients = ''
        let c = colormapValues
        let n = c.R.length
        gradients += `rgba(${c.R[n - 1]},${c.G[n - 1]},${c.B[n - 1]},${1})`
        gradients += `linear-gradient(90deg,`
        for (let j = 0; j < n; j++) {
          gradients += `rgba(${c.R[j]},${c.G[j]},${c.B[j]},${1}) ${(j / (n - 1)) * 100}%,`
        }
        gradients = gradients.slice(0, -1)
        gradients += ')'
        return gradients
    }

    let allColors = colormaps.map((color) => {
        // omit drawing color maps
        if (color.name.startsWith("$")) {
          return
        }
        return (
          <MenuItem value={color.name} key={color.name}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {color.name}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '20%',
                  ml: 'auto'
                }}
                style={{
                  background: makeColorGradients(color.values)
                }}
              >
              </Box>
    
            </Box>
          </MenuItem>
        )
      })

    return (
        <FormControl
            sx={{ 
                width: '100%', 
            }}
        >
            <InputLabel
                id="colormap-select-label"
            >
                Colormap
            </InputLabel>
            <Select
            labelId="colormap-select-label"
            sx={{ width: '100%' }}
            value={color}
            label='Colormap'
            size='small'
            onChange={handleColorChange}
            >
            {allColors}
            </Select>
        </FormControl>
    )
}
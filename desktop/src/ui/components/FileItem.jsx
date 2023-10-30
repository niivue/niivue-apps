import React from "react";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export function FileItem({
    url,
    name,
    index,
    active = false,
    onSetVisibility = () => { },
    onSetActive = () => { },
    onRemove = () => { },
    ...props
}) {

    const [visible, setVisible] = React.useState(true);
    const [contextMenu, setContextMenu] = React.useState(null);

    function toggleVisibility() {
        onSetVisibility(index, visible === true ? 0 : 1)
        setVisible(!visible)
    }

    function toggleActive() {
        onSetActive(name, !active)
    }

    function handleContextMenu (event) {
        event.preventDefault();
        setContextMenu(
          contextMenu === null
            ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
              }
            : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
              // Other native context menus might behave different.
              // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
              null,
        );
      };


    function handleClose () {
        setContextMenu(null);
    };

    function handleRemove () {
        handleClose()
        onRemove(index)
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: '100%',
                width: '100%',
                // background color is very light blue if active
                backgroundColor: active ? '#E6F0FF' : '#F8F8F8',
                ...props
            }}
        >
            <IconButton onClick={toggleVisibility}>
                {!visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <Typography
                sx={{
                    marginLeft: '8px',
                    wordBreak: 'break-word', // wrap long names
                    flexBasis: '75%' // allow for name wrapping for long names and alignment to the button
                }}
                onClick={toggleActive}
                onContextMenu={handleContextMenu}
            >
                {name}
            </Typography>
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={handleRemove}>Remove</MenuItem>
            </Menu>
        </div>
    )
}
import Typography from "@mui/material/Typography";

export function Sidebar({ children, asColumn = true, ...props}) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: asColumn ? 'column' : 'row',
          alignItems: 'flex-start',
          // justifyContent: 'left',
          height: '100%',
          minHeight: '100%',
          minWidth: '30%',
          backgroundColor: 'white',
          // padding: '12px',
          // margin: '12px',
          padding: '8px',
          overflowY: 'scroll',
          gap: '8px',
          ...props
        }}
      >
        <Typography
            variant="body"
            sx={{
              marginTop: '10px',
              marginBottom: '10px',
              marginLeft: '8px',
            }}
        >
            Layers
        </Typography>
        {children}
      </div>
    );
  }
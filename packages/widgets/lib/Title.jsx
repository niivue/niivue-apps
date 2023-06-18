import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * A component that displays a title.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child elements to display.
 * @returns {JSX.Element} The rendered component.
 * @example
 * <Title>My Title</Title>
 */ 
export function Title({ children }) {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        }}
        >
        <Typography variant="h3" gutterBottom>
            {children}
        </Typography>
        </Box>
    );
    }
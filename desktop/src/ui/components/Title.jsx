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
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
        }}
        >
            <h3
                style={
                    {
                        fontFamily: 'sans-serif',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        margin: 0,
                        padding: 0,
                        textAlign: 'center'
                    }
                }
            >
                {children}
            </h3>
        </div>
    );
    }
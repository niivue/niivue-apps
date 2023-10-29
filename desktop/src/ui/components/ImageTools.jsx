export function ImageTools({ children, ...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            minWidth: '100%',
            width: '100%',
            minHeight: '100px',
            backgroundColor: '#F8F8F8',
            borderRadius: '4px',
            gap: '10px',
            ...props
        }}
        >
        {children}
        </div>
    )
}
export function SceneTools({ children, ...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '100%',
            width: '100%',
            minHeight: '50px',
            backgroundColor: '#F8F8F8',
            borderRadius: '4px',
            ...props
        }}
        >
        {children}
        </div>
    )
}
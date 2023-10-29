export function Column({ children, ...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '50px',
            minHeight: '50px',
            ...props
        }}
        >
        {children}
        </div>
    )
}
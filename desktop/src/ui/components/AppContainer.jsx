export function AppContainer({ children, asColumn = false, ...props}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: asColumn ? 'column' : 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        minHeight: '300px',
        ...props
      }}
    >
      {children}
    </div>
  );
}
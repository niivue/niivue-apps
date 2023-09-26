/**
 * A container component that displays its children in a flexbox layout.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child elements to display.
 * @param {boolean} [props.asColumn=true] - Whether to display the children in a column or row layout.
 * @returns {JSX.Element} The rendered component.
 * @example
 * <AppContainer>
 *  <div>Child 1</div>
 * <div>Child 2</div>
 * </AppContainer>
 * 
 * @example
 * <AppContainer asColumn={false}>
 * <div>Child 1</div>
 * <div>Child 2</div>
 * </AppContainer>
 */
export function AppContainer({ children, asColumn = true, ...props}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: asColumn ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        ...props
      }}
    >
      {children}
    </div>
  );
}
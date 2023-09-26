/**
 * A container component that displays its children in a Flexbox row.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child elements to display.
 * @example
 * <Row>
 * <div>Child 1</div>
 * <div>Child 2</div>
 * </Row>
 */
export function Row({ children, ...props }){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            minWidth: '0px',
            minHeight: '0px',
            ...props
        }}
        >
        {children}
        </div>
    )
}
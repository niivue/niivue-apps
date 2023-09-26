import { useState, useEffect } from "react"

function FileListHeader({...props}){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            textAlign: 'center',
            ...props
        }}
        >
            <h3>
                header
            </h3>
        </div>
    )
}

function FileListItem({name, ...props}){
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            ...props
        }}
        >
            {`${name}`}
        </div>
    )
}

/**
 */
export function FileList({ children, files=[], ...props }){

    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            ...props
        }}
        >
            <FileListHeader />
            {/* render all files */}
            {files.map((file, index) => {
                return (
                    <FileListItem 
                        key={index} 
                        name={file}
                    />
                )
            })}
        </div>
    )
}
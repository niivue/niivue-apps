import Box from '@mui/material/Box';
import { useRef, useEffect, useState } from 'react';
import {Niivue} from '@niivue/niivue'
import {niivuejs} from 'niivuejs'

function onLocationChange(location) {
    console.log(location);
    document.title = location.string;
}

/**
 * A component that displays a Niivue canvas.
 * @param {Object} props - The component props.
 * @param {string} props.images - The images to display. This should be a JSON string of an array of objects with at least the url and name properties. See the Niivue documentation for more information.
 * @returns {JSX.Element} The rendered component.
 * @example
 * <NiiVue
 * images='[{"url":"http://localhost:<port>/file?filename=/path/to/file.nii.gz","name":"file.nii.gz"}]'
 * />
 */
export function NiiVue({images,  ...props }){
    const [nv, setNv] = useState(null);
    const [nvImages, setNvImages] = useState(images);
    const [commsInfo, setCommsInfo] = useState(null);
    // get a reference to the canvas element
    const canvas = useRef(null);

    function makeUrl(path){
        return `http://${commsInfo.host}:${commsInfo.fileServerPort}/${commsInfo.route}?${commsInfo.queryKey}=${path}`
    }
    // create a new Niivue object
    // initialize the Niivue object when the component mounts
    useEffect(() => {
        async function getCommsInfo(){
            let info = await niivuejs.getCommsInfo()
            console.log(info)
            setCommsInfo(info)
        }
        getCommsInfo()
        if (niivuejs.webGL2Supported()) {
            console.log('initializing niivue');
            let nv = new Niivue({
                onLocationChange: onLocationChange,
            })
            console.log('attaching to canvas');
            nv.attachToCanvas(canvas.current);
            setNv(nv);
        }
        
    }, []);

    useEffect(() => {
        if(nv){
            niivuejs.onLoadVolumes((imgs) => {
                console.log('loaded volumes', imgs);
                let imagesToLoad = imgs.map((image) => {
                    return {
                        url: makeUrl(image),
                        name: image,
                    }
                });
                setNvImages(JSON.stringify(imagesToLoad));
            });
        }
    }, [nv]);

    // load the images when the images prop changes
    useEffect(() => {
        if(nv && nvImages){
            // load volumes expects an array of object with at LEAST the
            // url and name properties. 
            // a useful property to add is the colormap property
            // something like this:
            // {
            //     url: 'http://localhost:<port>/file?filename=/path/to/file.nii.gz',
            //     name: 'file.nii.gz' // when using query strings you must include the name property
            //     colormap: 'gray' // or red, green, blue, etc. see: https://github.com/niivue/niivue/tree/main/src/cmaps
            // }
            let parsedImages = JSON.parse(nvImages);
            console.log('loading volumes', parsedImages);
            nv.loadVolumes(parsedImages);
        }
    }, [nv, nvImages]);

    // if webgl2 is not supported, return null (nothing will be rendered)
    if (!niivuejs.webGL2Supported()) {
        return (null)
    } else {
        // otherwise return the canvas element
        // with niivue attached
        return (
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                ...props
            }}
            >
            <canvas ref={canvas} height={480} width={640}></canvas>

            </Box>
        )
    }
}
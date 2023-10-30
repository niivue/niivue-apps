import { useRef, useEffect, useState } from 'react';
import {Niivue, SLICE_TYPE} from '@niivue/niivue'
import {nvUtils} from '../nvUtils'

export function NiiVue({nv=null, volumes=[], meshes=[],  ...props }){
    const [commsInfo, setCommsInfo] = useState(null);
    const canvas = useRef(null);

    // initialize the Niivue object when the component mounts
    useEffect(() => {
        if (nv){
            nv.attachToCanvas(canvas.current);
        }
    }, []);

    // useEffect(() => {
    //     if(nv){
    //         const sliceTypes = {
    //             'axial': SLICE_TYPE.AXIAL,
    //             'coronal': SLICE_TYPE.CORONAL,
    //             'sagittal': SLICE_TYPE.SAGITTAL,
    //             'multiPlanarACS': SLICE_TYPE.MULTIPLANAR,
    //             'render': SLICE_TYPE.RENDER
    //         }

    //         nvUtils.onSetColormaps((colormap) => {
    //             let name = colormap.name;
    //             let cmap = colormap.colormap;
    //             // loop through the nv.volumes to find the volume with the matching name
    //             for(let i = 0; i < nv.volumes.length; i++){
    //                 if(nv.volumes[i].name === name){
    //                     nv.volumes[i].colormap = cmap;
    //                     nv.updateGLVolume();
    //                     return;
    //                 }
    //             }
    //         });

    //         nvUtils.onSetDragMode((mode) => {
    //             console.log('set drag mode', mode);
    //             switch(mode) {
    //                 case 'pan':
    //                     nv.opts.dragMode = nv.dragModes.pan
    //                     break;
    //                 case 'contrast':
    //                     nv.opts.dragMode = nv.dragModes.contrast
    //                     break;
    //                 case 'measure':
    //                     nv.opts.dragMode = nv.dragModes.measurement
    //                     break;
    //                 case 'none':
    //                     nv.opts.dragMode = nv.dragModes.none
    //                     break;
    //             }
    //         });

    //         // set the callback for when volumes are loaded
    //         nvUtils.onLoadVolumes((imgs) => {
    //             console.log('loaded volumes', imgs);
    //             let imagesToLoad = imgs.map((image) => {
    //                 return {
    //                     url: makeUrl(image),
    //                     name: image,
    //                 }
    //             });
    //             setNvImages(JSON.stringify(imagesToLoad));
    //         });
    //         // set the callback for when surfaces are loaded
    //         nvUtils.onLoadSurfaces((surfs) => {
    //             console.log('loaded surfaces', surfs);
    //             let surfacesToLoad = surfs.map((surf) => {
    //                 return {
    //                     url: makeUrl(surf),
    //                     name: surf,
    //                 }
    //             });
    //             setNvSurfaces(JSON.stringify(surfacesToLoad));
    //         });
    //         // set the callback for when volume overlays are loaded
    //         nvUtils.onAddVolumeOverlay((img) => {
    //             console.log('added volume overlay', img);
    //             let imageToLoad = {
    //                 url: makeUrl(img),
    //                 name: img,
    //             };
    //             console.log(imageToLoad);
    //             // append the new image to the existing images
    //             nv.addVolumeFromUrl(imageToLoad);
    //         });
    //         // set the callback for when the view is changed from the menu bar
    //         nvUtils.onSetView((view) => {
    //             console.log('set view', view);
    //             // clear the mosaic string
    //             nv.setSliceMosaicString("");
    //             if (view === 'multiPlanarACSR') {
    //                 nv.opts.multiplanarForceRender = true;
    //             } else if (view === 'mosaic') {
    //                 // TODO: allow the user to set the mosaic string
    //                 nv.setSliceMosaicString("A 0 20 C 30 S 42");
    //                 nv.opts.multiplanarForceRender = false;
    //             } else {
    //                 nv.opts.multiplanarForceRender = false;
    //             }
    //             nv.setSliceType(sliceTypes[view]);
    //         });

    //         nvUtils.onSetFrame((frame) => {
    //             console.log('set frame', frame);
    //             let vol = nv.volumes[0];
    //             let id = vol.id;
    //             let currentFrame = vol.frame4D
    //             nv.setFrame4D(id, currentFrame + frame);
    //         });
    //     }
    // }, [nv]);

    // load the images when the images prop changes
    // useEffect(() => {
    //     if(nv && nvImages){
    //         // load volumes expects an array of object with at LEAST the
    //         // url and name properties. 
    //         // a useful property to add is the colormap property
    //         // something like this:
    //         // {
    //         //     url: 'http://localhost:<port>/file?filename=/path/to/file.nii.gz',
    //         //     name: 'file.nii.gz' // when using query strings you must include the name property
    //         //     colormap: 'gray' // or red, green, blue, etc. see: https://github.com/niivue/niivue/tree/main/src/cmaps
    //         // }
    //         let parsedImages = JSON.parse(nvImages);
    //         console.log('loading volumes', parsedImages);
    //         nv.loadVolumes(parsedImages);
    //     }
    // }, [nv, nvImages]);

    // if webgl2 is not supported, return null (nothing will be rendered)
    if (!nvUtils.webGL2Supported()) {
        return (null)
    } else {
        // otherwise return the canvas element
        // with niivue attached
        return (
            <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flexShrink: 1,
                width: '100%',
                height: '100%',
                minWidth: '0px',
                minHeight: '0px',
                ...props
            }}
            >   
            <canvas 
                ref={canvas} 
                height={480} 
                width={640}
                style={{
                    outline: 'none', // remove focus ring
                    minWidth: '0px',
                    minHeight: '0px',
                }}
            >
            </canvas>

            </div>
        )
    }
}
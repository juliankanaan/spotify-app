import { keyframes, css } from "styled-components";
import styled from 'styled-components'
import {useState, useEffect} from 'react'
import FastAverageColor from 'fast-average-color'


const makeSpin =  keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    `;
    

const Wrapper = styled.div`
    animation: ${makeSpin} 9s linear infinite; 
`

const AlbumCover = props => {
    const [color, setColor] = useState()

    useEffect(() => {
            const imageUrl = props.src
            const downloadedImg = new Image;
            downloadedImg.crossOrigin = "Anonymous";
            downloadedImg.src = imageUrl;
            const fac = new FastAverageColor();
            fac.getColorAsync(downloadedImg, { algorithm: 'dominant' })
                .then((color) => {
                    console.log(color)
                    document.body.style.backgroundColor = color.hex 
                })
                .catch( e => console.log(e))
    }, [props.src]); 
       

    return (
        <Wrapper>
        <div className='album-cover'>
            <img src={props.src}  />        
        </div>
        </Wrapper>
    )

}
export default AlbumCover
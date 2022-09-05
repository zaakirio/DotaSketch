import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import './Palette.css';

type Props = {
    setColorInParent: (selectedColor: string) => void
}

const colors = [
    "#ff0000",
    "#A0522D",
    "#ff4000",
    "#ff8000",
    "#ffbf00",
    "#ffff00",
    "#bfff00",
    "#80ff00",
    "#40ff00",
    "#00ff00",
    "#00ffbf",
    "#00ffff",
    "#00bfff",
    "#0080ff",
    "#0040ff",
    "#0000ff",
    "#4000ff",
    "#8000ff",
    "#bf00ff",
    "#ff00ff",
    "#ff00bf",
    "#ff0080",
    "#cccccc",
    "#aaaaaa",
    "#000000"
]

const Palette: React.FC<Props> = ({ setColorInParent }) => {
    const [selectedColor, setSelectedColor] = useState<string>(colors[0])
    const [mobileView, setMobileView] = useState<boolean>(false)

    useEffect(() => {
        setColorInParent(selectedColor)
        palleteHandler()
        window.addEventListener("resize", palleteHandler)
        return(() => {
            window.removeEventListener("resize", palleteHandler)
        })
    }, [])

    const palleteHandler = () => {
        const screenWidth = window.outerWidth
        setMobileView(mobileView => {
            if(mobileView && screenWidth >= 600){
                return false
            }
            else if(!mobileView && screenWidth < 600){
                return true
            }
            return mobileView
        })
    }

    const handleColorChange = (color: string) => {
        setSelectedColor(color)
        setColorInParent(color)
    }

    const displayColors = () => {
        let colorsJSX = []
        for(let i=0; i<5; i++){
            const colorGroup = []
            for(let j = i*5; j < (i+1)*5; j++){
                const isSelected = colors[j] === selectedColor
                colorGroup.push(
                    <div onClick={() => handleColorChange(colors[j])}>
                        <div className="color" style={{ width: isSelected ? 35 : 40, height: isSelected ? 35: 40, border: isSelected ? '2.5px solid white' : '', backgroundColor: colors[j] }}></div>
                    </div>
                )
            }
            colorsJSX.push(
                <Grid item id="colorsContainer"
                    style={{ justifyContent: (mobileView ? 'center' : ((i%2 === 0) ? 'flex-end' : 'flex-start')) }}
                    md={6} sm={6} xs={12}
                >
                    {colorGroup}
                </Grid>
            )
        }
        return colorsJSX
    }

    return (
        <div id="paletteContainer">
            <Grid container>
                {displayColors()}
            </Grid>
        </div>
    )
}

export default Palette
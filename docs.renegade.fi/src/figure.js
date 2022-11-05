import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'

const ImageSwitcher = ({ LightImage, DarkImage, isSvg, linkTo }) => {
  const { colorMode, setColorMode } = useColorMode()
  let image;
  if (isSvg) {
    image = colorMode === 'dark'
      ? <DarkImage width="100%" height="100%" />
      : <LightImage width="100%" height="100%" />
  } else {
    image = <img src={colorMode === 'dark' ? DarkImage : LightImage} />
  }
  if (linkTo) {
    return (
      <a href={linkTo} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    )
  } else {
    return image
  }
}

const Figure = ({ LightImage, DarkImage, isSvg, caption, linkTo, width }) => {
  return (
    <div>
      <div style={{"display": "flex", flexDirection: "column", alignItems: "center"}}>
        <center style={{width: width || "40%", minWidth: "300px"}}>
          <ImageSwitcher
            LightImage={LightImage}
            DarkImage={DarkImage}
            isSvg={isSvg}
            linkTo={linkTo}
          />
        </center>
        <center style={{opacity: "60%", fontSize: "0.8em"}}>
          {caption}
        </center>
      </div>
      <div style={{height: "20px"}} />
    </div>
  )
}

export default Figure

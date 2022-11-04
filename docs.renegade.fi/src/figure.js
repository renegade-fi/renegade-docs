import React from 'react'
import { useColorMode } from '@docusaurus/theme-common'

const ImageSwitcher = ({ LightImage, DarkImage, isSvg }) => {
  const { colorMode, setColorMode } = useColorMode()
  if (isSvg) {
    return colorMode === 'dark'
      ? <DarkImage width="100%" height="100%" />
      : <LightImage width="100%" height="100%" />
  } else {
    return <img src={colorMode === 'dark' ? DarkImage : LightImage} />
  }
}

const Figure = ({ LightImage, DarkImage, isSvg, caption, width }) => {
  return (
    <div>
      <div style={{"display": "flex", flexDirection: "column", alignItems: "center"}}>
        <center style={{width: width || "40%", minWidth: "300px"}}>
          <ImageSwitcher LightImage={LightImage} DarkImage={DarkImage} isSvg={isSvg} />
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

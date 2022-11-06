import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
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

const Figure = ({
    LightImage, DarkImage, isSvg, caption, linkTo, width,
    paddingTop, paddingBottom, suppressOnMobile
}) => {
  return (
    <BrowserOnly>
      {() => (suppressOnMobile && window.matchMedia("(max-width: 768px)").matches) ||
        <div>
          <div style={{height: paddingTop || "0px"}} />
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
          <div style={{height: paddingBottom || "20px"}} />
        </div>
      }
    </BrowserOnly>
  )
}

export default Figure

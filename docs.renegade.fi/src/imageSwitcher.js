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

export default ImageSwitcher

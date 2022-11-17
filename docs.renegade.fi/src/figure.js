import React from 'react'
import PropTypes from 'prop-types'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { useColorMode } from '@docusaurus/theme-common'

const ImageSwitcher = ({ LightImage, DarkImage, isSvg, linkTo }) => {
  const { colorMode } = useColorMode()
  let image
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
  LightImage, DarkImage, LightImageMobile, DarkImageMobile,
  isSvg, caption, linkTo, width, widthMobile,
  paddingTop, paddingBottom, suppressOnMobile
}) => {
  return (
    <BrowserOnly>
      {() => {
        const isMobile = window.matchMedia('(max-width: 800px)').matches
        if (isMobile && suppressOnMobile) {
          return null
        }
        return (
          <div>
            <div style={{ height: paddingTop || '0px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <center style={{ width: (isMobile && widthMobile ? widthMobile : width) || '90%' }}>
                <ImageSwitcher
                  LightImage={LightImageMobile && isMobile ? LightImageMobile : LightImage}
                  DarkImage={DarkImageMobile && isMobile ? DarkImageMobile : DarkImage}
                  isSvg={isSvg}
                  linkTo={linkTo}
                />
              </center>
              <center style={{ opacity: '60%', fontSize: '0.8em' }}>
                {caption}
              </center>
            </div>
            <div style={{ height: paddingBottom || '20px' }} />
          </div>
        )
      }}
    </BrowserOnly>
  )
}

ImageSwitcher.propTypes = {
  LightImage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  DarkImage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  isSvg: PropTypes.bool,
  linkTo: PropTypes.string
}

Figure.propTypes = {
  LightImage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  DarkImage: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  LightImageMobile: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  DarkImageMobile: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  isSvg: PropTypes.bool,
  caption: PropTypes.string,
  linkTo: PropTypes.string,
  width: PropTypes.string,
  widthMobile: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingBottom: PropTypes.string,
  suppressOnMobile: PropTypes.bool
}

export default Figure

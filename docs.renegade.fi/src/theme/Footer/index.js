import React from 'react'
import styles from './styles.module.css'
import { useColorMode } from '@docusaurus/theme-common'

import LogoLight from '@site/static/img/logo_light.svg'
import LogoDark from '@site/static/img/logo_dark.svg'

function Footer () {
  const { colorMode } = useColorMode()
  return (
    <div className={styles.footer}>
      <div className={styles.footerTextWrapper}>
        <div className={styles.footerText}>
          <p className={styles.footerTextQuestion}>
            Questions?
          </p>
          <p className={styles.footerTextAnswer}>
            Get in contact via <a href="https://twitter.com/renegade_fi"
            target="_blank" rel="noreferrer">Twitter DM</a>. We reply quickly.
          </p>
        </div>
        <div className={styles.footerText}>
          <p className={styles.footerTextQuestion}>
            Need some Inspiration?
          </p>
          <p className={styles.footerTextAnswer}>
            Read <a href="https://satoshi.nakamotoinstitute.org/quotes/"
            target="_blank" rel="noreferrer">The Quotable Satoshi</a>.
          </p>
        </div>
      </div>
      <div className={styles.logoFlexbox}>
        {
          colorMode === 'dark'
            ? <LogoDark className={styles.logo} />
            : <LogoLight className={styles.logo} />
        }
      </div>
    </div>
  )
}
export default React.memo(Footer)

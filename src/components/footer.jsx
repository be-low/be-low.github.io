import React from 'react'

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '2.45rem'
      }}
    >
      Â© {new Date().getFullYear()}, Built with{' '}
      <a href="https://www.gatsbyjs.org">Gatsby</a>
    </footer>
  )
}

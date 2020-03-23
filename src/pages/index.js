import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import styled from 'styled-components'

const NavLink = styled(Link)`
  
`

const VerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-auto-rows: minmax(1fr,auto);
`

const IndexPage = () => (
  <Layout>
    <SEO title="Home"/>
    <VerticalWrapper>
      <NavLink to={'/posts'}>Posts</NavLink>
      <NavLink to={'/about-me'}>About Me</NavLink>
      <NavLink to={'/contact'}>Contact</NavLink>
    </VerticalWrapper>
  </Layout>
)

export default IndexPage

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
  justify-content: space-around;
  flex: 1 0 200px;
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

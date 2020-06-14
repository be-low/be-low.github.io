import React from 'react'
import { Link } from 'gatsby'
import SEO from '../components/seo'
import styled from 'styled-components'

const Main = styled('main')`
  margin-top: 120px;
  display: grid;
  grid-template-columns: repeat(6,1fr);
`
const Title = styled('h1')`
  grid-column: 2/6;
  text-align: center;
  grid-column-gap: 1fr;
  height: 100px;
  color: #00AAC2;
  margin: 0;
`
const Wrapper = styled.div`
  display: grid;
  grid-column: 3/5;
`
const NavLink = styled(Link)`
  text-align: center;
  height: 60px;
  line-height: 60px;
  margin: 10px 0;
`

const IndexPage = () => (
  <Main>
    <SEO title="Home" />
    <Title>Billow's World</Title>
    <Wrapper>
      {/* <NavLink to={'/start'}>Start</NavLink> */}
      {/* <NavLink to={'/posts'}>Load</NavLink> */}
      <NavLink to={'/posts'}>Posts</NavLink>
      {/* <NavLink to={'/contact'}>Option</NavLink> */}
      <NavLink to={'/about-me'}>About</NavLink>
      <NavLink to={'/friends'}>Friends</NavLink>
    </Wrapper>
  </Main>
)

export default IndexPage

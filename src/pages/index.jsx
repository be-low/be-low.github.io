import React from 'react'
import { Link } from 'gatsby'
import SEO from '../components/seo'
import styled from 'styled-components'

const Container = styled('main')`
  margin: 0 auto;
  margin-top: 120px;
  max-width: 960px;
  min-width: 230px;
`
const Title = styled('h1')`
  text-align: center;
  height: 100px;
  color: #00aac2;
  margin: 0;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const NavLink = styled(Link)`
  text-align: center;
  height: 60px;
  line-height: 60px;
  padding: 10px 0;
`

const IndexPage = () => (
  <>
    <Container>
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
    </Container>
  </>
)

export default IndexPage

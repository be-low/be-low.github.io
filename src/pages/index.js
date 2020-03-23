import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home"/>
    <Link to={'/posts'}><span>Posts</span></Link>
    <Link to={'/about-me'}><span>About Me</span></Link>
    <Link to={'/contact'}><span>Contact</span></Link>
  </Layout>
)

export default IndexPage

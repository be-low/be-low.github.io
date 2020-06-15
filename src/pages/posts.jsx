import Layout from '../components/layout'
import SEO from '../components/seo'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import PostLink from '../components/post-link'
import styled from 'styled-components'

const Wrapper = styled(Layout)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`
const Main = styled('main')`
  grid-column: 2/5;
`

export default function PostsPage() {
  const posts = useStaticQuery(graphql`
    query AllPostsQuery {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
        totalCount
        nodes {
          ...Post
          excerpt(format: HTML)
        }
      }
    }
  `).allMarkdownRemark.nodes

  return (
    <Wrapper>
      <SEO title="Posts" />
      <Main>
        <h1>Posts</h1>
        {posts.map(i => (
          <PostLink key={i.id} post={i} />
        ))}
      </Main>
    </Wrapper>
  )
}

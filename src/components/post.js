import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

const Article = styled('article')`
  margin: 2em 1.5em;
`

const H1 = styled('h1')`
  text-align: center;
`
const H2 = styled('h2')`
  text-align: center;
`

export default function Post ({ data }) {
  const { frontmatter, html } = data.markdownRemark
  return (
    <Article className="blog-post-container">
      <div className="blog-post">
        <H1>{frontmatter.title}</H1>
        <H2>{frontmatter.date}</H2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Article>
  )
}

export const pageQuery = graphql`
    query($id: String!) {
        markdownRemark(id: { eq: $id }) {
            ...Post
            html
        }
    }
`

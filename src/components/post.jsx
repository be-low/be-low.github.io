import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import "katex/dist/katex.min.css"
import "./post.css"

const Article = styled('article')`
  margin: 2em 1em;
`

const H1 = styled('h1')`
  text-align: center;
`
const H2 = styled('h2')`
  text-align: center;
  font-weight: lighter
`

const style = {
  blogPostContainer: {},
  blogPost: {},
  blogPostContent: {},
}

export default function Post({ data }) {
  const { frontmatter, html } = data.markdownRemark
  const { title, date } = frontmatter
  const { blogPostContainer, blogPost, blogPostContent } = style
  return (
    <Article style={blogPost}>
      <div style={blogPostContainer}>
        <H1>{title}</H1>
        <H2>{date}</H2>
        <div
          style={blogPostContent}
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

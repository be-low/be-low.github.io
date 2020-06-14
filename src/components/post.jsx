import React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

const Article = styled('article')`
  margin: 2em 1em;
`

const H1 = styled('h1')`
  text-align: center;
`
const H2 = styled('h2')`
  text-align: center;
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
    <Article className={blogPost}>
      <div className={blogPostContainer}>
        <H1>{title}</H1>
        <H2>{date}</H2>
        <div
          className={blogPostContent}
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

import React from 'react'
import { graphql } from 'gatsby'

export default function Post ({ data }) {
  const { frontmatter, html } = data.markdownRemark
  return (
    <article className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
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

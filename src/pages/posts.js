import Layout from '../components/layout'
import SEO from '../components/seo'
import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import PostLink from '../components/post-link'

export default function PostsPage () {
  const data = useStaticQuery(graphql`
      query AllPostsQuery {
          allMarkdownRemark {
              totalCount
              nodes {
                  ...Post
                  excerpt(format: HTML)
              }
          }
      }
  `)
  const { nodes } = data.allMarkdownRemark

  return (
    <Layout>
      <SEO title="Posts"/>
      <h1>Posts</h1>
      {nodes.map(i => <PostLink key={i.id} post={i}/>)}
    </Layout>
  )
}


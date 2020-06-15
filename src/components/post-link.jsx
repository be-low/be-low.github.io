import { Link } from 'gatsby'
import React from 'react'

export default function PostsLink({ post }) {
  const { frontmatter } = post
  const path = `/post/${frontmatter.title}`
  return (
    <Link style={{ display: 'flex', margin: '20px 0' }} to={path}>
      <span style={{ fontWeight: 'bold' }}>{frontmatter.title}</span>
      <span style={{ flex: '1 1 0' }}></span>
      <span style={{ fontWeight: 'lighter' }}>{frontmatter.date}</span>
    </Link>
  )
}

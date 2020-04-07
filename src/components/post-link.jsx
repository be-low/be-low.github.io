import { Link } from 'gatsby'
import React from 'react'

export default function PostsLink ({ post }) {
  const { frontmatter } = post
  const path = `/post/${frontmatter.title}`
  return (
    <Link to={path}>
      <h3>{frontmatter.title}</h3>
    </Link>
  )
}

import { graphql } from 'gatsby'

export const PostQuery = graphql`
  fragment Post on MarkdownRemark {
    id
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      draft
      tags
      title
    }
  }
`

const path = require(`path`)

exports.createPosts = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const postComponent = path.resolve(`src/components/post.js`)

  const queryAllPost = `{
  allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
    totalCount
    edges {
      node {
        id
        frontmatter {
          title
        }
      }
    }
  }
}`
  const result = await graphql(queryAllPost)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running ${queryAllPost} GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/${node.frontmatter.title}`,
      component: postComponent,
      context: {
        id: node.id
      }
    })
  })
}

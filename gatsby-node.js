/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const { createPosts } = require('./src/actions/createPosts')

exports.createPages = createPosts

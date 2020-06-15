module.exports = {
  siteMetadata: {
    title: `Billow's world`,
    description: `Computer Science Beginner`,
    author: `billow`,
    siteUrl: `https://billow.fun`
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-catch-links',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `billow's world`,
        short_name: `bw`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `standalone`,
        icon: `assets/icons/icon-512.webp` // This path is relative to the root of the site.
      }
    },
    /**
     * If you’re using this plugin with gatsby-plugin-manifest (recommended)
     * this plugin should be listed after that plugin so the manifest file
     * can be included in the service worker.
     */
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: ['/posts', `/about-me/`, `/friends`]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/content/posts`
      }
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content/friends/`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`
            }
          },
          'gatsby-remark-prismjs'
        ]
      }
    }
  ]
}

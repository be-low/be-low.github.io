import Layout from '../components/layout'
import SEO from '../components/seo'
import React from 'react'

export default function AboutMePage() {
    return (
        <Layout>
            <SEO title="Friends" />
            <h1>Friends</h1>
            <ul>
                <li><a href="https://blog.lemonneko.moe/">lemonneko</a></li>
            </ul>
        </Layout>
    )
}

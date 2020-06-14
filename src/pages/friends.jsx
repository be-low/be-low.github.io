import Layout from '../components/layout'
import SEO from '../components/seo'
import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const style = {
    friendLink: {
        display: 'flex',
        margin: '20px 0'
    },
    avatar: {
        width: '100px'
    },
    meta: {
        margin: '0 20px',
        flex: '1 0 200px'
    }
}

export default function FriendsPage() {
    const friends = useStaticQuery(graphql`
        query FriendsQuery {
            allFriendsJson {
                nodes {
                    id
                    name
                    link
                    bio
                    avatarUrl
                }
            }
        }
    `).allFriendsJson.nodes

    return (
        <Layout>
            <SEO title="Friends" />
            <h1>Friends</h1>
            <div>
                {
                    friends.map(f =>
                        <div style={style.friendLink} key={f.id}>
                            <img style={style.avatar} src={f.avatarUrl} alt="avatar" />
                            <a href={f.link}>
                                <div style={style.meta}>
                                    <h4 style={style.friendName}>{f.name}</h4>
                                    <p style={style.friendBio}>{f.bio}</p>
                                </div>
                            </a>
                        </div>
                    )
                }
            </div>
        </Layout>
    )
}

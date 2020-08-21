import Layout from '../components/layout'
import SEO from '../components/seo'
import React from 'react'
import './about-me.css'

export default function AboutMePage() {
  return (
    <Layout>
      <SEO title="AboutMe" />
      <div>
        <h2>About Me</h2>
        <p>
          计算机科学初心者，但我可能不是真的喜欢？太多的 bug
          常常会令人非常沮丧（无论是自己写的还是别人写的被我遇到了）
        </p>
        <p>偶尔看一些电影，动漫，玩一些游戏</p>
        <p>以前经常听周杰伦，现在也常听</p>
        <p>很久之前玩了 To The Moon，所以有了现在的 ID</p>
      </div>
      <div>
        <h2>Find Me</h2>
        <p>Email: ???</p>
        <p className="media">
          GitHub: <a href="https://github.com/imbillow">@billow</a>
        </p>
        <p>
          Steam: <a href="https://steamcommunity.com/id/__billow__/">@billow</a>
        </p>
      </div>
    </Layout>
  )
}

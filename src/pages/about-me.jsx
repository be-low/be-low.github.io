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
          常常会令人非常沮丧（无论是自己写的还是遇到的别人写的）
        </p>
        <p>偶尔看一些电影，动漫，玩一些游戏</p>
        <p>以前经常听周杰伦，现在也常听</p>
        <p>不想把所有都写在这里（</p>
      </div>
      <div>
        <h2>Find Me</h2>
        <p>Email: YmlsbG93LmZ1bkBnbWFpbC5jb20K</p>
        <p className="media">
          GitHub: <a href="https://github.com/imbillow">@billow</a>
        </p>
        <p>
          Steam: <a href="https://steamcommunity.com/id/__billow__/">@billow</a>
        </p>
        <p>Twitter: <a href="https://twitter.com/o_o0_1">星之彩 [星空]</a></p>
        <p>Telegram: <a href="https://t.me/imbillow">billow</a></p>
      </div>
    </Layout>
  )
}

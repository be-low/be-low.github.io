# My blog using Jekyll

## 为什么我不再用 Jekyll

不想玩 jekyll 了, 前几天用 `--disable-march-tune-native` 解决的问题又出现了,大概本来
就是随机出现?而且 ruby 对 windows 不友好. 离开...

## Requirements:

- ruby
- bundler

### Install Dependences:

- For Arch Linux:

```shell
sudo pacman -Syu
sudo pacman -S ruby ruby-bundler
```

- For Windows (using Chocolate Package Manager)

```shell
choco install -y ruby
gem install jekyll bundler
```

## Run

```shell
bundle install --path vendor/bundle
bundle exec jekyll serve
```

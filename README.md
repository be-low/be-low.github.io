# My blog using Jekyll

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

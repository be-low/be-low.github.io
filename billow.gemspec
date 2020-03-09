# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "billow"
  spec.version       = "0.1.1"
  spec.authors       = ["billow"]
  spec.email         = ["billow.fun@gmail.com"]

  spec.summary       = "Another Jekyll theme"
  spec.homepage      = "https://github.com/iovw/billow-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README)!i) }

  spec.add_runtime_dependency "jekyll", ">= 3.8"
  spec.add_runtime_dependency "jekyll-seo-tag", ">= 2.1"

  spec.add_development_dependency "bundler", ">= 1.16"
end

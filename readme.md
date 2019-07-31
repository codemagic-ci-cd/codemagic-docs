# Codemagic public documentation

Welcome to the Codemagic public documentation repository. As a Codemagic user, you can contribute to our documentation to improve it. All pull requests will be reviewed by the Codemagic team. 


# Development

requires [Hugo static site generator](https://gohugo.io) latest from [releases page](https://github.com/gohugoio/hugo/releases) or with Homebrew

```
brew install hugo
```

For general info see [Hugo documentation](https://gohugo.io/documentation/).

Content is in `content` in blackfriday markdown format ([basic markdown example](https://github.com/markdownlint/markdownlint/blob/master/example/markdown_spec.md));

Layout templates are in `layouts` in ACE format instead of HTML ([documentation](https://github.com/yosssi/ace/blob/master/documentation/syntax.md)) and with go template syntax for "actions" ([Hugo documentation](https://gohugo.io/templates/introduction/)).

## Preview

Preview the site in http://localhost:1313/ by launching:
```
./serve.sh
```

It will usually refresh automatically when anything is changed.


# Codemagic community documentation



Welcome to the [Codemagic](https://codemagic.io/start/) public documentation repository. As a Codemagic user, you can contribute to our documentation to improve it. 

## Getting started

To contribute, fork the repository, make your changes and start a pull request. All pull requests will be reviewed by the Codemagic team. 

### Common issues page

We invite you to help out fellow Codemagic users by describing a frequent issue **and** providing a solution to it. Add your entry to the "Common issues" page under Troubleshooting. 

Please follow the format of existing issues for consistency.

1. Provide a clear **description** of the issue and the steps to reproduce it. Keep the description short and sweet.
2. Provide a **log output**, if relevant.
3. Specify the **Flutter** (and **Xcode**) version if you think these are relevant.
4. Describe the **solution** to overcome this issue.

## Development

Development requires [Hugo static site generator](https://gohugo.io) latest from [releases page](https://github.com/gohugoio/hugo/releases) or with Homebrew

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

It will usually refresh automatically when anything is changed

For testing things that require a subdomain, add a subdomain to your hosts file:

```bash
# example for MacOS

sudo sh -c "echo '127.0.0.1\tdocs.codemagic.local' >> /etc/hosts"
```

and preview the site in http://docs.codemagic.local:1313/ instead.

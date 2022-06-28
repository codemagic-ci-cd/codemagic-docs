# Codemagic community documentation

![codemagic-banner](assets/media/logo_banner.svg)

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

Development requires [Hugo static site generator](https://gohugo.io). It can be installed with Homebrew for Linux and macOS users
 
```
brew install hugo
```

Note that Hugo extended v0.77.0 is used in production. This Hugo version can be downloaded from [releases page](https://github.com/gohugoio/hugo/releases/tag/v0.77.0).

Windows users can install [Chocolatey](https://chocolatey.org/install). After that Hugo can be installed with

```
choco install hugo-extended --version 0.77.0
```

For general info see [Hugo documentation](https://gohugo.io/documentation/).

Content is in `content` in [CommonMark](https://commonmark.org/help/) markdown format, as implemented by [goldmark](https://github.com/yuin/goldmark);

Layout templates are in `layouts` in HTML format and go template syntax for "actions" ([Hugo documentation](https://gohugo.io/templates/introduction/)).

## Preview

Linux and macOS users can preview the site in http://localhost:1313/ by launching:

```
./serve.sh
```

Windows users launch:

```
./serve.cmd
```

It will usually refresh automatically when anything is changed

For testing things that require a subdomain, add a subdomain to your hosts file:

```bash
# example for MacOS

sudo sh -c "echo '127.0.0.1\tdocs.codemagic.local' >> /etc/hosts"
```

and preview the site in http://docs.codemagic.local:1313/ instead.

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

# Building

```
./build.sh
```

It builds the site to `./public/` folder - minified etc.
That folder can be deployed.

# Deploying

## Bitbucket

Run `deploy-to-production` pipeline on required branch. `./public/` folder will be deployed by bitbucket (by running `./ci-deploy.sh` script).

## Manual

Requires AWS credentials in environment variables (for updating S3).
We currently have an user `codemagic-hugo-deploy` with access to required buckets (directly attached policies).

```
export AWS_ACCESS_KEY_ID=ACTUALACCESSKEY
export AWS_SECRET_ACCESS_KEY=ACTUALSECRETACCESSKEY
```

For CloudFront invalidation, add distribution id

```
export CF_DISTRIBUTION_ID=ACTUAL_DIST_ID
```

prod builds need environment variable

```
HUGO_ENVIRONMENT=production
```

Requires s3deploy (can also download binary from [releases page](https://github.com/bep/s3deploy/releases/))

```
brew install bep/tap/s3deploy
```

Run the scripts:

```
./build.sh
./deploy.sh
```

#! /bin/sh

set -ex

cd "${0%/*}"

# requires env variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CF_DISTRIBUTION_ID

s3deploy \
  -bucket docs.codemagic.io \
  -public-access \
  -region us-east-1 \
  -source public \
  -distribution-id "$CF_DISTRIBUTION_ID"

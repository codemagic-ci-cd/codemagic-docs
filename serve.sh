#! /bin/sh

set -ex

cd "${0%/*}"

rm -rf dist/

./hugo server \
  --watch \
  --bind 0.0.0.0 \
  --disableFastRender \

# omit --bind=0.0.0.0 or replace with --bind=localhost to hide on local network
# it is enabled so you can preview the site in your mobile through wifi

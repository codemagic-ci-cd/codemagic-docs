#! /bin/sh

set -ex

cd "${0%/*}"

rm -rf public/

hugo --minify

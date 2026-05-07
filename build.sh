#! /bin/sh

set -ex

cd "${0%/*}"

rm -rf public/

hugo --minify

# Rename slug/index.md → slug.md to match the clean .md URL convention.
# Only processes directories that also contain an index.html, so section
# indexes and other non-page artifacts are left untouched.
find public -mindepth 2 -name "index.md" | while IFS= read -r f; do
  dir=$(dirname "$f")
  if [ -f "$dir/index.html" ]; then
    mv "$f" "$(dirname "$dir")/$(basename "$dir").md"
  fi
done
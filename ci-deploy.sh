#! /bin/sh

set -ex

dir="/usr/local/opt/bin/s3deploy"

if [ ! -d "$dir" ]; then
  mkdir -p "$dir"
  wget -qO- https://github.com/bep/s3deploy/releases/download/v2.3.0/s3deploy_2.3.0_Linux-64bit.tar.gz \
   | tar -C "$dir" -xvz s3deploy 
fi

PATH="$dir":$PATH

./build.sh
./deploy.sh

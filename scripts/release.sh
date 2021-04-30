#!/usr/bin/env bash
set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

usage() {
  cat <<EOF
Usage: $(basename "${BASH_SOURCE[0]}") <version | major | minor | patch> [-h] [-v]

This script creates a tag and publishes it to npm.

Available options:
-h, --help      Print this help and exit
-v, --verbose   Print script debug info
EOF
  exit
}

version=''

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
  if [[ $version ]]; then
    git stash -u
    git tag -d ${version}
    git reset --hard HEAD~1
    git stash pop
  fi
}

msg() {
  echo >&2 -e "${1-}"
}

die() {
  local msg=$1
  local code=${2-1} # default exit status 1
  msg "$msg"
  exit "$code"
}

parse_params() {
  version_arg=''

  while :; do
    case "${1-}" in
    -h | --help) usage ;;
    -v | --verbose) set -x ;;
    -?*) die "Unknown option: $1" ;;
    *) break ;;
    esac
    shift
  done

  version_arg=${1-}

  [[ -z $version_arg ]] && usage

  return 0
}

parse_params "$@"

npm run build
npm test
version=$(npm version $version_arg)
msg $version_arg
msg $version
git push origin ${version}
read -n1 -p "Are you publish ${version} to npm? (Y/n): " yn
if [[ $yn = Y ]]; then
  npm publish
else
  mgs "Publication is canceled."
  git push --delete origin $version
  cleanup
fi

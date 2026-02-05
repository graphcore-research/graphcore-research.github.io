#!/usr/bin/env bash
if [ -n "$1" ]; then
    export ONLY="$1"
fi
mkdocs serve --livereload --watch assets

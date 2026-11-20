#!/bin/bash
# Push hero-look files safely: only the named files plus their <script> lines, on origin's tip.
# usage: tools/push-look.sh <message-file> <after-script> <file>...   (js/ files get a script line after <after-script>)
set -e
MSG=$1; AFTER=$2; shift 2
git fetch -q origin; B=$(git rev-parse origin/main); echo "B=$B"
T=$(mktemp -d); export GIT_INDEX_FILE="$T/idx"; git read-tree $B
git show $B:index.html > "$T/index.html"
grep -q "<script src=\"$AFTER\"></script>" "$T/index.html" || { echo "anchor $AFTER missing on origin"; exit 5; }
LINES=""
for f in "$@"; do case $f in js/*) grep -q "\"$f\"" "$T/index.html" || LINES="$LINES\n<script src=\"$f\"></script>";; esac; done
[ -n "$LINES" ] && sed -i "s#^<script src=\"$AFTER\"></script>\$#&$LINES#" "$T/index.html"
H=$(git hash-object -w "$T/index.html"); git update-index --add --cacheinfo 100644,$H,index.html
for f in "$@"; do h=$(git hash-object -w $f); git update-index --add --cacheinfo 100644,$h,$f; done
C=$(git commit-tree $(git write-tree) -p $B -F "$MSG"); echo "C=$C"; git diff --stat $B $C | tail -4
unset GIT_INDEX_FILE; git fetch -q origin
[ "$(git rev-parse origin/main)" = "$B" ] || { echo "MOVED: run again"; exit 4; }
git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push origin $C:refs/heads/main 2>&1 | tail -1

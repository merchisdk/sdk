#!/usr/bin/env bash

out=$(find php/ -name \*.php -print0 | xargs -I{} -0 php -l {} | \
      grep -v "No syntax errors detected in ")

phpmd php/ text php/ruleset.xml && \
phpcs --standard=php/phpcs.xml -s -q . && \
if [ -n "$out" ]; then
   echo $out
   exit 1
else
   exit 0
fi

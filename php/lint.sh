#!/usr/bin/env bash

out=$(find sdk/php -name \*.php -print0 | xargs -I{} -0 php -l {} | \
      grep -v "No syntax errors detected in ")

phpmd sdk/php/ text ruleset.xml && \
phpcs -s -q sdk/php/ && \
if [ -n "$out" ]; then
   echo $out
   exit 1
else
   exit 0
fi

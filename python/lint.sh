#!/usr/bin/env bash

PYFILES=`find python/ -type f -name "*.py"`
mypy --ignore-missing-imports --check-untyped-defs --strict-optional\
      --follow-imports=skip \
      --config-file python/mypy.ini \
      --warn-no-return --warn-redundant-casts --warn-unused-ignores\
      $PYFILES || exit 1
pycodestyle $PYFILES || exit 1
pydocstyle $PYFILES || exit 1
flake8 $PYFILES || exit 1
pylint --rcfile python/pylintrc $PYFILES || exit 1

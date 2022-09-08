#!/usr/bin/env bash

PYFILES=`find python/ -type f -name "*.py" -not -path "*/tests/*"`
mypy --ignore-missing-imports --check-untyped-defs --strict-optional\
      --follow-imports=skip --non-interactive --install-types --no-incremental\
      --config-file python/mypy.ini \
      --warn-no-return --warn-redundant-casts --warn-unused-ignores\
      $PYFILES || exit 1
pycodestyle $PYFILES || exit 1
pydocstyle $PYFILES || exit 1
flake8 $PYFILES || exit 1
pylint --rcfile python/pylintrc $PYFILES || exit 1

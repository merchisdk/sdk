#!/usr/bin/env bash

PYFILES=`find python/ -type f -name "*.py" -not -path "*/tests/*"`

# Use ruff for linting (matches main project standards)
ruff check --config python/pyproject.toml $PYFILES || exit 1

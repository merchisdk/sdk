#!/usr/bin/env bash

phpunit  --version
phpunit  --whitelist php/src --coverage-clover php/clover.xml php/tests/test.php

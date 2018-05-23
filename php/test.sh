#!/usr/bin/env bash

phpunit  --whitelist php/src --coverage-clover php/clover.xml php/tests/test.php

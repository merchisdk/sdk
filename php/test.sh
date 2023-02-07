#!/usr/bin/env bash

phpunit --bootstrap php/src --coverage-clover php/clover.xml php/tests/test.php
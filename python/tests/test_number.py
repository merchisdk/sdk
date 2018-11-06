# pylint: disable=unneeded-not,nonexistent-operator
import math
import decimal
from hypothesis import given
from hypothesis.strategies import integers, decimals, floats
from python.util.number import Number


def test_can_construct_number_from_none():
    Number()

# pylint: disable=unneeded-not,nonexistent-operator
import math
import decimal
from hypothesis import given
from hypothesis.strategies import integers, decimals, floats
from sdk.python.util.number import Number


def test_can_construct_number_from_none():
    Number()


def test_can_construct_number_from_int():
    Number(42)


def test_can_construct_number_from_str():
    Number('-42.1')


def test_can_construct_number_from_number():
    Number(Number())


def test_can_construct_number_from_float():
    Number(42.1)


def test_can_construct_number_from_decimal():
    Number(decimal.Decimal('42.1'))


def test_cant_construct_number_from_object():
    try:
        Number(object())
        assert False
    except TypeError:
        pass


def test_too_many_places_throws():
    try:
        Number('1.0.1')
        assert False
    except ValueError:
        pass


def test_can_construct_with_scale():
    Number(scale=103)


def test_cant_construct_with_negative_scale():
    try:
        Number(scale=-2)
        assert False
    except ValueError:
        pass


def test_number_str_int():
    assert str(Number(42)) == '42'


def test_number_str_str():
    assert str(Number('42.1')) == '42.1'


def test_internal_digit_representation():
    assert Number('1').digits == '1'
    assert Number('01').digits == '1'
    assert Number('1.0').digits == '10'
    assert Number('1.00').digits == '100'
    assert Number('10.0').digits == '100'
    assert Number('-10.0').digits == '100'
    assert Number('010.0').digits == '100'
    assert Number('010.0', 0).digits == '10'
    assert Number('010.0', 2).digits == '1000'


def test_internal_scale():
    assert Number('1').scale == 0
    assert Number('1.0').scale == 1
    assert Number('01').scale == 0
    assert Number('1.010').scale == 3
    assert Number('100000000000000000000000000000.100').scale == 3
    assert Number('-10.0').scale == 1
    assert Number('010.0').scale == 1
    assert Number('010.0', 0).scale == 0
    assert Number('010.0', 5).scale == 5


def test_scale_shown_in_str():
    assert str(Number(1, 0)) == '1'
    assert str(Number(1, 1)) == '1.0'
    assert str(Number(1, 2)) == '1.00'
    assert str(Number(1, 3)) == '1.000'
    assert str(Number(10, 3)) == '10.000'


def test_can_rescale_up():
    assert Number(Number('0.01', 2), 3) == Number('0.010', 3)
    assert str(Number(Number('0.01', 2), 3)) == str(Number('0.010', 3))


def test_floating_point_construction_keeps_scale():
    """ Although python's IO routines do some complicated stuff to display
        floating point numbers with a small amount of decimal places,
        the actual scale is much higher. When constructing from a float
        therefore the entire scale should be kept. When constructing
        from an str the entire scale of the input should also be kept,
        but that is often smaller, because there is not any scale
        'hidden' by python. Note that `0.1` is not actually representable
        as a float, rather, the closest aproximation has 55 decimal places
        once properly serialised. Users wanting 0.1 to come out as 0.1,
        can consider using `Number(str(0.1))`. Note that small integers on
        the other hand can be represented exactly, so no 'extra' scale
        need be infered.
    """
    assert Number(0.1).scale == 55
    assert Number(1).scale == 0
    assert Number(99999999999.1).scale == 15


def test_floating_point_number_round_trips():
    assert float(Number(0.1)) == 0.1
    assert float(Number(1.0)) == 1.0
    assert float(Number(99999999999.1)) == 99999999999.1
    assert float(Number(42.7)) == 42.7
    assert float(Number(5e-324)) == 5e-324


def test_equality():
    assert Number(10) == Number(10)
    # works for negatives
    assert Number(-10) == Number(-10)
    # works for numbers with non zero decimal place
    assert Number(42.3) == Number(42.3)
    # proof that it does actually return False sometimes
    assert not Number(10) == Number(11)
    # invarient in the type given to the constructor
    assert Number('42') == Number(42)
    # invarient in the scale
    assert Number('42.000', 3) == Number('42', 0)
    # integers with different sign are unequal
    assert not Number(-1) == Number(1)
    # decimals with different sign are unequal
    assert not Number('0.1') == Number('-0.1')
    # there is no distinct negative zero
    assert Number('-0') == Number('0')
    # numbers with distinct decimal part are unequal
    assert not Number('42.7777') == Number('42.7778')


def test_inequality():
    assert not Number(10) != Number(10)
    assert not Number(-10) != Number(-10)
    assert not Number(42.3) != Number(42.3)
    assert Number(10) != Number(11)
    assert not Number('42') != Number(42)
    assert not Number('42.000', 3) != Number('42', 0)
    assert Number(-1) != Number(1)
    assert Number('0.1') != Number('-0.1')
    assert not Number('-0') != Number('0')
    assert Number('42.7777') != Number('42.7778')


def test_null_number_is_zero():
    assert Number() == Number(0)


def test_no_negative_zero_str():
    assert str(Number('-0')) == '0'


def test_addition():
    assert Number(1) + Number(2) == Number(3)
    assert Number(2) + Number(1) == Number(3)
    assert Number(2) + Number(0) == Number(2)
    assert Number(0) + Number(2) == Number(2)
    assert Number(0) + Number(0) == Number(0)
    assert Number(-0) + Number(-0) == Number(0)
    assert Number(-0) + Number(0) == Number(-0)
    assert Number(-0) + Number(0) == Number(0)
    assert Number(-1) + Number(-1) == Number(-2)
    assert Number(-1) + Number(1) == Number(0)
    assert Number(-1) + Number(2) == Number(1)
    assert Number(1) + Number(-2) == Number(-1)
    assert Number(4) + Number(-4) == Number(0)
    assert Number('1.2') + Number('1.2') == Number('2.4')
    assert Number('1.2') + Number('0.0') == Number('1.2')
    assert Number('-1.2') + Number('1') == Number('0')
    assert Number('-1.2') + Number('1.0') == Number('-0.2')
    assert Number('-10.2') + Number('1.0') == Number('-9.2')
    assert Number('100') + Number(42) == Number('142')
    assert Number('0.2') + Number('0.2') == Number('0.4')
    assert Number('0.5') + Number('0.5') == Number(1)
    assert Number(1) + Number(1) + Number(1) == Number(3)
    assert (Number(1) + Number(1)) + Number(1) == Number(3)
    assert Number(1) + (Number(1) + Number(1)) == Number(3)
    assert Number('100000000000000.000000000000000') +\
        Number('0.00000000000001') ==\
        Number('100000000000000.00000000000001')


def test_multiplication():
    assert Number(1) * Number(1) == Number(1)
    assert Number(2) * Number(2) == Number(4)
    assert Number(0) * Number(2) == Number(0)
    assert Number(2) * Number(0) == Number(0)
    assert Number(0) * Number(0) == Number(0)
    assert Number(2) * Number(4) == Number(8)
    assert Number(4) * Number(2) == Number(8)
    assert Number(1) * Number(2) == Number(2)
    assert Number(4) * Number(1) == Number(4)
    assert Number(-1) * Number(1) == Number(-1)
    assert Number(1) * Number(-1) == Number(-1)
    assert Number(-1) * Number(-1) == Number(1)
    assert Number(-1) * Number(-42) == Number(42)
    assert Number(42) * Number(-1) == Number(-42)
    assert Number('0.10') * Number('0.20') == Number('0.02')
    assert Number('-0.10') * Number('0.20') == Number('-0.02')
    assert Number('-0.10') * Number('-0.20') == Number('0.02')
    assert Number('10.0') * Number('0.50') == Number('5.0')
    assert Number('42424242') * Number('88888') == Number('3771006022896')
    assert Number('0.5') * Number('0.5') == Number('0.2')
    assert Number('0.500') * Number('0.500') == Number('0.25')
    assert Number('0.0') * Number('10') == Number('0')


def test_whole_part():
    assert Number('1.1234').whole_part() == '1'
    assert Number('10.1234').whole_part() == '10'
    assert Number('10.0').whole_part() == '10'
    assert Number('10').whole_part() == '10'
    assert Number('-10').whole_part() == '10'
    assert Number('-0').whole_part() == '0'
    assert Number('-0.2342').whole_part() == '0'


def test_decimal_part():
    assert Number('1.0000').decimal_part() == '0000'
    assert Number('1.0001').decimal_part() == '0001'
    assert Number('0.0001').decimal_part() == '0001'
    assert Number('0.0000').decimal_part() == '0000'
    assert Number('0').decimal_part() == ''
    assert Number('1').decimal_part() == ''
    assert Number('1.123').decimal_part() == '123'
    assert Number('1.9').decimal_part() == '9'
    assert Number('-1.0000').decimal_part() == '0000'
    assert Number('-1.0001').decimal_part() == '0001'
    assert Number('-0.0001').decimal_part() == '0001'
    assert Number('-0.0000').decimal_part() == '0000'
    assert Number('-0').decimal_part() == ''
    assert Number('-1').decimal_part() == ''
    assert Number('-1.123').decimal_part() == '123'
    assert Number('-1.9').decimal_part() == '9'


def test_negation():
    assert -Number('0') == Number('0')
    assert -Number('1') == Number('-1')
    assert -Number('-1') == Number('1')
    assert -Number('1.123') == Number('-1.123')
    assert -Number('10') == Number('-10')
    assert -Number('0.9') == Number('-0.9')


def test_positive():
    assert +Number('0') == Number('0')
    assert +Number('1') == Number('1')
    assert +Number('-1') == Number('-1')
    assert +Number('1.123') == Number('1.123')
    assert +Number('10') == Number('10')
    assert +Number('0.9') == Number('0.9')


def test_double_negation():
    assert --Number('0') == Number('0')
    assert --Number('1') == Number('1')
    assert --Number('-1') == Number('-1')
    assert --Number('1.123') == Number('1.123')
    assert --Number('10') == Number('10')
    assert --Number('0.9') == Number('0.9')


def test_subtraction():
    assert Number('1') - Number('0') == Number('1')
    assert Number('42') - Number('0') == Number('42')
    assert Number('1') - Number('1') == Number('0')
    assert Number('1.91') - Number('0.91') == Number('1')
    assert Number('0.00') - Number('0.91') == Number('-0.91')


def test_abs():
    assert abs(Number('0')) == Number('0')
    assert abs(Number('1')) == Number('1')
    assert abs(Number('0.1')) == Number('0.1')
    assert abs(Number('0.5')) == Number('0.5')
    assert abs(Number('0.9')) == Number('0.9')
    assert abs(Number('0.99')) == Number('0.99')
    assert abs(Number('0.999')) == Number('0.999')
    assert abs(Number('1.999')) == Number('1.999')
    assert abs(Number('1999')) == Number('1999')
    assert abs(Number('-0')) == Number('0')
    assert abs(Number('-1')) == Number('1')
    assert abs(Number('-0.1')) == Number('0.1')
    assert abs(Number('-0.5')) == Number('0.5')
    assert abs(Number('-0.9')) == Number('0.9')
    assert abs(Number('-0.99')) == Number('0.99')
    assert abs(Number('-0.999')) == Number('0.999')
    assert abs(Number('-1.999')) == Number('1.999')
    assert abs(Number('-1999')) == Number('1999')


def test_mod():
    try:
        assert Number('0') % Number('0')
        assert False
    except ZeroDivisionError:
        pass
    assert Number('0') % Number('1') == Number('0')
    assert Number('1.0') % Number('2.0') == Number('1')
    assert Number('2') % Number('2') == Number('0')
    assert Number('4') % Number('2') == Number('0')
    assert Number('10') % Number('4') == Number('2')
    assert Number('101') % Number('36') == Number('29')
    assert Number('10.1') % Number('9.0') == Number('1.1')
    assert Number('101') % Number('-4') == Number('-3')
    assert Number('-101') % Number('4') == Number('3')
    assert Number('-101') % Number('-4') == Number('-1')


def test_floordiv():
    try:
        assert Number('1') // Number('0')
        assert False
    except ZeroDivisionError:
        pass
    assert Number('1') // Number('2') == Number('0')
    assert Number('2') // Number('1') == Number('2')
    assert Number('4') // Number('2') == Number('2')
    assert Number('4.5') // Number('2.25') == Number('2')
    assert Number('4.9') // Number('1.6') == Number('3')
    assert Number('4.9') // Number('-1.6') == Number('-4')
    assert Number('-4.9') // Number('-1.6') == Number('3')
    assert Number('-4.9') // Number('1.6') == Number('-4')


def test_truediv():
    try:
        assert Number('1') / Number('0')
        assert False
    except ZeroDivisionError:
        pass
    assert Number('1.0') / Number('2.0') == Number('0.5')
    assert Number('1.0') / Number('3.0') == Number('0.3')
    assert Number('3.0') / Number('1.0') == Number('3.0')
    assert Number('3.1') / Number('1.0') == Number('3.1')
    assert Number('3.1') / Number('2.5') == Number('1.2')
    assert Number('-3.1') / Number('2.5') == Number('-1.2')
    assert Number('-3.10') / Number('-2.50') == Number('1.24')
    assert Number('-3.1') / Number('-2.5') == Number('1.2')
    assert Number('3.1') / Number('-2.5') == Number('-1.2')
    assert Number('0.99') / Number('10') == Number('0')


def test_divmod():
    assert divmod(Number('-3.10'), Number('2.40')) ==\
        (Number('-2.0'), Number('1.7'))


def test_ceil():
    assert math.ceil(Number('1')).exactly_equal(Number(1))
    assert math.ceil(Number('0.9')).exactly_equal(Number(1))
    assert math.ceil(Number('0.5')).exactly_equal(Number(1))
    assert math.ceil(Number('0.1')).exactly_equal(Number(1))
    assert math.ceil(Number('0')).exactly_equal(Number(0))
    assert math.ceil(Number('-0.9')).exactly_equal(Number(0))
    assert math.ceil(Number('-0.5')).exactly_equal(Number(0))
    assert math.ceil(Number('-0.1')).exactly_equal(Number(0))
    assert math.ceil(Number('-1')).exactly_equal(Number(-1))


def test_floor():
    assert math.floor(Number('1')).exactly_equal(Number(1))
    assert math.floor(Number('0.9')).exactly_equal(Number(0))
    assert math.floor(Number('0.5')).exactly_equal(Number(0))
    assert math.floor(Number('0.1')).exactly_equal(Number(0))
    assert math.floor(Number('0')).exactly_equal(Number(0))
    assert math.floor(Number('-0.9')).exactly_equal(Number(-1))
    assert math.floor(Number('-0.5')).exactly_equal(Number(-1))
    assert math.floor(Number('-0.1')).exactly_equal(Number(-1))
    assert math.floor(Number('-1')).exactly_equal(Number(-1))
    assert math.floor(Number('0.51')).exactly_equal(Number(0))


def test_round():
    assert round(Number('1')).exactly_equal(Number(1))
    assert round(Number('0.9')).exactly_equal(Number(1))
    assert round(Number('0.5')).exactly_equal(Number(1))
    assert round(Number('0.1')).exactly_equal(Number(0))
    assert round(Number('0')).exactly_equal(Number(0))
    assert round(Number('-0.9')).exactly_equal(Number(-1))
    assert round(Number('-0.5')).exactly_equal(Number(-1))
    assert round(Number('-0.1')).exactly_equal(Number(0))
    assert round(Number('-1')).exactly_equal(Number(-1))
    assert round(Number('0.51')).exactly_equal(Number(1))
    assert round(Number('23.5')).exactly_equal(Number(24))
    assert round(Number('-23.5')).exactly_equal(Number(-24))
    assert round(Number('1', 0), 3).exactly_equal(Number('1.000'))


def test_exactly_equal():
    assert Number('0').exactly_equal(Number('0'))
    assert Number('0').exactly_equal(Number('-0'))
    assert Number('1').exactly_equal(Number('1'))
    assert not Number('1').exactly_equal(Number('-1'))


def test_signum():
    assert Number('-1.234').sign() == -1
    assert Number('-0').sign() == 0
    assert Number('0').sign() == 0
    assert Number('1.234').sign() == 1


def test_int_roundtrips():
    assert int(Number(1)) == 1
    assert int(Number(0)) == 0
    assert int(Number(-1)) == -1
    assert int(Number(42)) == 42


def test_le():
    assert Number(-1) <= Number(0)
    assert Number(1) <= Number(1.001)
    assert not Number(1) <= Number(0)
    assert Number(-0) <= Number(0)
    assert Number(0) <= Number(0)
    assert Number(0.001) <= Number(0.1)
    assert Number(-0.1) <= Number(-0.0001)
    assert Number(42) <= Number(10000000000)
    assert Number(42) <= Number(42)


def test_lt():
    assert Number(-1) < Number(0)
    assert Number(1) < Number(1.001)
    assert not Number(1) < Number(0)
    assert not Number(-0) < Number(0)
    assert not Number(0) < Number(0)
    assert Number(0.001) < Number(0.1)
    assert Number(-0.1) < Number(-0.0001)
    assert Number(42) < Number(10000000000)
    assert not Number(42) < Number(42)


def test_gt():
    assert not Number(-1) > Number(0)
    assert not Number(1) > Number(1.001)
    assert Number(1) > Number(0)
    assert not Number(0) > Number(-0)
    assert not Number(0) > Number(0)
    assert not Number(-0) > Number(0)
    assert not Number(0.001) > Number(0.1)
    assert not Number(-0.1) > Number(-0.0001)
    assert not Number(42) > Number(10000000000)
    assert not Number(42) > Number(42)


def test_ge():
    assert not Number(-1) >= Number(0)
    assert not Number(1) >= Number(1.001)
    assert Number(1) >= Number(0)
    assert Number(0) >= Number(-0)
    assert Number(0) >= Number(0)
    assert Number(-0) >= Number(0)
    assert not Number(0.001) >= Number(0.1)
    assert not Number(-0.1) >= Number(-0.0001)
    assert not Number(42) >= Number(10000000000)
    assert Number(42) >= Number(42)


def test_bool():
    assert not bool(Number('0'))
    assert not bool(Number('0.0'))
    assert not bool(Number('0.00'))
    assert not bool(Number('-0.00'))
    assert bool(Number('-0.01'))
    assert bool(Number('1'))


@given(integers())
def test_fuzzy_number_str_int(i):
    assert str(Number(i)) == str(i)


@given(decimals())
def test_can_construct_from_decimal(d):
    Number(d)


@given(floats(allow_infinity=False, allow_nan=False))
def test_fuzzy_floating_point_number_round_trips(f):
    assert float(Number(f)) == f


@given(floats(allow_infinity=False, allow_nan=False))
def test_floating_point_equality(f):
    assert Number(f) == f


@given(integers())
def test_int_round_trips(i):
    assert int(Number(i)) == i


@given(integers())
def test_int_equality(i):
    assert Number(i) == i


@given(integers())
def test_int_inequality(i):
    assert not Number(i) != Number(i)


@given(integers(), integers())
def test_integer_addition(a, b):
    assert Number(a) + Number(b) == a + b

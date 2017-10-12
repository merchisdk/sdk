import math
import decimal


class Number(object):
    r""" Numbers with fixed finite scale and arbitrary strict precision.

        Objects of this class represent numbers with a fixed, and finite scale,
        that is, a fixed number of digits after the 'decimal place'. Numbers
        may have arbitrary strict precision - that is, any number of total
        digits is supported, limited only by machine memory etc.

        Basic fixed-point arithmatic operations over numbers are supported,
        accessed through the usual python operators (+, *, int(), ...).

        This class was created with financial calculations in mind, but it may
        be used anywhere that fixed-point arithmatic is apropriate, and where
        high-performance numerics is not a first class concern (we try not to
        use any really stupid algorithms, but the operations over Number have
        not been micro-optimised).

        Numbers may be instantiated from other Numbers, str, int, float and
        decimal.Decimal. Caution should be used when converting from float,
        as the total floating-point precision will be preserved by default,
        which may not be what you expect.

            Number('3.14')

        The scale of the created Number will be automatically inferred as
        the maximum scale of the input. In the example above, the resulting
        Number will have a scale of 2. That choice may be overriden with an
        explicit argument:

            Number(3, scale=5)

        There is no option to limit the strict precision of a Number.

        Once created, Numbers should be treated as immutable.

        There is no distinction between a negative and positive zero. There
        are no "Nan" or "inf" values.

        Operations between two Numbers with differing scale result in a Number
        with a scale equal to that of the smaller of the operands. If you wish
        to maintain the larger precision, you should first "rescale up" the
        operand with the smaller scale. For example:

            Number('0.001', 3) + Number('0.01', 2)

        is `.exactly_equal()` to `Number('0.01')`. If you wanted "0.011", you
        should have instead done:

            Number('0.001', 3) + Number(Number('0.01', 2), 3)

        Motivation: we want to perform calculations on monetary amounts. These
        amounts always have a fixed scale (e.g. the smallest unit might be 1
        cent). Even intermediate values in a long calculation need to be kept
        in some standard scaling, whether it be one cent or something else. The
        calculations must be detirministic, reproducable, and exact -- an error
        of even one cent is enough to make an accountant throw away the result.
        The calculations should never reach impossible or meaningless values
        like negative zero, or infinity, or NaN, but there is no effective limit
        on how large an individual amount might be -- transactions involve
        finite but unbounded numbers. Alternatives to this Number class are
        unsatisfactory:

        Integer/ Long/ Bigint types allow for computing results exactly, but
        are awkward to work with because you have be aware of your scaling
        factor when programming. You can think of Number as this type of value
        where the scale factor is kept around with the number and managed for
        you automatically (operations over Number are also much slower as a
        result).

        The Q number format allows for exact fixed-point arithmatic at arbitrary
        scales, but the interaction between amounts of different scale is
        complicated, and you still have to be aware of what scale each amount is
        in. Additionally, there doesn't seem to be any nice published
        implementation for python. Q also supports only finite strict precision.

        Using floats for currency is a particularly common and dangerous
        beginner mistake. Unlike the other options, which are mostly just
        inconvient, calculating with floats allows computing values
        which are flat out wrong. Remember that half of all floats reside in
        the inteval [-1.0, 1.0], and yet, a majority of the real numbers within
        that inteval have no exact floating point represention. The conversion
        to/from floating point and decimal string is complicated and involves
        hiding the true/exact represented value. Also floats support only finite
        strict precision, yet their possible scale decreases with the size of
        the number represented. floats are apropriate for use in things like
        simulation, where aproximation is good enough and speed is at a premium.
        It is possible to estimate or calculate bounds on the error of a
        floating point algorithm so that you know how accurate your simulation
        is. But fincancial calculations must be completely accurate. For more
        information see:

        - https://stackoverflow.com/questions/3730019/why-not-use-double-or-\
           float-to-represent-currency
        - https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
        - https://spin.atomicobject.com/2014/08/14/currency-rounding-errors/
        - https://www.noelherrick.com/blog/always-use-decimal-for-money
        - https://vladzloteanu.wordpress.com/2010/01/11/why-you-shouldnt-use-\
           float-for-currency-floating-point-issues-explained-for-ruby-and-ror/
        - https://en.wikipedia.org/wiki/Kahan_summation_algorithm

        The python standard library Decimal class allows for exact fixed-point
        arithmatic, but it imposes a finite strict precision, which
        we do not really care for at all, and has a difficult API to control.
        Meanwhile it provides no API for setting the scale, which is the
        parameter we actually care about. You can think of Number as Decimals
        where the scale rather than the strict precision is the tunable
        parameter.

        There are still cautions with using Number. Firstly performance is
        slower than e.g. using ints directly. Secondly algebriac laws like
        associativity are only aproximate with Number, as with float, due to
        the rounding that occurs with each operation.
    """

    __slots__ = ["scale", "digits", "_sign"]

    def __init__(self, value=None, scale=None):
        r""" Create a Number.

            If no value or None is provided, the created number is zero.

            Otherwise value may be a str of the form -?\d+(\.\d+)?, an int,
            float, another number or a Decimal.

            The second parameter, scale, indicates the number of decimal places
            the number is too have. If more decimal places where provided in
            the value than the selected scale, the excess digits will be
            truncated. If less where provided, the remaining will be assumed to
            be zeros.

            If no scale, or None is provided, the scale will be automatically
            inferred from the value. The scale of an str is the number of
            decimal places in the string. The scale of an int is 0. The scale
            of a float is whatever is nessecary to preserve its entire
            exact representation.
        """
        if value is None:
            value = 0

        if isinstance(value, int):
            self.digits = str(abs(value))
            if value >= 0:
                self._sign = 0
            else:
                self._sign = 1
            self.scale = 0
        elif isinstance(value, str):
            value = value.strip()
            if value.startswith('-'):
                self._sign = 1
                value = value[1:]
            else:
                self._sign = 0
            value = value.split('.')
            self.digits = str(int(value[0]))
            if len(value) == 1:
                self.scale = 0
            elif len(value) == 2:
                int(value[1])
                self.scale = len(value[1])
                self.digits += value[1]
            else:
                raise ValueError("cannot create number from {}".format(value))
        elif isinstance(value, Number):
            self.scale = value.scale
            self.digits = value.digits
            self._sign = value._sign
        elif isinstance(value, float):
            if value >= 0:
                self._sign = 0
            else:
                self._sign = 1
            n, d = abs(value).as_integer_ratio()
            k = d.bit_length() - 1
            self.digits = str(n * 5 ** k)
            if len(self.digits) < k:
                self.digits = ('0' * (k - len(self.digits))) + self.digits
            self.scale = k
        elif isinstance(value, decimal.Decimal):
            sign, digits, exponent = value.as_tuple()
            self._sign = sign
            self.digits = ''.join(map(str, digits))
            self.scale = exponent * -1
        else:
            raise TypeError("cannot convert {} to Number".format(type(value)))

        if scale is not None:
            if not isinstance(scale, int):
                raise ValueError("scale must be integer")
            if scale < 0:
                raise ValueError("scale must be non-negative")
            if scale < self.scale:
                self.digits = self.digits[:scale - self.scale]
            else:
                self.digits += '0' * (scale - self.scale)
            self.scale = scale

    def whole_part(self):
        """ Efficiently return the floor of the absolute value as an str. """
        if self.scale == 0:
            return self.digits
        return self.digits[:-self.scale]

    def decimal_part(self):
        """ Efficiently return the digits after the decimal point as an str. """
        if self.scale == 0:
            return ''
        return self.digits[-self.scale:]

    def __str__(self):
        """ Return a representation of the number as an str.

            Access as `str(number)`.

            Negative sign will only be present if the number is less than zero.
            Positive prefix will never be shown.

            The decimal seperator is always '.' regardless of locale, and will
            always be shown, even if the decimal part of the number is 0.

            The full number of decimal places will be shown according to the
            `scale` of the number, even if they are all zero.

            Two numbers being `==` does not imply that they have the same
            `str()` value, as their scale may be different, however two numbers
            being `.exactly_equal()` implies that they must have the same
            str format.
        """
        result = ''
        if self._sign == 1 and self:
            result += '-'
        if self.scale == 0:
            result += self.digits
        else:
            result += self.whole_part()
            result += '.'
            result += self.decimal_part()
        return result

    def __repr__(self):
        """ Return a representation of how to construct the Number as an str.

            Access as `repr(number)`.

            The return value will include a call to the number constructor with
            all parameters nessecary to construct an identical number. Given
            a suitable environment, for all number n, the property

                eval(repr(n)).exactly_equal(n)

            holds.
        """
        return "Number(\"{}\", scale={})".format(str(self), self.scale)

    def __add__(self, other):
        """ Return a number which is the sum of self an other, rounded.

            Access as `a + b`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        other = Number(other)
        result = Number()
        a = int(self.digits) * (10 ** other.scale)
        a *= (-1) ** self._sign
        b = int(other.digits) * (10 ** self.scale)
        b *= (-1) ** other._sign
        total = a + b
        if total < 0:
            result._sign = 1
            total = abs(total)
        else:
            result._sign = 0
        total_str = str(total)
        computedscale = self.scale + other.scale
        if len(total_str) < computedscale + 1:
            total_str = '0' * (computedscale - len(total_str) + 1) + total_str
        wantedscale = min(self.scale, other.scale)
        if computedscale > wantedscale:
            result.digits = total_str[:wantedscale - computedscale]
        else:
            result.digits = total_str + '0' * (wantedscale - computedscale)
        result.scale = wantedscale
        return result

    def __neg__(self):
        """ Return a Number which is the negation of the original.

            Access as `-n`.
        """
        result = Number(self)
        if result._sign == 0:
            result._sign = 1
        else:
            result._sign = 0
        return result

    def __pos__(self):
        """ Return the original number.

            Access as `+n`.

            Equivilent to the identity function.
        """
        return Number(self)

    def __sub__(self, other):
        """ Return the difference between self and other.

            Access as `self - other`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        return self + -other

    def __rsub__(self, other):
        """ Return the difference between other and self.

            Access as `other - self`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        return other + -self

    def __abs__(self):
        """ Return the absolute value of the number.

            Access as `abs(n)`.

            The result has the same scale and digits as the original, but the
            sign will always be positive.
        """
        if self._sign == 1:
            return -self
        return +self

    def __mod__(self, other):
        """ Return the remainder after division by other.

            Access as `a % b`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        return divmod(self, other)[1]

    def __floordiv__(self, other):
        """ Return the floor of the result of dividing the number by other.

            Access as `a // b`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        return divmod(self, other)[0]

    def __truediv__(self, other):
        """ Return the result of dividing the number by other.

            Access as `a / b`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        other = Number(other)
        abs_other = abs(other)
        q, r = divmod(abs(self), abs_other)
        x = (10 ** r.scale) * r
        qd, _ = divmod(x, abs_other)
        whole_part = q.digits
        decimal_part = qd.digits
        result = Number()
        result.digits = whole_part + decimal_part
        result._sign = self._sign ^ other._sign
        result.scale = r.scale
        return result

    def __rmul__(self, other):
        """ Return the product of the other number and this one.

            Access as `b * a`, which is the same value as `a * b`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        return self * other

    def __divmod__(self, other):
        """ Return a tuple of the quotient and remainder after division by
            other.

            Access as `divmod(a, b)`.

            The scale of the quotient is 0, and the scale of the remainder is
            the scale of the operand with the smaller scale.
        """
        other = Number(other)
        a = int(self.digits) * (10 ** other.scale)
        a *= (-1) ** self._sign
        b = int(other.digits) * (10 ** self.scale)
        b *= (-1) ** other._sign
        q, r = divmod(a, b)
        shift = other.scale + self.scale
        r = Number(r, shift)
        if shift != 0:
            r.digits = r.digits[:-shift]
        if len(r.digits) < r.scale + 1:
            r.digits = '0' * (r.scale + 1 - len(r.digits)) + r.digits
        return (Number(q, 0), Number(r, min(self.scale,
                                            other.scale)))

    def __ceil__(self):
        """ Return the smallest integer Number larger than or equal to self.

            Access as `math.ceil(n)`.

            The scale of the result is zero.
        """
        result = int(self.whole_part()) * (-1) ** self._sign
        if self >= 0 and self.decimal_part() and int(self.decimal_part()) != 0:
            return Number(result + 1)
        return Number(result)

    def __floor__(self):
        """ Return the largest integer Number smaller than or equal to self.

            Access as `math.floor(n)`.

            The scale of the result is zero.
        """
        result = int(self.whole_part()) * (-1) ** self._sign
        if self < 0 and self.decimal_part() and int(self.decimal_part()) != 0:
            return Number(result - 1)
        return Number(result)

    def sign(self):
        """ The sign or signum function on Numbers.

            -1 for negative numbers, 0 for 0, 1 for positive numbers.
        """
        return self._cmp(0)

    def __round__(self, n=0):
        """ Return the nearest number to self that is representable in the
            specified scale. If two numbers are equally close, break ties
            by favouring the direction away from zero.

            In other words the rounding mode is "round to nearest" with
            "round half away from zero" tie-breaking, which is also known as
            "comercial rounding".

            Access as `round(n, scale)`.
        """
        def round_one(yy):
            """ Round to integer. This fixes the rounding mode. """
            return yy.sign() * math.floor(abs(yy) + 0.5)

        if n < 0:
            raise ValueError
        if n == 0:
            return round_one(self)

        y = self * Number(10 ** n, self.scale)
        q = round_one(y)
        m = Number('0.' + ('0' * (n - 1)) + '1')
        return Number(q, n) * m

    def exactly_equal(self, other):
        """ Return True if this number is indistinguishable from other, else
            return False.

            Two Numbers being `exactly_equal` implies that they will have
            the same `str()` and `repr()` representations, and that they can
            substituted for each other in any operation without any observable
            effect. However it does not imply that `id(a) == id(b)`.
        """
        return self.digits == other.digits and\
            self.scale == other.scale and\
            (self._sign == other._sign or self == 0)

    def __mul__(self, other):
        """ Return the product of this number and the other.

            Access as `a * b`, which is the same value as `b * a`.

            The scale of the result is the scale of the operand with the
            smaller scale.
        """
        other = Number(other)
        result = Number()
        a = int(self.digits)
        a *= (-1) ** self._sign
        b = int(other.digits)
        b *= (-1) ** other._sign
        total = a * b
        if total < 0:
            result._sign = 1
            total = abs(total)
        else:
            result._sign = 0
        total_str = str(total)
        computedscale = self.scale + other.scale
        if len(total_str) < computedscale + 1:
            total_str = '0' * (computedscale - len(total_str) + 1) + total_str
        wantedscale = min(self.scale, other.scale)
        if computedscale > wantedscale:
            result.digits = total_str[:wantedscale - computedscale]
        else:
            result.digits = total_str + '0' * (wantedscale - computedscale)
        result.scale = wantedscale
        return result

    def __float__(self):
        """ Return the closest float to the number.

            Access as `float(n)`.
        """
        return float(str(self))

    def __int__(self):
        """ Return the whole part of the number as an int, truncating any
            fractional part.

            Access as `int(n)`.
        """
        return math.trunc(self)

    def __trunc__(self):
        """ Return the whole part of the number as an int, truncating any
            fractional part.

            Access as `math.trunc(n)`.
        """
        return int(self.whole_part()) * (-1) ** self._sign

    def __delattr__(self, attr):
        """ Prevent attributes from being removed from numbers. """
        raise TypeError

    def _cmp(self, other):
        """ Return -1 if the number is smaller than other, return 0 if
            the numbers are equal, or return 1 if the number is bigger than
            other.

            Numbers with different scale may be equal. There is no distinction
            between a positive of negative zero.
        """
        other = Number(other)
        a = int(self.digits) * (10 ** other.scale)
        a *= (-1) ** self._sign
        b = int(other.digits) * (10 ** self.scale)
        b *= (-1) ** other._sign
        if a < b:
            return -1
        if b < a:
            return 1
        return 0

    def __eq__(self, other):
        """ Return True if the number is equal to the other, otherwise return
            False.

            Access as `a == b`.
        """
        return self._cmp(Number(other)) == 0

    def __le__(self, other):
        """ Return True if the number is less than or equal to the other,
            otherwise return False.

            Access as `a <= b`.
        """
        return self._cmp(Number(other)) != 1

    def __lt__(self, other):
        """ Return True if the number is less than the other, otherwise return
            False.

            Access as `a < b`.
        """
        return self._cmp(Number(other)) == -1

    def __ne__(self, other):
        """ Return True if the number is not equal to the other, otherwise
            return False.

            Access as `a != b`, which is equivilent to `not (a == b)`.
        """
        return self._cmp(Number(other)) != 0

    def __gt__(self, other):
        """ Return True if the number is greater than the other, otherwise
            return False.

            Access as `a > b`.
        """
        return self._cmp(Number(other)) == 1

    def __ge__(self, other):
        """ Return True if the number is greater than or equal to the other,
            otherwise return False.

            Access as `a >= b`.
        """
        return self._cmp(Number(other)) != -1

    def __bool__(self):
        """ Return False if the number is equal to zero, else return True.

            Access as `bool(n)` or in any context that accepts a boolean, such
            as the condition expression of an if-statement, or one of the
            operands of `and` or `or` or any such predicate.
        """
        return self != Number(0)

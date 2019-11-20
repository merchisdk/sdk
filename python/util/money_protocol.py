# -*- coding: utf-8 -*-
# coding:utf-8
from decimal import Decimal
import decimal
import babel.numbers


MAX_CENTS = 9999999999999

currency_map = {"ALL": "L",
                "AFN": "؋",
                "ARS": "$",
                "AWG": "ƒ",
                "AUD": "$",
                "AZN": "₼",
                "BSD": "$",
                "BBD": "$",
                "BYR": "p.",
                "BZD": "BZ$",
                "BMD": "$",
                "BOB": "Bs.",
                "BAM": "KM",
                "BWP": "P",
                "BGN": "лв",
                "BRL": "R$",
                "BND": "$",
                "KHR": "៛",
                "CAD": "$",
                "KYD": "$",
                "CLP": "$",
                "CNY": "¥",
                "COP": "$",
                "CRC": "₡",
                "HRK": "kn",
                "CUP": "₱",
                "CZK": "Kč",
                "DKK": "kr",
                "DOP": "RD$",
                "XCD": "$",
                "EGP": "£",
                "SVC": "$",
                "EEK": "kr",
                "EUR": "€",
                "FKP": "£",
                "FJD": "$",
                "GHC": "₵",
                "GIP": "£",
                "GTQ": "Q",
                "GGP": "£",
                "GYD": "$",
                "HNL": "L",
                "HKD": "$",
                "HUF": "Ft",
                "ISK": "kr",
                "INR": "₹",
                "IDR": "Rp",
                "IRR": "﷼",
                "IMP": "£",
                "ILS": "₪",
                "JMD": "`J$",
                "JPY": "¥",
                "JEP": "£",
                "KES": "KSh",
                "KZT": "лв",
                "KPW": "₩",
                "KRW": "₩",
                "KGS": "лв",
                "LAK": "₭",
                "LVL": "Ls",
                "LBP": "£",
                "LRD": "$",
                "LTL": "Lt",
                "MKD": "ден",
                "MYR": "RM",
                "MUR": "₨",
                "MXN": "$",
                "MNT": "₮",
                "MZN": "MT",
                "NAD": "$",
                "NPR": "₨",
                "ANG": "ƒ",
                "NZD": "$",
                "NIO": "C$",
                "NGN": "₦",
                "NOK": "kr",
                "OMR": "﷼",
                "PKR": "₨",
                "PAB": "B/.",
                "PYG": "Gs",
                "PEN": "S/.",
                "PHP": "₱",
                "PLN": "zł",
                "QAR": "﷼",
                "RON": "lei",
                "RUB": "₽",
                "RMB": "￥",
                "SHP": "£",
                "SAR": "﷼",
                "RSD": "Дин.",
                "SCR": "₨",
                "SGD": "$",
                "SBD": "$",
                "SOS": "S",
                "ZAR": "R",
                "LKR": "₨",
                "SEK": "kr",
                "CHF": "CHF",
                "SRD": "$",
                "SYP": "£",
                "TZS": "TSh",
                "TWD": "NT$",
                "THB": "฿",
                "TTD": "TT$",
                "TRY": "₺",
                "TRL": "₤",
                "TVD": "$",
                "UGX": "USh",
                "UAH": "₴",
                "GBP": "£",
                "USD": "$",
                "UYU": "$U",
                "UZS": "лв",
                "VEF": "Bs",
                "VND": "₫",
                "YER": "﷼",
                "ZWD": "Z$"}


def format_currency(amount, decimal_places, currency) -> str:
    """ Return a string where amount has been printed to decimal_places, with
        the symbol for the given ISO currency code prepended.
    """
    format_string = "¤0." + ("0" * decimal_places)
    return babel.numbers.format_currency(amount, currency, format_string)


def display_price(money):
    """ Given an amount of dollars as a Decimal, return a unicode string
        suitable for displaying the amount.
    """
    return str(quantize(money))


def invoice_format_currency(amount, currency) -> str:
    """ Return a string where amount has been printed to 3 decimal places, with
        the symbol for the given ISO currency code prepended.
    """
    currency_icon = currency_map[currency]
    amount_decimal = "{0:0.3f}".format(amount)
    return "{0}{1}".format(currency_icon, amount_decimal)


def currency_converter_factory(convert_rule):
    """ Generate a function which takes a number liked input (which can be a
        number or a string of number), convert it by applying function
        covert_rule on it and return the converted value.
    """
    def converter(money_input):
        if money_input is None:
            return None
        return convert_rule(float(money_input))
    return converter


def quantize(amount):
    """ Round the decimal amount down so there are only 2 decimal places """
    return amount.quantize(Decimal('.01'), rounding=decimal.ROUND_DOWN)


def total_tax(jobs):
    """ The sum of the tax of each job in the given sequence of jobs. """
    return sum(tax(job.cost, job.tax_type) for job in jobs)


def tax(amount, tax_type):
    """ Return the amount of tax applicable on amount, given a type of tax,
        which may be None for no tax. Amount may be given in cents or dollars.
    """
    if tax_type is None:
        return Decimal(0.0)
    return (amount * tax_type.tax_percent) / Decimal(100.0)


def subtotal(jobs):
    """ Return the sum of the costs, less tax, of each Job in the given
        sequence.
    """
    return sum(job.cost for job in jobs)

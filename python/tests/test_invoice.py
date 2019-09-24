from sdk.python.invoices import Invoice


def test_invoice_has_shipments_attribute():

    invoice = Invoice()
    assert invoice.shipments is None

from python.jobs import Job


def test_withhold_scalar_non_edits():
    j = Job()
    data = {'quantity': 42}
    # loading data without marking it as fresh
    j.from_json(data, makes_dirty=False)
    # since quanity is not fresh, it will be excluded from POSTs
    assert 'quantity' not in j.serialise(exclude_old=True)
    # but we can still get it's value if we want it
    assert j.serialise(exclude_old=False)[0]['quantity'] == 42
    # manually touching quantity marks it as fresh
    j.quantity = 24
    # therefore, it is included by default even in POST requests
    assert j.serialise(exclude_old=True)[0]['quantity'] == 24
    assert j.serialise(exclude_old=False)[0]['quantity'] == 24


def test_force_dirty_scalar_edits():
    j = Job()
    data = {'quantity': 42}
    # loading data while insisting that it be considered fresh
    j.from_json(data, makes_dirty=True)
    # since quanity is fresh, it will be included in POSTs
    assert j.serialise(exclude_old=True)[0]['quantity'] == 42
    assert j.serialise(exclude_old=False)[0]['quantity'] == 42


def test_withhold_object_non_edits():
    # load new data without marking it fresh. this time with a nested user
    j = Job()
    new_data = {'client': {'user': {'name': 'turtle'}}, 'quantity': 42}
    j.from_json(new_data, makes_dirty=False)
    assert j.client.name == 'turtle'
    output = j.serialise(exclude_old=True)[0]
    assert 'client' not in output
    assert 'quantity' not in output
    # now we touch the users name
    j.client.name = 'elephant'
    # although j.client was not touched directly we need it in the output now
    output = j.serialise(exclude_old=True)[0]
    assert output['client']['name'] == 'elephant'
    assert 'quantity' not in output


def test_withhold_array_non_edits():
    # load new data without marking it fresh. this time with nested drafts
    j = Job()
    new_data = {'quantity': 42,
                'drafts': [{'draft': {'viewed': False}}]}
    j.from_json(new_data, makes_dirty=False)
    assert j.drafts[0].viewed is False
    output = j.serialise(exclude_old=True)[0]
    assert 'drafts' not in output
    assert 'quantity' not in output
    # now we touch the drafts viewed
    j.drafts[0].viewed = True
    # although j.drafts was not touched directly we need it in the output now
    output = j.serialise(exclude_old=True)[0]
    assert output['drafts'][0]['viewed'] is True
    assert 'quantity' not in output

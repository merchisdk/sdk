import os

PLATFORM_NAME = 'Merchi'
PLATFORM_COPYRIGHT = 2017


def load_configuration(app, config_keys):
    for name in config_keys:
        value = os.environ.get(name)
        if value is None:
            raise RuntimeError("missing config for {}".format(name))
        app.config[name] = value

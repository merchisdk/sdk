import os

PLATFORM_NAME = 'Merchi'
PLATFORM_COPYRIGHT = 2017


def load_configuration(app, config_keys):
    for (name, required, default) in config_keys:
        value = os.environ.get(name)
        if not value:
            if required:
                raise RuntimeError("missing config for {}".format(name))
            else:
                value = default
        app.config[name] = value

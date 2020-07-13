from envparse import env

PLATFORM_NAME = 'merchi'
PLATFORM_COPYRIGHT = 2019


def load_configuration(app, config_keys):
    for name, cast_type in config_keys:
        app.config[name] = env(name, cast=cast_type)

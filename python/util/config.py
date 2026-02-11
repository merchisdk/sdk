from envparse import env

PLATFORM_NAME = 'Merchi'
PLATFORM_COPYRIGHT = 2022


def load_configuration(app, config_keys):
    for config_key in config_keys:
        if len(config_key) == 3:
            name, cast_type, default = config_key
            app.config[name] = env(name, cast=cast_type, default=default)
        else:
            name, cast_type = config_key
            app.config[name] = env(name, cast=cast_type)

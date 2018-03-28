import os.path


class CannotAquireLock(RuntimeError):
    """ Exception raised if lock already held. """
    pass


class FileLock():
    """ Context manager for holding and releasing a lock implemented with a
        named file in /tmp.
    """

    def __init__(self, name):
        self.filename = '/tmp/' + name + '.lock'

    def __enter__(self):
        if os.path.isfile(self.filename):
            raise CannotAquireLock
        open(self.filename, 'a').close()

    def __exit__(self, *args):
        try:
            os.remove(self.filename)
        except OSError:
            pass

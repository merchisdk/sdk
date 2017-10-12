""" Tools to create or renew certificates issues by letsencrypt.

    Note that to allow this to be run non-root the script
    `allow_merchi_user_install_certs.sh` or equivilent should first be run
    to grant sudo priviledges for the commands used here. Likewise that file
    should be updated if any of the commands used here change.
"""

import subprocess
import shlex


def make_cert_directory():
    """ Make the well known directory for placing lets encrypt challenge/
        response files into, if it does not already exist.
    """
    dir = '/tmp/letsencrypt-auto/.well-known/acme-challenge/'
    subprocess.check_call(['sudo', 'mkdir', '-p', dir])
    subprocess.check_call(['sudo', 'chmod', '-R', "ugo+rx",
                           '/tmp/letsencrypt-auto'])


def fetch_cert(email, domain_names):
    """ Contact letsencrypt servers and ask them for a new certificate. """
    cmd = ('sudo /usr/local/bin/certbot certonly --renew-by-default '
           '--agree-tos --email' ' {} --server '
           'https://acme-v01.api.letsencrypt.org/directory --webroot -w'
           ' /tmp/letsencrypt-auto/')
    cmd = cmd.format(shlex.quote(email))
    for domain_name in domain_names:
        cmd += ' -d ' + shlex.quote(domain_name)
    subprocess.check_output(cmd, shell=True)


def load_cert():
    """ Cause NGINX to reload its configuration file, including picking up
        any changes in TLS certificates.
    """
    subprocess.check_call(['sudo', 'service', 'nginx', 'reload'])


def renew_certs(email, domain_names):
    """ Create certificate for the given list of str domain names, using the
        provided email address for the letsencrypt account, then load the
        result into NGINX. Invoking for the first time will set up the
        required directory structure. Invoking subsequent times will renew
        the exisiting certificate (an operation which is less heavily rate
        limited by letsencrypt).
    """
    make_cert_directory()
    fetch_cert(email, domain_names)
    load_cert()

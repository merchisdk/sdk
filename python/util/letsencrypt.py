""" Tools to create or renew certificates issues by letsencrypt.

    Note that to allow this to be run non-root the script
    `allow_merchi_user_install_certs.sh` or equivilent should first be run
    to grant sudo priviledges for the commands used here. Likewise that file
    should be updated if any of the commands used here change.
"""

import subprocess
import shlex
import logging
from backend.error import log


def make_cert_directory():
    """ Make the well known directory for placing lets encrypt challenge/
        response files into, if it does not already exist.
    """
    dir = '/tmp/letsencrypt-auto/.well-known/acme-challenge/'
    subprocess.check_call(['mkdir', '-p', dir])
    subprocess.check_call(['chmod', '-R', "ugo+rx", '/tmp/letsencrypt-auto'])


def fetch_cert(email, cert_name, domain_names):
    """ Contact letsencrypt servers and ask them for a new certificate. """
    cmd = ('/usr/bin/certbot certonly --renew-by-default ' +
           '--cert-name ' + cert_name + ' ' +
           '--non-interactive --agree-tos --email {} --server ' +
           'https://acme-v01.api.letsencrypt.org/directory --webroot -w' +
           ' /tmp/letsencrypt-auto/')
    cmd = cmd.format(shlex.quote(email))
    for domain_name in domain_names:
        cmd += ' -d ' + shlex.quote(domain_name)
    log_msg = "renew cmd: '{}'".format(cmd)
    log(logging.INFO, log_msg)
    output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
    log_msg = "certbot output: '{}'".format(output)
    log(logging.INFO, log_msg)


def load_cert():
    """ Cause NGINX to reload its configuration file, including picking up
        any changes in TLS certificates.
    """
    log_msg = "attempting to reload proxy server..."
    log(logging.INFO, log_msg)

    def restart_container(name):
        cmd = 'bash -c \'echo -e "POST http://docker/containers/{}/kill?signal'
        cmd += '=HUP HTTP/1.0\r\n"  | nc.openbsd -U /var/run/docker.sock\''
        cmd = cmd.format(name)
        subprocess.call(cmd, shell=True)

    # depending on the name of the current user, and whether the production or
    # production setup proxies are running, only one of the following calls
    # is likely to succeed, but it is easier to just request all possibilities
    # restart themselves, and ignore any failures, rather than finding out
    # which, if any, are actually running
    restart_container("dockercompose_proxy_1")
    restart_container("dockercompose_proxy_setup_1")
    restart_container("admin_proxy_1")
    restart_container("admin_proxy_setup_1")
    restart_container("merchi_proxy_1")
    restart_container("merchi_proxy_setup_1")


def renew_certs(email, cert_name, domain_names):
    """ Create certificate for the given list of str domain names, using the
        provided email address for the letsencrypt account, then load the
        result into NGINX. Invoking for the first time will set up the
        required directory structure. Invoking subsequent times will renew
        the exisiting certificate (an operation which is less heavily rate
        limited by letsencrypt).
    """
    make_cert_directory()
    fetch_cert(email, cert_name, domain_names)
    load_cert()

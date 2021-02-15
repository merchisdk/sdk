""" Tools to create or renew certificates issues by letsencrypt. """

import os
import subprocess
import shlex
import logging


def fetch_cert(email, cert_name, domain_names, log, config):
    """ Contact letsencrypt servers and ask them for a new certificate. """
    cmd = ('certbot certonly --cert-name ' + cert_name + ' ' +
           '--non-interactive --agree-tos --email {} ' +
           '--dns-route53 ' +
           '--server https://acme-v02.api.letsencrypt.org/directory ' +
           '--config-dir /etc/letsencrypt/config ' +
           '--logs-dir /etc/letsencrypt/logs ' +
           '--work-dir /etc/letsencrypt/work')
    cmd = cmd.format(shlex.quote(email))
    for domain_name in domain_names:
        cmd += ' -d' + shlex.quote(domain_name)
    log_msg = "renew cmd: '{}'".format(cmd)
    log(logging.INFO, log_msg)
    env = os.environ.copy()
    env["AWS_ACCESS_KEY_ID"] = config['AWS_ACCESS_KEY_ID']
    env["AWS_SECRET_ACCESS_KEY"] = config['AWS_SECRET_ACCESS_KEY']
    output = subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT,
                                     env=env)
    log_msg = "certbot output: '{}'".format(output)
    log(logging.INFO, log_msg)


def load_cert(log):
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

    restart_container("merchi_proxy_1")


def renew_certs(email, cert_name, domain_names, log, config):
    """ Create certificate for the given list of str domain names, using the
        provided email address for the letsencrypt account, then load the
        result into NGINX. Invoking for the first time will set up the
        required directory structure. Invoking subsequent times will renew
        the exisiting certificate (an operation which is less heavily rate
        limited by letsencrypt).
    """
    fetch_cert(email, cert_name, domain_names, log, config)
    load_cert(log)

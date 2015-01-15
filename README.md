# Bakery

 [![Build Status](https://travis-ci.org/balanced-ops/bakery.svg?branch=master)](https://travis-ci.org/balanced-ops/bakery)

Uses fpm to bake packages (i.e. debian)

## Supported

- Deb packages

## Usage

Boot it up: `vagrant up --no-provision`

### Ansible

Make sure the requirements are installed:

    ansible-galaxy install -r ansible-bakery/ansible-requirements.yml -p `pwd`/ansible-bakery/roles

Then: `env PLAY='statsd' vagrant provision`

Will execute `ansible-bakery/${PLAY}.yml`.

## Docker

Docker support is enabled for easy testing of your debian packages.

## Deploying your debian package

**Requires Vagrant 1.7.1+**

To deploy to **unstable**: `vagrant push unstable -- <dpkg name> [optional: --force]`

To deploy to **main**: `vagrant push main -- <dpkg name> [optional: --force]`

Examples:

- `vagrant push unstable -- balanced-collectd_5.4.1-balanced-1_amd64.deb`
- `vagrant push unstable -- balanced-collectd_5.4.1-balanced-1_amd64.deb --force`
- `vagrant push main -- balanced-collectd_5.4.1-balanced-1_amd64.deb`
- `vagrant push main -- balanced-collectd_5.4.1-balanced-1_amd64.deb --force`

## License

MIT/BSD

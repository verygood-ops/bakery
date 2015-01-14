# Bakery

Uses fpm to bake packages (i.e. debian)

## Supported

- Deb packages

## Usage

Boot it up: `vagrant up --no-provision`

### Ansible

Make sure the requirements are installed:

    ansible-galaxy install -r ansible/ansible-requirements.yml -p `pwd`/ansible/roles

Then: `env PLAY='statsd' vagrant provision`

Will execute `ansible/${PLAY}.yml`.

## License

MIT/BSD

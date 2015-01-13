# Bakery

Uses fpm to bake packages (i.e. debian)

## Supported

- Deb packages

## Usage

Boot it up: `vagrant up --no-provision`

### Ansible

Make sure the requirements are installed:

    ansible-galaxy install -r ansible/ansible-requirements.yml -p `pwd`/ansible/roles

Then: `env ANSIBLE_TAGS='statsd,anotherplaybook' vagrant provision`

Will execute `ansible/build-lab.yml` and execute whatever is tagged. If the `ANSIBLE_TAGS` environment variable is not set, a simple debug message will print telling you to set it.

## License

MIT/BSD

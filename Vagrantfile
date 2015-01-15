# -*- mode: ruby -*-
# vi: set ft=ruby :
# noinspection RubyResolve
require 'erb'
# noinspection RubyResolve
require 'ostruct'

# noinspection RubyResolve
Vagrant.require_version '>= 1.6.5'

BRIDGE_NETWORK = '10.2.0.10'
BRIDGE_NETMASK = '255.255.0.0'

PUSH_SCRIPT_TEMPLATE =<<EOF
  # get vagrant's configuration to the ssh machine
  _CONFIG=$(vagrant ssh-config | tr -d '\n' | sed 's@[[:space:]]+@ @g')
  # we need the ssh key to log in
  KEY=$(echo ${_CONFIG} | awk -F" " '{ print $16 }')
  # we need the ssh key to log in
  INVENTORY="localhost:$(echo ${_CONFIG} | awk -F' ' '{ print $8 }'),"
  ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook \
     --private-key=${KEY}  \
     --user=vagrant        \
     --connection=ssh      \
     --inventory="${INVENTORY}" ansible-bakery/publish-package.yml \
        -vvvv -e 'local_bridge_network=<%= local_bridge_network %>' \
              -e 'local_bridge_netmask=<%= local_bridge_netmask %>' \
              -e 'local_user=<%= local_user %>' \
              -e 'publish_destination=<%= destination %>'  \
              -e 'package_cmd=<%= package_cmd %>'
EOF


Vagrant.configure(2) do |config|
  # noinspection RubyResolve
  config.vm.define :ubuntu, {:primary => true} do |ubuntu|
    ubuntu.vm.box = ENV['DISTRO'] || 'ubuntu/precise64'

    warn "[\e[1m\e[31mWARNING\e[0m]: The guest vm has access to your ~/.gnupg directory"
    ubuntu.vm.synced_folder '.', '/vagrant', :disabled => false
    ubuntu.vm.synced_folder '~/.gnupg', '/home/vagrant/.gnupg'

    ubuntu.vm.network :private_network, :ip => BRIDGE_NETWORK, :netmask => BRIDGE_NETMASK
    ubuntu.vm.network 'forwarded_port', :guest => 2375, :host => 2375

    # noinspection RubyResolve
    ubuntu.vm.provider :virtualbox do |vb|
      # The --nicpromisc2 translates to Promiscuous mode for nic2, where nic2 -> eth1.
      # So --nocpromisc3 would change that setting for eth2, etc.
       vb.customize ['modifyvm', :id, '--nicpromisc2', 'allow-all']
    end

    if ENV['PLAY']
      # noinspection RubyResolve
      ubuntu.vm.provision :ansible do |ansible|
        # https://docs.vagrantup.com/v2/provisioning/ansible.html
        ansible.playbook = "ansible-bakery/#{ENV['PLAY']}.yml"
        ansible.host_key_checking = false
        if ENV['ANSIBLE_TAGS']
          ansible.tags = ENV['ANSIBLE_TAGS'].split(',')
        end
        ansible.verbose = ENV['ANSIBLE_VERBOSE'] || 'v' # can be vvv
        ansible.extra_vars = {
            :local_bridge_network => BRIDGE_NETWORK,
            :local_bridge_netmask => BRIDGE_NETMASK,
            :local_user => ENV['USER']
        }
      end
    else
      warn "[\e[1m\e[33mNOTICE\e[0m]: Not running ansible provisioner. " \
           "Run a play like this: PLAY='statsd' vagrant provision"
    end
    # The following line terminates all ssh connections. Therefore
    # Vagrant will be forced to reconnect.
    # That's a workaround to have the docker command in the PATH and
    # add Vagrant to the docker group by logging in/out
    ubuntu.vm.provision 'shell', :inline =>
      "ps aux | grep 'sshd:' | awk '{print $2}' | xargs kill"
  end

  # noinspection RubyResolve
  # vagrant push unstable -- <dpkg name> [optional: --force]
  # TODO: not tested to work w/ multiple vms
  config.push.define :unstable, {:strategy => 'local-exec'} do |push|
    params = []
    # This guard allows the nice -- option at the end
    if ARGV.join(' ').include?('push unstable --')
      separator = ARGV.index('--')
      params = ARGV.slice!(separator, ARGV.length)
      params.shift
    end
    namespace = OpenStruct.new(
        :local_bridge_network => BRIDGE_NETWORK,
        :local_bridge_netmask => BRIDGE_NETMASK,
        :local_user => ENV['USER'],
        :destination => 'unstable',
        :package_cmd => "#{params.join(' ')}"
    )
    template = ERB.new(PUSH_SCRIPT_TEMPLATE)
    push.inline = template.result(namespace.instance_eval { binding })
  end

  # noinspection RubyResolve
  # vagrant push main -- <dpkg name> [optional: --force]
  # TODO: not tested to work w/ multiple vms
  config.push.define :main, {:strategy => 'local-exec'} do |push|
    params = []
    # This guard allows the nice -- option at the end
    if ARGV.join(' ').include?('push main --')
      separator = ARGV.index('--')
      params = ARGV.slice!(separator, ARGV.length)
      params.shift
    end
    namespace = OpenStruct.new(
        :local_bridge_network => BRIDGE_NETWORK,
        :local_bridge_netmask => BRIDGE_NETMASK,
        :local_user => ENV['USER'],
        :destination => 'main',
        :package_cmd => "#{params.join(' ')}"
    )
    template = ERB.new(PUSH_SCRIPT_TEMPLATE)
    push.inline = template.result(namespace.instance_eval { binding })
  end


end

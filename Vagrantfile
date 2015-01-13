# -*- mode: ruby -*-
# vi: set ft=ruby :
# noinspection RubyResolve


Vagrant.require_version '>= 1.6.5'

BRIDGE_NETWORK = '10.10.0.10'
BRIDGE_NETMASK = '255.255.0.0'

Vagrant.configure(2) do |config|
  # noinspection RubyResolve
  config.vm.define :ubuntu, {:primary => true} do |ubuntu|
    ubuntu.vm.box = 'ubuntu/precise64'
    ubuntu.vm.synced_folder '.', '/vagrant', :disabled => false

    ubuntu.vm.network :private_network, :ip => BRIDGE_NETWORK, :netmask => BRIDGE_NETMASK

    # noinspection RubyResolve
    ubuntu.vm.provider :virtualbox do |vb|
      # The --nicpromisc2 translates to Promiscuous mode for nic2, where nic2 -> eth1.
      # So --nocpromisc3 would change that setting for eth2, etc.
       vb.customize ['modifyvm', :id, '--nicpromisc2', 'allow-all']
    end

    # noinspection RubyResolve
    ubuntu.vm.provision :ansible do |ansible|
      # https://docs.vagrantup.com/v2/provisioning/ansible.html
      ansible.playbook = 'ansible/build-lab.yml'
      ansible.host_key_checking = false
      ansible.tags = (ENV['ANSIBLE_TAGS'] || 'NONE_SELECTED').split(',')
      ansible.extra_vars = {
          :local_bridge_network => BRIDGE_NETWORK,
          :local_bridge_netmask => BRIDGE_NETMASK,
          :local_user => ENV['USER'],
      }
    end

  end

end

# requires docker 1.4.0
# run as: docker run -v /var/log/:/var/log -p 25826:25826 test-collectd:latest
FROM ubuntu:12.04

# Set correct environment variables.
ENV LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 DEBIAN_FRONTEND=noninteractive

# Set sane locale
RUN locale-gen en_US.UTF-8 && \
    dpkg-reconfigure locales

ADD collectd.tar /tmp/

# Install updates
RUN apt-get -qq update  \
    && \
    apt-get install -y --no-install-recommends \
       python-software-properties \
       supervisor                 \
       python-pip                 \
       gdebi-core                 \
       python-setuptools          \
    && \
    gdebi -n /tmp/packages/balanced-collectd_*.deb \
    && \
    # Clean up APT when done.
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# collectd
EXPOSE 25826/udp
VOLUME /var/log
ADD ./collectd.conf /opt/collectd/etc/collectd.conf
ADD ./supervisord-collectd.conf /etc/supervisor/conf.d/
CMD ["/usr/bin/supervisord", "-n"]
SHELL=/bin/bash
DEST?=

# docker build
.PHONY: test-%

test-%:
	env COPY_EXTENDED_ATTRIBUTES_DISABLE=true \
	tar cvf tests/$*/$*.tar packages/*${*}*.deb && \
	cd tests/$* && \
	docker build -t test-$* --rm=false .


# base:
# env COPY_EXTENDED_ATTRIBUTES_DISABLE=true COPYFILE_DISABLE=true \
# tar cvf docker/base.tar --exclude '\._*' \
# -C docker/build				\
# ansible_hosts				\
# ansible-requirements.yml	\
# wubot.yml					\
# wubot_overrides.yml

# # docker commands
# build:
# docker build -t $(NAME):$(VERSION) --rm docker

# run: secrets
# docker run --env-file ./secrets.env -d balanced/wubot

# tag_latest:
# docker tag $(NAME):$(VERSION) $(NAME):latest

# push:
# docker push $(NAME):$(VERSION)

# #

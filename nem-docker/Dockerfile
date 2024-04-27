FROM ubuntu:24.04
MAINTAINER NEM Contributors

# install dependencies (install tzdata first to prevent 'geographic area' prompt)
RUN apt-get update > /dev/null \
	&& apt-get install -y tzdata \
	&& apt-get install -y tmux supervisor procps jq unzip curl gnupg openjdk-11-jre-headless git libssl-dev maven ca-certificates \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# NEM software
RUN curl -L http://bob.nem.ninja/nis-0.6.101.tgz > nis-0.6.101.tgz

# New signature scheme, not always published
RUN sha=$(curl -L -s http://hugealice.nem.ninja:7890/transaction/get?hash=$(curl -L -s http://bob.nem.ninja/nis-0.6.101.tgz.sig \
	| grep txId | sed -e 's/txId: //') | jq -r '.transaction.message.payload[10:74]')  \
	&& echo "$sha nis-0.6.101.tgz"  > /tmp/sum \
	&& sha256sum -c /tmp/sum

RUN tar zxf nis-0.6.101.tgz

ARG USER_ID=1000

RUN useradd --uid $USER_ID nem
RUN mkdir -p /home/nem/nem/nis/
RUN chown nem /home/nem/nem -R

# servant
RUN curl -L https://bob.nem.ninja/servant_0_0_4.zip > servant.zip
RUN unzip servant.zip

# the sample is used as default config in the container
COPY ./custom-configs/supervisord.conf.sample /etc/supervisord.conf
# wallet
EXPOSE 7777
# NIS
EXPOSE 7890
# servant
EXPOSE 7880

CMD ["/usr/bin/supervisord"]

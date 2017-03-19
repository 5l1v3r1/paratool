FROM ubuntu:16.04

# Thanks, https://gist.github.com/julionc/7476620.

RUN apt-get update && \
  apt-get install -y build-essential \
    chrpath \
    libssl-dev \
    libxft-dev \
    libfreetype6 \
    libfreetype6-dev \
    libfontconfig1 \
    libfontconfig1-dev && \
  rm -rf /var/lib/apt/lists/*

ENV PHANTOM_JS "phantomjs-2.1.1-linux-x86_64"

RUN apt-get update && \
  apt-get install -y wget && \
  cd /tmp && \
  wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2 && \
  tar xvjf $PHANTOM_JS.tar.bz2 && \
  mv $PHANTOM_JS /usr/local/share && \
  rm $PHANTOM_JS.tar.bz2 && \
  ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin && \
  apt-get remove -y wget && \
  rm -rf /var/lib/apt/lists/*

COPY ./src /paratool

RUN chmod +x /paratool/paraphrase && \
  ln -sf /paratool/paraphrase /usr/local/bin/paraphrase

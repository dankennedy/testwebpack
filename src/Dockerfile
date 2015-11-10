FROM    node

ADD ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

ENV NODE_PATH lib
ENV NODE_ENV development

CMD ["node", "lib/server/server.js"]

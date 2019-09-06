FROM node:10-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# RUN mkdir -p /home/node/schedule_service && chown -R node:node /home/node/schedule_service

WORKDIR /home/node/marks_service

# USER node

ADD . /home/node/marks_service

RUN mkdir /home/node/marks_service/logs
RUN chmod 755 /home/node/marks_service/logs
RUN npm install pm2 -g

EXPOSE 8451

CMD [ "pm2-runtime", "index.js" ]
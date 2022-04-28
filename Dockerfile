FROM node:14.17.3

WORKDIR /chat

COPY ./ /chat

RUN  npm install --production

CMD [ "npm", "run", "prod" ]

# EXPOSE 8989

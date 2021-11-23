FROM node

ENV ROOT /minishcap-service
WORKDIR ${ROOT}
ADD . ${ROOT}

RUN npm i
EXPOSE 3334
CMD ["npm", "run", "start"]
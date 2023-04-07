FROM node:17.0.1

# COPY ./app /app

RUN npm install -g nodemon
COPY ./autostart.sh /
RUN chmod +x /autostart.sh
CMD ["sh", "autostart.sh"]

# docker run -it -p 3000:3000 --volume ${PWD}/app:/app --name=node_project_container --rm node_docker
#docker exec -it node_project_container ./bin/bash
# In a Dockerfile, the AS keyword is used to name a build stage. In the line FROM node:20.9.0 as dev, it defines a build stage based on the node:20.9.0 image and names this stage dev. This allows you to refer to this particular stage later in the Dockerfile, especially useful in multi-stage builds where you might want to copy artifacts from one stage to another or to target a specific stage for building.
FROM node:22.15.0 AS dev

WORKDIR /react

COPY package*.json /react/
COPY .nvmrc /react/
RUN npm install

COPY . /react/

EXPOSE 5173 

CMD ["npm", "run", "dev", "--", "--host"]

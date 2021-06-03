FROM node:latest
RUN mkdir -p /raji/service
COPY . /raji/service
WORKDIR /raji/service
RUN npm install
ENV PORT 8080
ENV MASTER_KEY NDTFmfh9W0EqLSVrWoHb82wKmykfnRAW
ENV JWT_SECRET Ack1LWCNKzSTHWQI03j1auqyapiy5VLC
ENV IP 0.0.0.0
ENV SENDGRID_KEY 951QP0Bh40GBv4FoDAD5La9O1M8EoszO
ENV MONGODB_URI mongodb+srv://cwang:Wc640801@cluster0.uoq3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
EXPOSE 8080
CMD ["npm", "start"]
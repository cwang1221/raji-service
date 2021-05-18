FROM node:latest
RUN mkdir -p /raji/service
COPY . /raji/service
WORKDIR /raji/service
RUN npm install
ENV PORT 8080
ENV MASTER_KEY xxx
ENV JWT_SECRET xxx
ENV IP 0.0.0.0
ENV SENDGRID_KEY xxx
ENV MONGODB_URI xxx
EXPOSE 8080
CMD ["npm", "start"]
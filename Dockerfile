FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://localhost:27017/m77ag
ENV JWT_SECRET=300Winmag!
ENV JWT_EXPIRATION=7d

EXPOSE 3000

CMD ["npm", "start"]

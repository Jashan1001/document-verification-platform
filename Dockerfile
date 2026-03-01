FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma client inside container
RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
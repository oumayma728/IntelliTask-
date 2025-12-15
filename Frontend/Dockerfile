FROM node:20


#setting working directory

WORKDIR /app
# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install  --legacy-peer-deps

# Copy the rest of the React app
COPY . .

EXPOSE 3000

CMD [ "npm" ,"start" ]
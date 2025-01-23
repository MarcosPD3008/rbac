FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Expose application port
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start:prod"]
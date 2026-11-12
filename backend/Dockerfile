# ---- Build stage: installs everything and compiles TypeScript ----
FROM node:22-alpine AS build
WORKDIR /app

# The in-memory MongoDB used by the tests is not needed to build the image
ENV MONGOMS_DISABLE_POSTINSTALL=1

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: only production dependencies and the compiled code ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
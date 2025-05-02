# Use with:  docker build  --pull --rm -f 'Dockerfile' '.' --output './dist'

# COMPILE SVELTE AS JS LIB WITH A NODE DOCKER IMAGE
FROM node:23-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm install @rollup/rollup-linux-x64-musl
RUN npm run build

# COPY ONLY THE BUNDLED LIB AND CSS
FROM scratch
COPY --from=build /app/packages/build/dist/* /
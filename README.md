# Chroma.js

[![CircleCI](https://circleci.com/gh/chroma-sdk/chroma-js.svg?style=svg&circle-token=d066d70fae54ca26b07aad36250e78d478c62790)](https://circleci.com/gh/chroma-sdk/chroma-js)

Chroma.js is a library that provides a simple interface to interact with Razer's REST api.

## Building from source

After cloning this repository the Typescript Code needs to be transpiled.

This is done either by using your IDE (VS-Code is configured) or by going into the "sdk" directory and running:

```node
npm install
npm run build
```

or

```node
yarn install
yarn run build
```

Now the `dist` folder contains all the needed files.

Afterwards you can start the example by executing the following in the example folder:

```node
npm install
npm run dev
```

or

```node
yarn install
yarn run dev
```

This will start a Javascript development Server running on `http://localhost:8080`

To run the Node.js version just do in the example directory:

```node
yarn install
yarn run build
node dist/Server.bundle.js
```
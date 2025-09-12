// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.handler.js",
  client: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.client.js",
  bundle: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.bundle.js",
  config: "/uv.config.js",
  sw: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.sw.js",
};

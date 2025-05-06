self.__uv$config = {
  prefix: '/s/internet/',
  bare: 'https://t.thecappuccino.site',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/s/u/handler.js',
  bundle: '/s/u/bundle.js',
  config: '/s/u/config.js',
  sw: '/s/u/sw.js',
};

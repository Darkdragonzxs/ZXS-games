self.__uv$config = {
  prefix: '/s/internet/',
  bare: 'https://t.thecappuccino.site',
  encodeUrl: (input) => {
    try {
      let url = new URL(input);
      return __uv$config.prefix + __uv$config.encode(url.href);
    } catch (e) {
      return __uv$config.prefix + __uv$config.encode('http://' + input);
    }
  },
  encode: (str) => btoa(unescape(encodeURIComponent(str))),
  decode: (str) => decodeURIComponent(escape(atob(str))),
};

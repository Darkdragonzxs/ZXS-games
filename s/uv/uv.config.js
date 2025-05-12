self.__uv$config = {
  prefix: '/s/internet/',
  bare: 'https://t.thecappuccino.site', 
  encodeUrl: function(input) {
    try {
      const url = new URL(input);
      return this.prefix + this.encode(url.href);
    } catch (e) {
      return this.prefix + this.encode('http://' + input);
    }
  },
  encode: (str) => btoa(unescape(encodeURIComponent(str))),
  decode: (str) => decodeURIComponent(escape(atob(str))),
};

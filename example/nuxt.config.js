import chineseS2T from 'chinese-s2t';

export default {
  head: {
    title: 'vue-i18n-loader usage example',
  },
  build: {
    extend(webpackConfig, { isDev, isClient }) {
      webpackConfig.resolveLoader.modules.push('..'); // for test only
      webpackConfig.module.rules.push({ // this loader will generate *.messages.json beside *.vue files
        test: /\.vue$/,
        exclude: [/node_modules/,/\.nuxt/],
        loader: 'vue-i18n-loader',
        enforce: 'pre',
        options: {
          updateMessagesFile: isClient && isDev, // only update messages file when it's dev and client(when using ssr)
          cacheTime: 3000,
          // regString to match simplified chinese characters
          regString: '[\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u2018\u2019\u201c\u201d\uff08\uff09\u3001\uff1f\uff01\ufe15\u300a\u300b]+',
          // separator: '##', // match texts surrounded by '##', like '##text##'
          // Loader will use existing translations, if there is not, will use text generated by translator
          languages: [{
            // the first language declared here will be the default language
            key: 'zh_Hans_CN',
            translator: (matched) => {
              // Delete repeat mark R, sometimes we need a text to be translated differently
              return matched.replace(/^[R]+/, '');
            },
            ignoreDeprecated: true,
          }, {
            key: 'zh_Hant_HK',
            translator: (matched) => {
              // example to auto translate simplified chinese to traditional
              return chineseS2T.s2t(matched.replace(/^[R]+/, ''));
            },
            ignoreDeprecated: true,
          }, {
            key: 'en_US',
            // if translator is not given, the loader will use the default translator(translator of the first language, zh_Hans_CN here)
          }],
        }
      });
    },
  },
  plugins:[
    '~/plugins/i18n',
  ]
};

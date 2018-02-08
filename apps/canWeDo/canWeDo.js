define([
'config',
'TemplateProxy',
'text!apps/download.html',
'cookie'
], function (config, tplProxy, downloadTpl,  cookie) {
    'use strict'
    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
        },
        option: {
          downloadDom: $(".download")
        }
    };
})
;
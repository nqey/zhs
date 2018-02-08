define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/factoryDetails/details.html',
    'text!apps/download.html',
    'bxslider',
    'Utils',
    'cookie'  
], function (http, config, tplProxy, tpl, downloadTpl, bxslider, utils, cookie) {
    'use strict'

    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //获取Url参数里包含的查询信息列表
            that.option.urlParams = utils.getUrlParams();
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
            return that._render();
        },
        option: {
          //hash参数
          urlParams: null,
          //工厂详情接口地址
          ENTERPRISE_FACTORY_ADDRESS: config.ENTERPRISE_BASE_URL + "zhsapp/factory/detail",
          //内容
          dom: $("article"),
          //标题
          headerDom: $("header"),
          //提示下载
          downloadDom: $(".download")
        },
        _render: function () {
            var that = this;
            var option = that.option;
            /*调用接口获取数据*/
            http.get(option.ENTERPRISE_FACTORY_ADDRESS, {
                data: {
                    factoryId: option.urlParams.factoryId
                },
                success: function (res) {
                    res.data.images = JSON.parse(res.data.images);
                    res.data.tel = "";
                    if (res.data.areaCode) {
                      res.data.tel += res.data.areaCode;
                    }
                    if (res.data.phone) {
                      res.data.tel += "-" + res.data.phone;
                    }
                    if (res.data.extendNumber) {
                      res.data.tel += "-" + res.data.extendNumber;
                    }
                    tplProxy.html.call(option.dom, tpl, res.data, {config: config, $:$});
                    //幻灯片对象
                    var sliderDom = $(".slider");
                    that._bxSlider(sliderDom);
                }
            });
            return that;
        },
        _bxSlider: function(dom) {
           var that = this;
           var option = that.option;
           dom.bxSlider({
             slideWidth: 400, 
             auto: true,
             autoControls: true,
             minSlides:1,
             maxSlides: 6,
             slideMargin: 10
           });
           return that;
        }
    };
})
;
define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/goodsDetails/details.html',
    'text!apps/download.html',
    'swipe',
    'bxslider',
    'Utils',
    'cookie'
], function (http, config, tplProxy, tpl, downloadTpl, swipe, bxslider, utils, cookie) {
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
          //商品详情接口地址
          GOODS_DETAILS_ADDRESS: config.GOODS_BASE_URL + "zhsapp/goods/sku/detail",
          //工厂详情Url
          FACTORY_DETAILS_URL: "../../apps/factoryDetails/factoryDetails.html?factoryId=",
          //主渲染区域
          dom: $('article'),
          headerDom: $("header"),
          downloadDom: $(".download")
        },
        /**
         * 渲染商品详情
         * */
        _render: function() {
            var that = this;
            var option = that.option;
            //获取商品详情
            http.get(option.GOODS_DETAILS_ADDRESS, {
                data: {
                    code: option.urlParams.code || "",
                    skuId: option.urlParams.skuId || ""
                },
                success: function (res) {
                    var data = $.extend({}, res.data);
                    data.imageList = res.data.imageList.replace(/[\[\]\"]/g,"").split(",");
                    data.properties = JSON.parse(res.data.properties);
                    data.attributes = JSON.parse(res.data.attributes);
                    data.certification = JSON.parse(res.data.certification);
                    //当传入code时返回结果有factoryList和codedFactory字段，skuId的时候则没有
                    if("factoryList" in res.data) {
                      var factoryList = res.data.factoryList;
                      for (var i=0;i<factoryList.length;i++) {
                          //制作工厂详情URL
                          data.factoryList[i].images = JSON.parse(factoryList[i].images);
                          //制作工厂详情URL
                          data.factoryList[i].url = option.FACTORY_DETAILS_URL+factoryList[i].id;
                      }
                    }
                    if("codedFactory" in res.data) {
                      data.codedFactory.images = JSON.parse(res.data.codedFactory.images);
                    }
                    tplProxy.html.call(option.dom, tpl, data, {config: config, $:$});
                    //幻灯片对象
                    var sliderDom = $(".slider");
                    that._bxSlider(sliderDom)
                        ._swipe();
                }
            });
            return that;
        },
        /**
         * 初始化幻灯片
         * parameter1:幻灯片对象
         * */
        _bxSlider: function(sliderDom) {
          var that = this;
          var option = that.option;
          for(var i=0; i<sliderDom.length;i++) {
              $(sliderDom[i]).bxSlider({
                slideWidth: 400, 
                auto: true,
                autoControls: true,
                minSlides: 1,
                maxSlides: 6,
                slideMargin: 10
              });
          }
          return that;
        },
        /**
         * 幻灯片焦点
         * */
        _swipe: function() {
            var that = this;
            var bullets = document.getElementById('position').getElementsByTagName('li');
            var mySwipe = new Swipe(document.getElementById('gd-swipe'), {
                startSlide: 0,
                speed: 400,
                auto: 3000,
                continuous: true,
                disableScroll: false,
                stopPropagation: false,
                callback:function(e, pos) {
                  var i = bullets.length;
                  while (i--) {
                    bullets[i].className = '';
                  }
                  bullets[e%bullets.length].className = 'on';
                },
                transitionEnd: function(index, elem) {}
            });
            return that;
        }
    };
})
;
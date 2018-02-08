define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/certifiedDetails/certifiedDetails.html',
    'text!apps/certifiedDetails/certified.html',
    'text!apps/certifiedDetails/goods.html',
    'text!apps/download.html',
    'bxslider',
    'Utils',
    'cookie'
], function (http, config, tplProxy, tpl, certifiedTpl, goodsTpl, downloadTpl, bxslider, utils, cookie) {
    'use strict'

    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //获取Url参数里包含的查询信息列表
            that.option.urlParams = utils.getUrlParams();
            //从第一页开始
            that.option.urlParams.page = 1;
            //每页10条数据
            that.option.urlParams.rows = 10;
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
            $(".iMark").hide();
            return that._renderEnterprise();
        },
        option: {
          //hash参数
          urlParams: null,
          //认证信息接口地址
          ENTERPRISE_AUTHINFO_ADDRESS: config.ENTERPRISE_BASE_URL + 'zhsapp/enterprise/authinfo',
          //企业下的商品信息接口地址
          GOODS_SKULIST_ADDRESS: config.GOODS_BASE_URL + 'zhsapp/goods/skulist',
          //商品详情URL
          GOODS_DETAILS_URL: "../../apps/goodsDetails/goodsDetails.html?skuId=",
          //企业认证区域
          certifiedDom: $(".certified"),
          //企业下商品区域
          goodsDom: $(".goods"),
          //false:视频未播放,true:视频播放中
          inOutFlg: false,
          //标题
          headerDom: $("header"),
          //提示下载
          downloadDom: $(".download"),
          //true:数据加载解锁,false:数据加载锁定
          isLock: true
        },
        /**
         * 渲染认证信息
         * */
        _renderEnterprise: function() {
            var that = this;
            //取得渲染区域
            var option = that.option;
            //获取认证信息
            http.get(option.ENTERPRISE_AUTHINFO_ADDRESS, {
                data: {
                    enterpriseId: option.urlParams.enterpriseId
                },
                success: function (res) {
                    var localData = $.extend({}, JSON.parse(res.data.imageList), {introduction:res.data.introduction});
                    tplProxy.html.call(option.certifiedDom, certifiedTpl, localData, {config: config, $:$});
                    //开始渲染企业下的商品信息
                    that._click()
                        ._renderGoods();
                }
            });
            return that;
        },
        _click: function() {
          var that = this;
          $(".iMark img").click(function() {
            $(".iMark").hide();
          });
          $(".img-resize img").click(function() {
            var img = $(this).attr("src");
            $(".iMark img").attr("src",img)
            $(".iMark").show();
          });
          return that;
        },
        /**
         * 渲染企业下的商品信息
         * */
        _renderGoods: function() {
            var that = this;
            var option = that.option;
            //获取商品信息
            http.get(option.GOODS_SKULIST_ADDRESS, {
                data: {
                    enterpriseId: option.urlParams.enterpriseId,
                    page: option.urlParams.page,
                    rows: option.urlParams.rows
                },
                success: function (res) {
                    var data = res.data;
                    if (data.length > 0) {
                      //处理返回结果
                      for(var i=0;i<data.length;i++){
                        data[i].url = option.GOODS_DETAILS_URL + data[i].skuId;
                        data[i].imageList = data[i].imageList.replace(/[\[\]\"]/g,"").split(",");
                      }
                      var template = tplProxy.getTemplate.call({}, goodsTpl, data, {config: config, $:$});
                      option.goodsDom.find(".qysp_list").append(template);
                      //视频盒子
                      var videoBoxDom = $("#videoBox");
                      //视频对象
                      var videoDom = $("#myVideo");
                      //幻灯片对象
                      var sliderDom = $(".slider");
                      //第一页数据加载完成后初始化各类事件
                      if (option.urlParams.page == 1) {
                          that._videofixed(videoBoxDom)
                          ._playPause(videoBoxDom,videoDom)
                          ._bxSlider(sliderDom)
                          ._scrollBottom();
                      }
                      //数据加载解锁
                      option.isLock = true;
                      //上一页加载成功后页数加1
                      option.urlParams.page+=1;
                    }
                }
            });
            return that;
        },
        /**
         * 视频浮动
         * parameter1:视频对象
         * */
        _videofixed: function(dom) {
          var that = this;
          var box = $("#videoBox0");
          var option = that.option;
          $(window).scroll(function(){
            var ha = box.offset().top + box.height(); 
            var scrollTop = that._getScrollTop();
            if (option.inOutFlg) {
              if ( scrollTop < ha - 800 || scrollTop > ha) {
                dom.removeClass('in').addClass('out');      
              } else {
                dom.removeClass('out').addClass('in');      
              };
            }
          });
          return that;
        },
        /**
         * 视频播放和暂停
         * parameter1:视频盒子
         * parameter2:视频对象
         * */
        _playPause: function(boxDom,dom) {
          var that = this;
          var option = that.option;
          dom.on("play",function() {
            option.inOutFlg = true;
          });
          dom.on("pause",function() {
            option.inOutFlg = false;
            boxDom.removeClass('out').addClass('in');   
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
          var sliders = Array.prototype.slice.apply(sliderDom);
          sliders.forEach(function(obj) {
            $(obj).bxSlider({
              slideWidth: 400, 
              auto: true,
              autoControls: true,
              minSlides: 1,
              maxSlides: 6,
              slideMargin: 10
            });
          });
          return that;
        },
        _scrollBottom: function(){
          var that = this;
          var option = that.option;
          $(window).scroll(function(){
              // 窗口可视范围的高度
              var height=that._getClientHeight(),
              // 窗口滚动条高度
              theight=that._getScrollTop(),
              // 文档内容实际高度
              rheight=that._getScrollHeight(),
              // 滚动条距离底部的高度
              bheight=rheight-theight-height;
              //底部50像素处加载下一页数据
              if(bheight < 50 && option.isLock) {
                //数据加载锁定
                option.isLock = false;
                //下一页
                that._renderGoods();
              }
          });
          return that;
        },
        //获取窗口可视范围的高度
        _getClientHeight: function(){  
          var clientHeight=0;  
          if(document.body.clientHeight&&document.documentElement.clientHeight){  
              var clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
          }else{  
              var clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
          }  
          return clientHeight;  
        },
        //获取窗口滚动条高度
        _getScrollTop: function(){
          var scrollTop=0;  
          if(document.documentElement&&document.documentElement.scrollTop){  
              scrollTop=document.documentElement.scrollTop;  
          }else if(document.body){  
              scrollTop=document.body.scrollTop;  
          }  
          return scrollTop;  
        },
        //获取文档内容实际高度
        _getScrollHeight: function(){  
          return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);  
        }
    };
})
;
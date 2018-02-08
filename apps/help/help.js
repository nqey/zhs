define([
    'config',
    'TemplateProxy',
    'text!apps/download.html',
    'cookie'
], function (config, tplProxy, downloadTpl, cookie) {
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
            //视频盒子
            var videoBoxDom = $("#videoBox");
            //视频对象
            var videoDom = $("#myVideo");
            //初始化各类事件
            return that._videofixed(videoBoxDom)
            		       ._playPause(videoBoxDom,videoDom);
        },
        option: {
          //false:视频未播放,true:视频播放
          inOutFlg: false,
          downloadDom: $(".download")
        },
         /**
         * 视频浮动
         * parameter1:视频对象
         * */
        _videofixed: function(dom) {
          var that = this;
          var ha = ( dom.offset().top + dom.height() ); 
          var option = that.option;
          $(window).scroll(function(){
            var scrollTop = $(window).scrollTop();
            if (option.inOutFlg) {
              if (scrollTop > ha + 120) {
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
        }
    };
})
;
/**
 * Created by liyin 2017年12月10日 18:12:13
 */
define(['jquery', 'utils/IdCardChecker'], function ($, cardChecker) {
    var __rules = {
        required: {
            validator: function (dom) {
                try {
                    var value = $(dom).val();
                    return (value == null ? "" : value).length > 0;
                } catch (e) {
                    alert($(dom).val() + $(dom).attr("name"));
                }
            }
        },
        length: {
            /*valid : [1,10] ==> -1表示无穷大 */
            validator: function (dom) {
                try {
                    var that = $(dom),
                        len = $.trim(that.val()).length,
                        valid = JSON.parse(that.attr("valid"));
                    return len > valid[0] && len < valid[1];
                } catch (e) {
                    console.error("配置不合法，检验失败！");
                }
            },
            message: "长度不合法"
        },
        email: {
            validator: function (dom) {
                var value = $(dom).val();
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
                    .test(value);
            },
            message: "请输入正确的邮箱"
        },
        url: {
            validator: function (dom) {
                var value = $(dom).val();
                return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
                    .test(value);
            },
            message: "请输入正确的路径"
        },
        cellphone: {
            validator: function (dom) {
                var value = $(dom).val();
                return /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(value);
            },
            message: "请输入正确的手机号码"
        },
        password: {
            validator: function (dom) {
                var value = $(dom).val();
                return new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}').test(value)
            },
            message: "密码过于简单，必须包含字母、数字、特殊字符，长度在6-20位"
        },
        idCard: {
            validator: function (dom) {
                return cardChecker.check($(dom).val());
            },
            message: "身份证输入不正确"
        },
        time:{
            validator:function (dom) {
                var value = $(dom).val();
                return /^(([\u4E00-\u9FA5]{4})|(\d{4}-\d{2}-\d{2}[T]\d{2}[:]\d{2}))$/.test(value);
            },
            message:"请选择推送时间"
        },
        money:{
            validator:function(dom){
                var value=$(dom).val();
                return /^(\d+)|(\d+[.]\d{2})$/.test(value);
            },
            message:"请点击按钮查看付款金额"
        }
    }

    var invalidate = "invalidate";

    return {
        //目前仅支持必填校验
        validateForm: function (form) {
            var that = this,
                result = true;
            if (!form) {
                return result;
            }

            $(form).find('[validtype]:not([validate="false"])')
                .each(function () {
                    if (!that.validate(this)) {
                        result = false;
                    }
                });

            try {
                //FIXME:弹窗里面不能滚。滚动到可视区域的中间
                if (!result && !$('body').hasClass('modal-open')) {
                    var that = $(form).find(".invalidate:first");
                    scrollTo(0, that.offset().top - document.body.clientHeight / 2);
                    that.focus();
                }
            } catch (e) {
                console.log(e);
            }
            return result;
        },
        ispass: function (dom) {
            return !$(dom).hasClass(invalidate);
        },
        pass: function (dom, trueOrFalse, message) {
            var that = this;

            if (trueOrFalse == null) {
                trueOrFalse = true;
            }

            if (trueOrFalse) {
                $(dom).removeClass(invalidate);
                that.getMessager(dom).hide();
            } else {
                $(dom).addClass(invalidate);
                message && that.getMessager(dom).html(message).show();
            }
            return that;
        },
        getMessager: function (dom) {
            var messager = $(dom).next('.validate-shower');
            if (messager.length == 0) {
                messager = $('<div class="validate-shower red" style="display: none"></div>').insertAfter($(dom));
            }
            return messager;
        },
        validate: function (dom) {
            var that = this,
                _this = $(dom),
                novalidate = _this.attr('validate') == 'false',
                validtype = _this.attr("validtype"),
                result = true;
            if (!novalidate && validtype) {
                var types = validtype.split(" ");
                for (var i = 0; i < types.length; ++i) {
                    var rule = __rules[types[i]];
                    if (rule) {
                        result = rule.validator(_this);

                        that.pass(dom, result, rule.message);
                    }
                }
            }
            return result;
        }
    }
});



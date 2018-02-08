/**
 * Created by liyin 2017年11月25日 09:45:06
 */
define(['Template'], function (Template) {
    var __getTemplate = function (html, data, obj) {
        var that = this,
            data = data || {},
            obj = obj || {};

        var compiled = Template(html, obj);
        return compiled({data: data}) || '';
    };

    return {
        getTemplate : function (html, data, obj) {
            return __getTemplate.call(this, html, data, obj);
        },
        html: function (html, data, obj) {
            return this.html(__getTemplate.call(this, html, data, obj));
        },
        append: function (html, data, obj) {
            return this.append(__getTemplate.call(this, html, data, obj));
        },
        prepend: function (html, data, obj) {
            return this.prepend(__getTemplate.call(this, html, data, obj));
        }
    }
});



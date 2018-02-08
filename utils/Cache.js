/**
 * Created by liyin 2017年11月25日 09:45:06
 */
define([], function () {
    return {
        /**
         * @param key
         */
        getValue: function (key) {
            try {
                var dataString = window.localStorage.getItem(key);

                var cached = JSON.parse(dataString);
                if (cached == null || cached.expire < new Date().getTime()) {
                    window.localStorage.removeItem(key);
                    return null;
                } else {
                    return cached.data;
                }
            } catch (e) {
                return null;
            }
        },
        /**
         * @param key
         * @param data
         * @param expire 过期时间, 单位:秒
         *
         * @result true/false
         */
        setValue: function (key, data, expire) {
            try {
                if (expire) {
                    expire = new Date().getTime() + expire * 1000;
                }
                window.localStorage.setItem(key, JSON.stringify(
                    {
                        expire: expire,
                        data: data
                    }
                ))
                return true;
            } catch (e) {
                return false;
            }
        },
        deleteValue: function (key) {
            try {
                window.localStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        }
    }
});



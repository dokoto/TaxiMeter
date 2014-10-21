var logger = {
    ERROR_H3 : function(message) {
        console.log('%c' + now() + message, 'background: #EB4651; color: #FFFFFF; font-size:18px');
    },
    ERROR_DESP : function(message) {
        console.log('%c' + now() + message, 'background: #FFFFFF; color: #EB4651; font-size:12px');
    },
    WARNING_H3 : function(message) {
        console.log('%c' + now() + message, 'background: #FCEA21; color: #000000; font-size:18px');
    },
    WARNING_DESP : function(message) {
        console.log('%c' + now() + message, 'background: #FFFFFF; color: #EB4651; font-size:12px');
    },
    MSG_H3: function(message) {
        console.log('%c' + now() + message, 'background: #FFFFFF; color: #7A97F5; font-size:18px');
    },
    MSG_DESP : function(message) {
        console.log('%c' + now() + message, 'background: #FFFFFF; color: #7A97F5; font-size:12px');
    },
    APP_TITLE : function(message) {
        console.log('%c' + message, 'font-weight: bold;font-family: "Century Gothic", CenturyGothic, "AppleGothic", sans-serif; font-size: 54px; background-color:#f16251; color: #ffcc33;text-align: center; padding-right:20px; padding-left:20px; padding-top:2px;');
    }
};

var now = function()
{
    var date = new Date();
    return '[' + date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds() + '] '; 
};
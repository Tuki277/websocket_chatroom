// const moment = require('moment');
var moment = require('moment-timezone');

function formatMessage (username, text) {
    return {
        username,
        text,
        // time: moment().format(' h:mm a')
        time : moment().tz("Asia/Ho_Chi_Minh").format(' h:mm a')
    };
}

module.exports = formatMessage

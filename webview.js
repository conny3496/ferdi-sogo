"use strict";

const path = require('path');

module.exports = Franz => {
  Franz.injectCSS(path.join(__dirname, 'style.css'));
  const getMessages = function getMessages() {
    var unread = 0
    const notificationBadge = document.getElementsByClassName('sg-counter-badge')[0]
    if (notificationBadge != undefined) {
      unread = notificationBadge.innerText;
    }
    Franz.setBadge(parseInt(unread, 10));
  };

  Franz.loop(getMessages);
};

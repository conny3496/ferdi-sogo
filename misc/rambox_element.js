function checkUnread() {
  let unreadRoomsCount = 0
  let roomListHeaders = document.getElementsByClassName('mx_RoomTile')
  for (i = 0; i < roomListHeaders.length; i++) {
    badges = roomListHeaders[i].getElementsByClassName('mx_NotificationBadge_count');
    if (badges.length > 0) {
      if (Number(badges[0].textContent) > 0) {
        unreadRoomsCount += 1;
      }
    }
  }
  console.log('Unread checked');
  updateBadge(unreadRoomsCount);
}

function updateBadge(n) {
  n >= 1 ? rambox.setUnreadCount(n) : rambox.clearUnreadCount();
  console.log('Badge updated?');
  let resizeChecker = false
  if (document.getElementById('matrixchat').style.height == "100%") {
      document.getElementById('matrixchat').style.height = "calc(100% - 18px);";
      console.log('matrixchat resized')
  }
}

setInterval(checkUnread, 3e3);

// Reloads self after 3h108e5 (15m = 9e5). Used for SOGo.
// EDIT HERE: alert before reload (maybe with yes no)
setTimeout(function(){  location.reload(); }, 9e5);
// set cookie expire date would be useful

  var colorPicker = new iro.ColorPicker('#picker');
  var playerTrack = $("#player-track"),
      bgArtwork = $('#bg-artwork'),
      bgArtworkUrl, albumName = $('#album-name'),
      trackName = $('#track-name'),
      albumArt = $('#album-art'),
      sArea = $('#s-area'),
      seekBar = $('#seek-bar'),
      trackTime = $('#track-time'),
      insTime = $('#ins-time'),
      sHover = $('#s-hover'),
      playPauseButton = $("#play-pause-button"),
      i = playPauseButton.find('i'),
      tProgress = $('#current-time'),
      tTime = $('#track-length'),
      seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
      buffInterval = null,
      tFlag = false,
      albums = ['Gamer.FM', 'Gamer.FM'],
      trackNames = ['Your #1 Gaming Station', 'Your #1 Gaming Station'],
      albumArtworks = ['_1', '_1'],
      trackUrl = ['https://aurora.shoutca.st/radio/8210/320','https://aurora.shoutca.st/radio/8210/320'],
      playPreviousTrackButton = $('#play-previous'),
      playNextTrackButton = $('#play-next'),
      stopButton = $('#stopButton'),
      volumeButton = document.getElementById('volumeButton'),
      // reinitializeButton = document.getElementById('reinitializeButton'),
      modeSwitcher = document.getElementById('modeSwitcher'),
      changeRGB = document.getElementById('changeRGB'),
      closePicker = document.getElementById('closePicker'),
      applyPicker = document.getElementById('applyPicker'),
      revertPicker = document.getElementById('revertPicker'),
      selectedColor, lastSelectedColor, lastVolume,
      currIndex = -1;
   var backgroundUpdater;


  function playPause() {
    // setTimeout(function() {
      if (audio.paused) {
        playerTrack.addClass('active');
        // playerTrack.classList.add('active');
        albumArt.addClass('active');
        // checkBuffering();
        // i.attr('class', 'fas fa-pause');
        document.getElementById('play-pause-button').childNodes[1].childNodes[0].innerHTML="pause";
        audio.play();
        // loadCover("http://coverartarchive.org/release/" + trackMBID);
        replaceCover()
      } else {
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        // clearInterval(buffInterval);
        // albumArt.removeClass('buffering');
        // i.attr('class', 'fas fa-play');
        // audio.currentTime = 0;
        document.getElementById('play-pause-button').childNodes[1].childNodes[0].innerHTML="play_arrow";
        audio.pause();
        replaceCover('pause')
      }
    // }, 300);
  }


  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if ((ctMinutes < 0) || (ctSeconds < 0))
      return;

    if ((ctMinutes < 0) || (ctSeconds < 0))
      return;

    if (ctMinutes < 10)
      ctMinutes = '0' + ctMinutes;
    if (ctSeconds < 10)
      ctSeconds = '0' + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds))
      insTime.text('--:--');
    else
      insTime.text(ctMinutes + ':' + ctSeconds);

    insTime.css({
      'left': seekT,
      'margin-left': '-21px'
    }).fadeIn(0);

  }

  function hideHover() {
    sHover.width(0);
    insTime.text('00:00').css({
      'left': '0px',
      'margin-left': '0px'
    }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass('active');
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10)
      curMinutes = '0' + curMinutes;
    if (curSeconds < 10)
      curSeconds = '0' + curSeconds;

    if (durMinutes < 10)
      durMinutes = '0' + durMinutes;
    if (durSeconds < 10)
      durSeconds = '0' + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds))
      tProgress.text('00:00');
    else
      tProgress.text(curMinutes + ':' + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds))
      tTime.text('00:00');
    else
      tTime.text(durMinutes + ':' + durSeconds);

    if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
      trackTime.removeClass('active');
    else
      trackTime.addClass('active');


    seekBar.width(playProgress + '%');

    if (playProgress == 100) {
      i.attr('class', 'fa fa-play');
      seekBar.width(0);
      tProgress.text('00:00');
      albumArt.removeClass('buffering').removeClass('active');
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function() {
      if ((nTime == 0) || (bTime - nTime) > 1000)
        albumArt.addClass('buffering');
      else
        albumArt.removeClass('buffering');

      bTime = new Date();
      bTime = bTime.getTime();

    }, 100);
  }

  function getLive() {



    //   seekBar.width(0);
    //   audio.pause();
    //   audio.currentTime = 0;
    //   audio.play();
    // //   trackTime.removeClass('active');
    //   tProgress.text('00:00');
    //   tTime.text('00:00');
    //
    //   currAlbum = albums[currIndex];
    //   currTrackName = trackNames[currIndex];
    //   currArtwork = albumArtworks[currIndex];
    //
    //   // audio.src = trackUrl[currIndex];
    //
    //
      // nTime = 0;
      // bTime = new Date();
      // bTime = bTime.getTime();
    //
    //   if (flag != 0) {
    //     audio.play();
    //     playerTrack.addClass('active');
    //     albumArt.addClass('active');
    //
        // clearInterval(buffInterval);
        // checkBuffering();
    //   }
    //
    //   albumName.text(currAlbum);
    //   trackName.text(currTrackName);
    //   albumArt.find('img.active').removeClass('active');
    //   $('#' + currArtwork).addClass('active');
    //
    //   bgArtworkUrl = $('#' + currArtwork).attr('src');
    //
    //   bgArtwork.css({
    //     'background-image': 'url(' + bgArtworkUrl + ')'
    //   });
    // } else {
    //   if (flag == 0 || flag == 1)
    //     --currIndex;
    //   else
    //     ++currIndex;
    // }
  }

  function initialize() {
    audio = new Audio();
    audio.src = 'https://aurora.shoutca.st/radio/8210/320?cacheBuster=' + new Date().getTime();
    audio.pause()

    // selectTrack(0);

    audio.loop = false;

    playPauseButton.on('click', playPause);

    sArea.mousemove(function(event) {
      showHover(event);
    });

    sArea.mouseout(hideHover);

    sArea.on('click', playFromClickedPos);

    $(audio).on('timeupdate', updateCurrTime);

    playPreviousTrackButton.on('click', function() {
      audio.currentTime = audio.currentTime - 10;
    });
    playNextTrackButton.on('click', function() {
      // getLive();
      audio.pause();
      audio.currentTime = audio.duration;
      playPause();
      setTimeout(function(){
        albumArt.addClass('active');
      }, 300);
    });
    stopButton.on('click', function() {
      // audio.src = "";
      clearInterval(backgroundUpdater);
    });
    volumeButton.addEventListener('click', function() {
      if (audio.volume > 0) {
        document.getElementById('volumeButton').childNodes[0].childNodes[0].innerHTML = "volume_off";
        lastVolume = audio.volume;
        console.debug('lastVolume: ' + lastVolume);
        audio.volume = 0;
        document.getElementsByClassName('vcontrol')[0].style.width = `0%`;
      } else {
        if (!lastVolume) {
          console.debug('lastVolume was undefined');
          lastVolume = 0.85;
          document.getElementsByClassName('vcontrol')[0].style.width = "85%";
        }
        document.getElementById('volumeButton').childNodes[0].childNodes[0].innerHTML = "volume_up";
        audio.volume = lastVolume;
        document.getElementsByClassName('vcontrol')[0].style.width = `${lastVolume * 100}%`;
      }
    });
    modeSwitcher.addEventListener('click', function() {
      changeContrast();
    });
    closePicker.addEventListener('click', function() {
      document.querySelector(':root').style.setProperty('--accent', lastSelectedColor)
    });
    revertPicker.addEventListener('click', function() {
      // document.querySelector(':root').style.setProperty('--accent', 'var(--orange)')
      // colorPicker.color.hexString = #f46a19;
      colorPicker.color.hsl = { h: 22, s: 91, l: 53 };
    });
    applyPicker.addEventListener('click', function() {
      lastSelectedColor = selectedColor;
      setCookie('cpicker', lastSelectedColor, 23);
    });
    changeRGB.addEventListener('click', function() {
      if (!lastSelectedColor) {
        var thisRoot = document.querySelector(':root');
        lastSelectedColor = getComputedStyle(thisRoot).getPropertyValue('--orange');
      }
    });
    // reinitializeButton.addEventListener('click', function() {
    //   // playPause();
    //   // initialize();
    //   // fetchMetaData();
    //   // playPause();
    //   backgroundUpdater = setInterval(backgroundUpdate, 5e3);
    // });
    if (cmode == 'dark') {
      console.debug('cmode cookie was ' + cmode + '. Loaded with Dark Mode.');
      document.querySelector(':root').style.setProperty('--main', 'var(--dark)')
      document.querySelector(':root').style.setProperty('--contrast', 'var(--light)')
    }
    if (lastSelectedColor) {
      console.debug('lastSelectedColor cookie was found;' + lastSelectedColor + '. Loaded with custom RGB.');
      document.querySelector(':root').style.setProperty('--accent', lastSelectedColor)
    }
    console.debug('Ready to go!')
  }
// Dark Mode and RGB stuff
function changeContrast() {
  if (cmode == 'light' || cmode == "") {
    document.querySelector(':root').style.setProperty('--main', 'var(--dark)')
    document.querySelector(':root').style.setProperty('--contrast', 'var(--light)')
    cmode = 'dark';
    setCookie('cmode', cmode, 23);
  } else {
    document.querySelector(':root').style.setProperty('--main', 'var(--light)')
    document.querySelector(':root').style.setProperty('--contrast', 'var(--dark)')
    cmode = 'light';
    setCookie('cmode', cmode, 23);
  }
}
function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=Strict;path=/";
  console.debug('cookie set');
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  console.debug('got cookie ' + cname + ' : ' + cmode);
  return "";
}
// Experimental: Update Meta Data for Current Song
// Source for those: https://aurora.shoutca.st/radio/8210/ -> XSPF
var trackArtist; // = 'queen';
var trackTitle; // = 'radio';
var trackMBID;
var coverURL; // = 'http://coverartarchive.org/release/c04730ea-87cb-478b-a256-08c0561d20e6/';
var coverJPG;
var trackChanged = true;
function fetchMetaData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          updateMetaData(this);
      }
  };
  xhttp.open("GET", "https://aurora.shoutca.st/radio/8210/320.xspf", false);
  xhttp.send();
}
function updateMetaData(xml) {
    var xmlDoc = xml.responseXML;
    if (trackArtist != xmlDoc.getElementsByTagName('creator')[1].childNodes[0].nodeValue) {
      trackChanged = true;
      trackMBID = undefined;
      coverURL = undefined;
      coverJPG = undefined;
      trackArtist = xmlDoc.getElementsByTagName('creator')[1].childNodes[0].nodeValue;
      trackTitle = xmlDoc.getElementsByTagName('title')[1].childNodes[0].nodeValue;
      document.getElementById("track-name").innerHTML = trackTitle;
      document.getElementById("artist-name").innerHTML = trackArtist;
      console.debug('updated: ' + trackTitle + ' by ' + trackArtist);
    } else {
      trackChanged = false;
      console.debug('Meta did not change.')
    }
}
// Experimental: Get Cover fromvar getJSON = function(url, callback) {
async function loadCover(url) {
  console.debug('loadCover from url: ' + url);
  let myObject = await fetch(url)
  .catch((error) => {
  console.error('Error:', error);
  });
  let myJson = await myObject.json();
  // console.debug(myJson);
  coverJPG = myJson.images[0].thumbnails.small;
}
function replaceCover(state) {
  if (coverJPG && state != 'pause') {
    document.getElementById('coverImage').src = coverJPG;
  } else if (state == 'pause') {
    console.debug('player pause: reverting logo');
    document.getElementById('coverImage').src = "../logos/48.png";
  } else {
    console.debug('coverJPG undefined, cannot change. Recovering default.');
    document.getElementById("coverImage").src = "../logos/48.png";
  }
}
// var coverJson = loadCover(coverURL);
function fetchXMLforMBID(trackTitle, trackArtist) {
  var regEx = /[^a-zA-Z0-9\s]/g;
  var thisTrackTitle = trackTitle.replaceAll(regEx,' ').replaceAll(' ','%20');
  var thisTrackArtist = trackArtist.replaceAll(regEx,' ').replaceAll(' ','%20');
  console.debug(thisTrackTitle)
  // var queryURL = "http://musicbrainz.org/ws/2/release/?query=release:%22" + thisTrackTitle + "%22%20OR%20artist:%22" + thisTrackArtist + "%22";
  // var queryURL = "http://musicbrainz.org/ws/2/release/?query=release:%22" + thisTrackTitle + "%22%20AND%20artist:%22" + thisTrackArtist + "%22";
  var queryURL = "http://musicbrainz.org/ws/2/release/?query=title:" + thisTrackTitle + "%20AND%20artist:" + thisTrackArtist;
  console.debug('queryURL: ' + queryURL);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          fetchMBID(this);
      }
  };
  xhttp.open("GET",  queryURL, false);
  xhttp.send();
  }
function fetchMBID(xml) {
      var xmlDoc = xml.responseXML;
      // if (xmlDoc.getElementsByTagName('release')[0].id) {
        trackMBID = xmlDoc.getElementsByTagName('release')[0].id
        console.debug('trackMBID: ' + trackMBID);
      // }

  }
  function backgroundUpdate() {
    fetchMetaData();
    if (trackChanged) {
      console.debug('trackChanged true: fetching Meta & loading cover')
      document.getElementById("coverImage").src = "../logos/48.png";
      fetchXMLforMBID(trackTitle, trackArtist);
      if (trackMBID) {
          loadCover("http://coverartarchive.org/release/" + trackMBID);
      }
    } else {
      console.debug('trackChanged was ' + trackChanged);
    }
    if (!audio.paused && coverJPG) {
      console.debug('Audio is playing');
      document.getElementById("coverImage").src = coverJPG;
    }
    console.debug('finnished backgroundUpdate()');
  }
  //////////////////////////////////////////////////////////////// SUPER Experimental Color Picker////////////////////////////////
  colorPicker.on('color:change', function(color) {
  // console.debug(color.hexString);
  document.querySelector(':root').style.setProperty('--accent', color.hexString);
  selectedColor = color.hexString;
});
  //////////////////////////////// DO STUFF HERE //////////////////////////////////
  // document.querySelector(':root').style.setProperty('--main', 'var(--dark)')
  // console.debug = function maskDebug(){};
  var cmode = getCookie('cmode');
  lastSelectedColor = getCookie('cpicker');
  initialize();
  backgroundUpdate();
  setTimeout(function(){
    backgroundUpdater = setInterval(backgroundUpdate, 5e3);
  }, 8e3);
  // clearInterval(backgroundUpdater);
  // document.getElementById('test').childNodes[1].setAttribute('fill','var(--accent)')

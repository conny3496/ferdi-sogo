//based on: https://codepen.io/garethdweaver/pen/euIfz

var volume = {

    init: function(){
        $('#volume').on('click', volume.change);
        $('#volume .vcontrol').on('mousedown', volume.drag);
    },

    change: function(e){
        e.preventDefault();
        var percent = helper.getFrac(e, $(this)) * 100;
        $('#volume .vcontrol').animate({ width: percent+'%' }, 100);
        volume.update(percent);
    },

    update: function(percent){
      // $('.vol-box').text(Math.round(percent));
      console.debug(percent * 0.01);
      audio.volume = percent * 0.01;
      var thisVolume = percent * 0.01;
      if (thisVolume == 0) {
        document.getElementById('volumeButton').childNodes[0].childNodes[0].innerHTML = "volume_off";
      } else {
        document.getElementById('volumeButton').childNodes[0].childNodes[0].innerHTML = "volume_up";
      }
    },

    drag: function(e){
        e.preventDefault();
        $(document).on('mousemove', volume.moveHandler);
        $(document).on('mouseup', volume.stopHandler);
    },

    moveHandler: function(e){
        var holderOffset = $('#volume').offset().left,
            sliderWidth = $('#volume').width(),
            posX = Math.min(Math.max(0, e.pageX - holderOffset), sliderWidth);

        console.debug('posX: ' + posX);
        $('#volume .vcontrol').width(posX);
        volume.update(posX / sliderWidth * 100);
    },

    stopHandler: function(){
        $(document).off('mousemove', volume.moveHandler);
        $(document).off('mouseup', volume.stopHandler);
    }

}

var helper = {
    getFrac: function(e, $this){
        return ( e.pageX - $this.offset().left ) / $this.width();
    }
}

volume.init();

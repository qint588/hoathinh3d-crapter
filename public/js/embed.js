var videoPlayer = jwplayer("previewPlayer");
videoPlayer.setup({
  key: "MBvrieqNdmVL4jV0x6LPJ0wKB/Nbz2Qq/lqm3g==",
  sources: [
    {
      file: window.m3u8Link,
      label: "1080p",
      type: "hls",
    },
  ],
  generateSEOMetadata: true,
  width: "100%",
  height: "100%",
  primary: "html5",
  displaytitle: false,
  // autostart: true,
  playbackRateControls: true,
  // mute: false,
  horizontalVolumeSlider: true,
});

videoPlayer.addButton(
  "/images/forward.svg",
  "Đến 20s",
  function () {
    videoPlayer.seek(videoPlayer.getPosition() + 20);
  },
  "Đến 20s"
);
videoPlayer.addButton(
  "/images/backward.svg",
  "Lùi 20s",
  function () {
    videoPlayer.seek(videoPlayer.getPosition() - 20);
  },
  "Lùi 20s"
);

Telegram.WebApp.expand();
Telegram.WebApp.enableClosingConfirmation();
Telegram.WebApp.MainButton.setParams({
  text: "Đóng",
  is_visible: true,
}).onClick(() => {
  Telegram.WebApp.showPopup(
    {
      message: "Are you sure?",
      buttons: [
        { id: "close", type: "destructive", text: "Tiếp tục" },
        { type: "cancel" },
      ],
    },
    function (buttonId) {
      if (buttonId === "close") {
        Telegram.WebApp.close();
      }
    }
  );
});

$(document).ready(function () {
  setTimeout(() => {
    $(".loading")
      .css({ opacity: 0, zIndex: 0 }) /*set opacity to 0*/
      .delay(2) /*wait 2 seconds*/
      .animate({ opacity: 1 }); /*animate in opacity*/
  }, 1000);

  $("a").click(function () {
    $(".loading")
      .css({ opacity: 1, zIndex: 100 }) /*set opacity to 0*/
      .delay(2) /*wait 2 seconds*/
      .animate({ opacity: 0 }); /*animate in opacity*/
  });
});

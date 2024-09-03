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
  autostart: true,
  playbackRateControls: true,
  mute: false,
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

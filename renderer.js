const win = require('electron').remote.getCurrentWindow();
const $ = require('jquery');
const io = require('socket.io-client');
const config = require('electron-node-config');

// socket.io
const socket = io.connect(config.socket_url, {resource: config.socket_path});

// マウスイベント処理
document.querySelector('.msgbox').addEventListener('mouseenter', e => {
  win.setIgnoreMouseEvents(true, { forward: true });
});
document.querySelector('.msgbox').addEventListener('mouseleave', e => {
  win.setIgnoreMouseEvents(false);
});

// close処理
document.getElementById("closeButton").addEventListener('click', () => {
  window.close();
});
// setting処理
document.getElementById("settingButton").addEventListener('click', () => {
  $modal.show();
});

// コメント設定
const colors = [
  'lime',
  'aqua',
  'yellow',
  'red',
  'fuchsia'
];
const speeds = [
  { lower: 0, upper: 5, speed: 1 },
  { lower: 6, upper: 20, speed: 2 },
  { lower: 21, upper: 35, speed: 2.5 },
  { lower: 36, upper: 9999, speed: 3 },
]
const colorsLen = colors.length;
const layerCnt = 8;
const layerIds = [];
const $msgbox = $('.msgbox');
for (let i = 0; i < layerCnt; i++) {
  $('<div>', { class: 'layer' }).appendTo($msgbox);
  layerIds.push(0);
}
const $layers = $('.layer');
let msgId_ = 1;


// メイン処理。メッセージスクロール
const scrollMessage = msg => {
  const winWidth = window.innerWidth;
  let msgId = msgId_++;

  let minId = msgId;
  for (let layerId of layerIds) {
    if (layerId < minId) {
      minId = layerId;
    }
  }

  let index = layerIds.findIndex((id) => id === minId);
  layerIds[index] = msgId;
  const $layer = $layers.eq(index);
  const $msg = $('<div>', { class: 'msg', text: msg })
    .css('color', colors[Math.floor(Math.random() * colorsLen)])
    .appendTo($layer);

  let right = -$msg.width();
  let intervalId = setInterval(function () {
    right += getSpeed(msg.length);
    $msg.show().css('right', right);

    if (right > winWidth) {
      $msg.remove();
      if (layerIds[index] === msgId) {
        layerIds[index] = 0;
      }
      clearInterval(intervalId);
    }
  });
}

// メッセージが長いほどスピードを早くする
const getSpeed = length => {
  return speeds.find(speedObj => (speedObj.lower <= length && length <= speedObj.upper))?.speed
}

// slackチャンネル名の設定
var channelName = '';
var $modal = $('#settingModal');
$modal.hide();
$(function () {
  $modal.show();
});

$('#cancelButton').on('click', () => {
  $modal.hide();
});
$('#execButton').on('click', () => {
  changeReceiveChannel();
  $modal.hide();
});
$('#channelInput').on('keypress', e => {
  if (e.key == 'Enter') {
    changeReceiveChannel();
    $modal.hide();
  }
});

const changeReceiveChannel = () => {
  socket.off(channelName);
  channelName = $('#channelInput').val();
  socket.on(channelName, scrollMessage);
}
// 步长
var STEP = 20;
// 分割容器
// 18行、10行
var ROW_COUNT = 18,
  COL_COUNT = 10;

init()
function init() {
  createModel();
  onKeyDown();
}

// 创建小方块
function createModel(){
  var divEle = document.createElement('div');
  divEle.className = 'activity_model';
  document.getElementById('container').appendChild(divEle);
}

// 键盘事件
function onKeyDown() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 38:
        console.log('上');
        move(0, -1);
        break;
      case 39:
        console.log('右');
        move(1, 0);
        break;
      case 40:
        console.log('下');
        move(0, 1);
        break;
      case 37:
        console.log('左');
        move(-1, 0);
        break;
    }
  }
}

// 移动
function move(x, y){
  // 小方块移动
  var activityModel = document.getElementsByClassName('activity_model')[0];
  activityModel.style.top = parseInt(activityModel.style.top || 0) + y * STEP + 'px';
  activityModel.style.left = parseInt(activityModel.style.left || 0) + x * STEP + 'px';
}
// 步长
var STEP = 20;
// 分割容器
// 18行、10行
var ROW_COUNT = 18,
  COL_COUNT = 10;

// 数据源
var MODELS = [
  // L型
  {
    0: {
      row: 2,
      col: 0,
    },
    1: {
      row: 2,
      col: 1,
    },
    2: {
      row: 2,
      col: 2,
    },
    3: {
      row: 1,
      col: 2,
    }
  }
]

// 当前使用模型
var currentModel = {};
// 标记16宫格的位置
var currentX = 0,
  currentY = 0;
// 记录所有块元素的位置
// K = 行_列 : V = 块元素
var fixedBlocks = {}

init()
function init() {
  createModel();
  onKeyDown();
}

// 创建小方块
function createModel() {
  // 确定哪个模型
  currentModel = MODELS[0];
  // 重新初始化 16宫格的 位置
  currentX = 0;
  currentY = 0;
  for (var key in currentModel) {
    var divEle = document.createElement('div');
    divEle.className = 'activity_model';
    document.getElementById('container').appendChild(divEle);
  }
  // 定位块元素的位置
  loactionBlocks();
}

// 根据数据源定位块元素的位置
function loactionBlocks() {
  // 判断一些块元素的越界行为
  checkBound();

  // 1. 拿到所有的块元素
  var eles = document.getElementsByClassName('activity_model');
  for (var i = 0; i < eles.length; i++) {
    // 单个块元素
    var activityModelEle = eles[i];
    // 2. 找到每个块元素对应的数据(行、列)
    var blockModel = currentModel[i];
    // 3. 根据每个块元素对应的数据来指定块元素的位置
    activityModelEle.style.top = (currentY + blockModel.row) * STEP + 'px';
    activityModelEle.style.left = (currentX + blockModel.col) * STEP + 'px';
  }
}

// 键盘事件
function onKeyDown() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 38:
        console.log('上');
        rotate();
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
function move(x, y) {
  // 控制块元进行移动
  // var activityModel = document.getElementsByClassName('activity_model')[0];
  // activityModel.style.top = parseInt(activityModel.style.top || 0) + y * STEP + 'px';
  // activityModel.style.left = parseInt(activityModel.style.left || 0) + x * STEP + 'px';

  if(isMeet(currentX + x, currentY + y, currentModel)){
    // 底部的触碰发生在移动16宫格的时候，并且此移动是因为 Y 轴的变化而引起的
    if(y !== 0){
      // 模型之间底部发生触碰了
      fixedBottomModel();
    }
    return;
  }

  // 16宫格在动
  currentX += x;
  currentY += y;
  // 根据16宫格的位置来重新定义块元素
  loactionBlocks();
}

// 旋转模型
function rotate() {
  // 算法
  // 旋转后的行 = 旋转前的列
  // 旋转后的列 = 3 - 旋转前的行

  // 克隆以下 currentModel
  var cloneCurrentModel = _.cloneDeep(currentModel);

  // 遍历我们的数据源
  for (var key in cloneCurrentModel) {
    // 块元素的数据源
    var blockModel = cloneCurrentModel[key];
    // 实现我们的算法；只存行，因为如果存列，就找不到旋转前的行了
    var temp = blockModel.row;
    blockModel.row = blockModel.col;
    blockModel.col = 3 - temp;
  }
  // 如果旋转之后会发生变化触碰，那么就不需要进行旋转了
  if(isMeet(currentX, currentY, cloneCurrentModel)){
    return;
  }
  // 接受了这次旋转
  currentModel = cloneCurrentModel;

  loactionBlocks();
}

// 控制模型只能在容器中移动
function checkBound() {
  // 定义模型可以活动的边界
  var leftBound = 0,
    rightBound = COL_COUNT,
    bottomBound = ROW_COUNT;
  // 当块元素超出了边界之后，让 16宫格 后退一步
  for (var key in currentModel) {
    // 块元素的数据
    var blockModel = currentModel[key];
    // 左侧越界
    if (currentX < leftBound) {
      currentX++;
    }
    // 右侧越界
    if ((currentX + blockModel.col) >= rightBound) {
      currentX--;
    }
    // 底部越界
    if ((currentY + blockModel.row) >= bottomBound) {
      currentY--;
      // 把模型固定在底部
      fixedBottomModel();
    }
  }
}

// 把模型固定在底部
function fixedBottomModel() {
  // 1. 改变模型的样式
  // 2. 让模型不可以在进行移动
  var activityModelEles = document.getElementsByClassName('activity_model');
  // 要倒序，因为每遍历一遍，原来的就少一个，这就导致length有变化
  for (var i = activityModelEles.length - 1; i >= 0; i--) {
    // 拿到每个块元素
    var activityModelEle = activityModelEles[i];
    // 更改块元素的类名
    activityModelEle.className = 'fixed_model';
    // 把该块元素放入变量中
    var blockModel = currentModel[i];
    fixedBlocks[(currentY + blockModel.row) + '_' + (currentX + blockModel.col)] = activityModelEle
  }
  // 3. 创建新的模型
  createModel();
}

// 判断模型之间的触碰问题
// X，Y 表示16宫格《将要》移动到的位置
// model 表示当前模型数据源将要完成的变化
function isMeet(x, y, model){
  // 所谓模型之间的触碰，在一个固定的位置已经存在一个被固定的块元素时，那么活动中的模型不可以在占用该位置
  // 判断触碰，就是判断活动中的模型《将要移动到的位置》是否已经存在被固定的模型(块元素)了
  // 如果存在就返回 true 表示将要移动到的位置会发生触碰，否则返回 false
  for(var k in model){
    var blockModel = model[k];
    // 该位置是否已经存在块元素？
    if(fixedBlocks[(y + blockModel.row) + '_' + (x + blockModel.col)]){
      return true;
    }
  }
  return false;
}
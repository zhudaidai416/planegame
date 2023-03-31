let gameDiv = document.getElementById('game')
let scoreDiv = document.getElementById('score1')
let killDiv = document.getElementById('kill')
let bloodDiv = document.getElementById('blood')
let scoreDiv2 = document.getElementById('score2')
let player
let enemyList = []
let bulletList = []
let propList = []
let enemyNum = 0
let propNum = 0
let score = 0
let kill = 0
let enemyPlaneSpeed = 3
let propUseTime = 10
let timer1, timer2, timer3, timer4, timer5, timer6, timer7, timer8, timer9
let gameState = false
let musicState = true

// 开始游戏
function startGame() {
  let btn1 = document.getElementById('btn1')
  let pause = document.getElementById('pauseGame')
  gameDiv.style.background = 'url(./images/background_2.png) 100% 120%'
  btn1.style.display = 'none'
  pause.style.display = 'block'
  scoreDiv2.style.display = 'block'
  gameState = true
  timer()
  createPlayer()
  eventKey()
  bloodDiv.innerText = player.blood
}

// 定时器
function timer() {
  // 创建敌方飞机
  timer1 = setInterval(() => {
    createEnemyPlane()
    enemyNum++
  }, 1000);
  // 敌方飞机移动
  timer2 = setInterval(() => {
    enemyMove()
  }, 50)
  // 玩家移动
  timer3 = setInterval(() => {
    playerMove()
  }, 50)
  // 子弹移动
  timer4 = setInterval(() => {
    bulletMove()
  }, 50)
  // 子弹发射
  timer5 = setInterval(() => {
    player.shoot1()
  }, 300);
  // 判断碰撞
  timer6 = setInterval(() => {
    crashCheck()
  }, 15)
  timer7 = setInterval(() => {
    createProp()
    propNum++
  }, 10000);
  timer8 = setInterval(() => {
    propMove()
  }, 50)
  timer9 = setInterval(() => {
    propCrash()
  }, 15)
}

// 清除定时器
function clearTimer() {
  clearInterval(timer1)
  clearInterval(timer2)
  clearInterval(timer3)
  clearInterval(timer4)
  clearInterval(timer5)
  clearInterval(timer6)
  clearInterval(timer7)
  clearInterval(timer8)
  clearInterval(timer9)
}

// 创建敌方飞机
function createEnemyPlane() {
  console.log("当前敌方飞机速度" + enemyPlaneSpeed)
  if (30 < enemyNum && enemyNum <= 50) {
    enemyPlaneSpeed = 5
    console.log("当前敌方飞机速度" + enemyPlaneSpeed)
  }
  if (enemyNum > 50) {
    enemyPlaneSpeed = 8
    console.log("当前敌方飞机速度" + enemyPlaneSpeed)
  }
  let enemyPlane1 = new EnemyPlane('./images/enemy_plane1.png', parseInt(Math.random() * 366), 0, enemyPlaneSpeed, 3, 1)
  enemyList.push(enemyPlane1)
  if (enemyNum != 0 && enemyNum % 6 == 0) {
    let enemyPlane2 = new EnemyPlane('./images/enemy_plane2.png', parseInt(Math.random() * 356), 0, enemyPlaneSpeed, 5, 2)
    enemyList.push(enemyPlane2)
  }
  if (enemyNum != 0 && enemyNum % 20 == 0) {
    let enemyPlane3 = new EnemyPlane('./images/enemy_plane3.png', parseInt(Math.random() * 290), 0, enemyPlaneSpeed, 20, 3)
    enemyList.push(enemyPlane3)
  }
  // 366 = 游戏界面宽度 - 敌方飞机宽度
}

// 敌方飞机的构造函数
function EnemyPlane(imgSrc, x, y, speed, blood, kind) {
  this.imgNode = document.createElement('img')
  this.imgSrc = imgSrc
  this.x = x
  this.y = y
  this.isDead = false
  this.deadTime = 10
  this.speed = speed
  this.blood = blood
  this.kind = kind
  if (this.kind == 1) {
    this.score = 10
  } else if (this.kind == 2) {
    this.score = 20
  } else if (this.kind == 3) {
    this.score = 30
  }
  this.move = function () {
    this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
  }
  this.init = function () {
    this.imgNode.src = this.imgSrc
    this.imgNode.style.position = 'absolute'
    this.imgNode.style.left = this.x + 'px'
    this.imgNode.style.top = this.y + 'px'
    gameDiv.appendChild(this.imgNode)
  }
  this.init()
}

// 敌方飞机移动
function enemyMove() {
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i].isDead == true) {
      enemyList[i].deadTime--
      if (enemyList[i].deadTime == 0) {
        score += enemyList[i].score
        kill++
        scoreDiv.innerText = score
        scoreDiv2.innerText = score
        killDiv.innerText = kill
        gameDiv.removeChild(enemyList[i].imgNode)
        enemyList.splice(i, 1)
      }
    } else {
      if (parseInt(enemyList[i].imgNode.style.top) <= 600) {
        enemyList[i].move()
      } else {
        gameDiv.removeChild(enemyList[i].imgNode)
        enemyList.splice(i, 1)
      }
    }
  }
}

// 创建玩家飞机
function createPlayer() {
  player = new PlayerPlane('./images/player_plane.gif', 167, 500, 10, 5)
  // 167 = 1/2游戏界面 - 1/2玩家飞机
}

// 玩家飞机的构造函数
function PlayerPlane(imgSrc, x, y, speed, blood) {
  this.imgNode = document.createElement('img')
  this.imgSrc = imgSrc
  this.x = x
  this.y = y
  this.leftState = false
  this.rightState = false
  this.topState = false
  this.bottomState = false
  this.isDead = false
  this.speed = speed
  this.blood = blood
  this.shoot1 = function () {
    let bullet_sound = document.getElementById('bullet_sound')
    let bulletX = parseInt(this.imgNode.style.left) + 31
    let bulletY = parseInt(this.imgNode.style.top) - 20
    let bullet = new Bullet('./images/bullet.png', bulletX, bulletY, 10, 1)
    bulletList.push(bullet)
    bullet_sound.firstElementChild.play()
  }
  this.shoot2 = function () {
    let bulletX = parseInt(this.imgNode.style.left) + 31
    let bulletY = parseInt(this.imgNode.style.top) - 20
    let bullet1 = new Bullet('./images/bullet.png', bulletX - 25, bulletY, 10, 1)
    let bullet2 = new Bullet('./images/bullet.png', bulletX + 25, bulletY, 10, 1)
    bulletList.push(bullet1, bullet2)
    bullet_sound.firstElementChild.play()
  }
  this.shoot3 = function () {
    let bulletX = parseInt(this.imgNode.style.left) + 31
    let bulletY = parseInt(this.imgNode.style.top) - 20
    let bullet1 = new Bullet('./images/bullet.png', bulletX - 25, bulletY, 10, 1)
    let bullet2 = new Bullet('./images/bullet.png', bulletX, bulletY, 10, 1)
    let bullet3 = new Bullet('./images/bullet.png', bulletX + 25, bulletY, 10, 1)
    bulletList.push(bullet1, bullet2, bullet3)
    bullet_sound.firstElementChild.play()
  }
  this.leftMove = function () {
    if (parseInt(this.imgNode.style.left) >= 0)
      this.imgNode.style.left = parseInt(this.imgNode.style.left) - this.speed + 'px'
  }
  this.rightMove = function () {
    if (parseInt(this.imgNode.style.left) <= 334)
      this.imgNode.style.left = parseInt(this.imgNode.style.left) + this.speed + 'px'
  }
  this.topMove = function () {
    if (parseInt(this.imgNode.style.top) >= 10)
      this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px'
  }
  this.bottomMove = function () {
    if (parseInt(this.imgNode.style.top) <= 510)
      this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
  }
  this.init = function () {
    this.imgNode.src = this.imgSrc
    this.imgNode.style.position = 'absolute'
    this.imgNode.style.left = this.x + 'px'
    this.imgNode.style.top = this.y + 'px'
    gameDiv.appendChild(this.imgNode)
  }
  this.init()
}

// 判断玩家按键
function eventKey() {
  document.onkeydown = function (e) {
    // console.log(e)
    if (e.key == 'ArrowLeft') {
      player.leftState = true
    }
    if (e.key == 'ArrowRight') {
      player.rightState = true
    }
    if (e.key == 'ArrowUp') {
      player.topState = true
    }
    if (e.key == 'ArrowDown') {
      player.bottomState = true
    }
    if (e.key == 'j') {
      player.shoot1()
    }
    if (e.key == " ") {
      pauseGame()
    }
    if (e.key == "1") {
      clearInterval(timer5)
      timer5 = setInterval(() => {
        player.shoot1()
      }, 300);
    }
    if (e.key == "2") {
      clearInterval(timer5)
      timer5 = setInterval(() => {
        player.shoot2()
      }, 300);
    }
    if (e.key == "3") {
      clearInterval(timer5)
      timer5 = setInterval(() => {
        player.shoot3()
      }, 300);
    }
  }
  document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') {
      player.leftState = false
    }
    if (e.key == 'ArrowRight') {
      player.rightState = false
    }
    if (e.key == 'ArrowUp') {
      player.topState = false
    }
    if (e.key == 'ArrowDown') {
      player.bottomState = false
    }
  }
}

// 玩家移动
function playerMove() {
  if (player.leftState) {
    player.leftMove()
  }
  if (player.rightState) {
    player.rightMove()
  }
  if (player.topState) {
    player.topMove()
  }
  if (player.bottomState) {
    player.bottomMove()
  }
}

// 子弹的构造函数
function Bullet(imgSrc, x, y, speed, weili) {
  this.imgNode = document.createElement('img')
  this.imgSrc = imgSrc
  this.x = x
  this.y = y
  this.speed = speed
  this.weili = weili
  this.isDead = false
  this.move = function () {
    this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px'
  }
  this.init = function () {
    this.imgNode.src = this.imgSrc
    this.imgNode.style.position = 'absolute'
    this.imgNode.style.left = this.x + 'px'
    this.imgNode.style.top = this.y + 'px'
    gameDiv.appendChild(this.imgNode)
  }
  this.init()
}

// 子弹移动
function bulletMove() {
  for (let i = 0; i < bulletList.length; i++) {
    if (parseInt(bulletList[i].imgNode.style.top) > 0 && bulletList[i].isDead == false) {
      bulletList[i].move()
    } else {
      gameDiv.removeChild(bulletList[i].imgNode)
      bulletList.splice(i, 1)
    }
  }
}

// 判断子弹和敌方飞机是否碰撞
function crashCheck() {
  let bz_sound1 = document.getElementById('bz_sound1')
  let bz_sound2 = document.getElementById('bz_sound2')
  let bz_sound3 = document.getElementById('bz_sound3')
  let player_bz = document.getElementById('player_bz')
  for (let i = 0; i < enemyList.length; i++) {
    for (let j = 0; j < bulletList.length; j++) {
      let plLeft = parseInt(enemyList[i].imgNode.style.left)
      let plTop = parseInt(enemyList[i].imgNode.style.top)
      let btLeft = parseInt(bulletList[j].imgNode.style.left)
      let btTop = parseInt(bulletList[j].imgNode.style.top)
      let enemyX = 0
      let enemyY = 0
      let playerX = parseInt(player.imgNode.style.left)
      let playerY = parseInt(player.imgNode.style.top) + 30
      if (enemyList[i].kind == 1) {
        enemyX = 34
        enemyY = 24
      } else if (enemyList[i].kind == 2) {
        enemyX = 46
        enemyY = 60
      } else if (enemyList[i].kind == 3) {
        enemyX = 110
        enemyY = 164
      }

      // 判断敌方飞机与子弹是否碰撞
      if (btLeft + 6 >= plLeft && plLeft + enemyX >= btLeft && btTop <= plTop + enemyY && btTop + 14 >= plTop && enemyList[i].isDead == false) {
        enemyList[i].blood -= bulletList[j].weili
        if (enemyList[i].blood <= 0) {
          if (enemyList[i].kind == 1) {
            enemyList[i].imgNode.src = './images/enemy_plane1_boom.gif'
            bz_sound1.firstElementChild.play()
          }
          if (enemyList[i].kind == 2) {
            enemyList[i].imgNode.src = './images/enemy_plane2_boom.gif'
            bz_sound2.firstElementChild.play()
          }
          if (enemyList[i].kind == 3) {
            enemyList[i].imgNode.src = './images/enemy_plane3_boom.gif'
            bz_sound3.firstElementChild.play()
          }
          enemyList[i].isDead = true
        }
        bulletList[j].isDead = true
      }

      // 判断玩家飞机与敌方飞机是否发生碰撞
      if (playerX + 66 >= plLeft && plLeft + enemyX >= playerX && playerY <= plTop + enemyY && playerY + 80 >= plTop && enemyList[i].isDead == false) {
        enemyList[i].isDead = true
        if (enemyList[i].kind == 1) {
          enemyList[i].imgNode.src = './images/enemy_plane1_boom.gif'
          bz_sound1.firstElementChild.play()
          player.blood--
        }
        if (enemyList[i].kind == 2) {
          enemyList[i].imgNode.src = './images/enemy_plane2_boom.gif'
          bz_sound2.firstElementChild.play()
          player.blood -= 2
        }
        if (enemyList[i].kind == 3) {
          enemyList[i].imgNode.src = './images/enemy_plane3_boom.gif'
          bz_sound3.firstElementChild.play()
          player.blood -= 3
        }
        bloodDiv.innerText = player.blood
        if (player.blood <= 0) {
          player.isDead = true
          player.imgNode.src = './images/player_plane_boom.gif'
          player_bz.firstElementChild.play()
          clearTimer()
          let gameover = document.getElementById('gameover')
          let gamescore = document.getElementById('gamescore')
          gameover.style.display = 'block'
          gamescore.innerText = "本局得分：" + score
        }
      }
    }
  }
}

// 创建道具
function createProp() {
  console.log(propNum)
  let bombSupply = new Prop('./images/bomb_supply.png', parseInt(Math.random() * 370), 0, 3, 1)
  let bulletSupply = new Prop('./images/bullet_supply.png', parseInt(Math.random() * 371), 0, 3, 2)
  propList.push(bombSupply)
  propList.push(bulletSupply)
  if (propNum != 0 && propNum % 3 == 0) {
    let bloodSupply = new Prop('./images/blood_supply.png', parseInt(Math.random() * 373), 0, 3, 3)
    propList.push(bloodSupply)
  }
}

// 道具的构造函数
function Prop(imgSrc, x, y, speed, kind) {
  this.imgNode = document.createElement('img')
  this.imgSrc = imgSrc
  this.x = x
  this.y = y
  this.isDead = false
  this.speed = speed
  this.kind = kind
  this.move = function () {
    this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
  }
  this.init = function () {
    this.imgNode.src = this.imgSrc
    this.imgNode.style.position = 'absolute'
    this.imgNode.style.left = this.x + 'px'
    this.imgNode.style.top = this.y + 'px'
    gameDiv.appendChild(this.imgNode)
  }
  this.init()
}

// 道具移动
function propMove() {
  for (let i = 0; i < propList.length; i++) {
    if (propList[i].isDead == true) {
      if (propList[i].kind == 3) {
        player.blood += 2
        bloodDiv.innerText = player.blood
      }
      gameDiv.removeChild(propList[i].imgNode)
      propList.splice(i, 1)
    } else {
      if (parseInt(propList[i].imgNode.style.top) <= 600) {
        propList[i].move()
      } else {
        gameDiv.removeChild(propList[i].imgNode)
        propList.splice(i, 1)
      }
    }
  }
}

// 道具碰撞
function propCrash() {
  for (let i = 0; i < propList.length; i++) {
    let propLeft = parseInt(propList[i].imgNode.style.left)
    let propTop = parseInt(propList[i].imgNode.style.top)
    let playerX = parseInt(player.imgNode.style.left)
    let playerY = parseInt(player.imgNode.style.top) + 25
    let propX = 0
    let propY = 0
    if (propList[i].kind == 1) {
      propX = 30
      propY = 54
    } else if (propList[i].kind == 2) {
      propX = 29
      propY = 44
    } else if (propList[i].kind == 3) {
      propX = 27
      propY = 40
    }
    if (playerX + 66 >= propLeft && propLeft + propX >= playerX && playerY <= propTop + propY && playerY + 80 >= propTop && propList[i].kind == 1) {
      for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].isDead = true
        if (enemyList[i].kind == 1) {
          enemyList[i].imgNode.src = './images/enemy_plane1_boom.gif'
          bz_sound1.firstElementChild.play()
        }
        if (enemyList[i].kind == 2) {
          enemyList[i].imgNode.src = './images/enemy_plane2_boom.gif'
          bz_sound2.firstElementChild.play()
        }
        if (enemyList[i].kind == 3) {
          enemyList[i].imgNode.src = './images/enemy_plane3_boom.gif'
          bz_sound3.firstElementChild.play()
        }
      }
      propList[i].isDead = true
    }
    if (playerX + 66 >= propLeft && propLeft + propX >= playerX && playerY <= propTop + propY && playerY + 80 >= propTop && propList[i].kind == 2) {
      propList[i].isDead = true
      clearInterval(timer5)
      timer5 = setInterval(() => {
        player.shoot2()
      }, 300)
      setTimeout(() => {
        clearInterval(timer5)
        timer5 = setInterval(() => {
          player.shoot1()
        }, 300)
      }, 6000)
    }

    if (playerX + 66 >= propLeft && propLeft + propX >= playerX && playerY <= propTop + propY && playerY + 80 >= propTop && propList[i].kind == 3) {
      propList[i].isDead = true
    }
  }
}

// 暂停游戏
function pauseGame() {
  let popupDiv = document.getElementById('popup')
  if (gameState == true) {
    clearTimer()
    gameState = false
    popupDiv.style.display = 'block'
    console.log(gameState)
  } else {
    timer()
    gameState = true
    popupDiv.style.display = 'none'
  }
}

// 重新游戏
function againGame() {
  let popupDiv = document.getElementById('popup')
  let gameover = document.getElementById('gameover')
  // 清除定时器
  clearTimer()
  // 删除敌方飞机、子弹、玩家、道具的图片节点
  for (let i = 0; i < enemyList.length; i++) {
    gameDiv.removeChild(enemyList[i].imgNode)
  }
  for (let i = 0; i < bulletList.length; i++) {
    gameDiv.removeChild(bulletList[i].imgNode)
  }
  for (let i = 0; i < propList.length; i++) {
    gameDiv.removeChild(propList[i].imgNode)
  }
  player.imgNode.remove()
  // 所有数据重置
  enemyNum = 0
  propNum = 0
  score = 0
  kill = 0
  enemyPlaneSpeed = 3
  enemyList = []
  bulletList = []
  propList = []
  musicState = true
  gameState = false
  scoreDiv.innerText = '0'
  scoreDiv2.innerText = '0'
  killDiv.innerText = '0'
  startGame()
  popupDiv.style.display = 'none'
  gameover.style.display = 'none'
}

// 返回主页
function back() {
  let popupDiv = document.getElementById('popup')
  let gameover = document.getElementById('gameover')
  location.reload()
  popupDiv.style.display = 'none'
  gameover.style.display = 'none'
}

// 音乐
function Music() {
  let audio = document.getElementById('audio')
  if (musicState == false) {
    audio.firstElementChild.play()
    audio.className = 'iconfont icon-Volume icon'
    musicState = true
  } else {
    audio.className = 'iconfont icon-Mute icon'
    audio.firstElementChild.pause()
    musicState = false
  }
}
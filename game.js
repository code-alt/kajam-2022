// import kaboom lib
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
// make kaboom config
const config = {
  background: [51, 153, 255],
  debug: false,
};

function $(id) {
  return document.querySelector(id);
}

$("#srtbtn").addEventListener("click", start);

function start() {
  runKaboom();
  $("#srtbtn").innerText = "Continue";
  $("#srtbtn").removeEventListener("click", start);
  $("#srtbtn").addEventListener("click", continueLore);
  fallout("#srttitle");
  bringIn("#txt1");
}

var k;
var gameStarted = false;

function runKaboom() {
  k = kaboom(config);

  // load our assets (of course in alphabetical order)
  const assets = [
    "box",
    "button-used",
    "button",
    "checkpoint",
    "dirt",
    "dragon_blue_left",
    "dragon_blue_right",
    "dragon_red_left",
    "dragon_red_right",
    "fireball_blue",
    "fireball_red",
    "grass",
    "lava",
    "player",
    "mysticaldirt",
    "mysticalgrass",
    "pepper",
    "portalend",
    "portalto",
    "stone",
    "water",
    "waterbg",
  ];

  assets.forEach((img) => {
    loadSprite(img, `/images/${img}.png`);
  });

  var isJump = true;
  var health = 50;

  setInterval(() => {
    if (health > 80 || gameStarted == false) return;
    addHealth(3);
  }, 1000);

  function addHealth(points) {
    health += points;
    if (health > 100) {
      health = 100;
    }
    $("#health").style.width = health.toString() + "%";
  }

  function hurt(healthpoints) {
    health -= healthpoints;
    if (health <= 0) {
      player.pos.x = playerLocation[0];
      player.pos.y = playerLocation[1];
      $("#health").style.width = "50%";
      health = 50;
    } else {
      $("#health").style.width = health.toString() + "%";
    }
    shake(healthpoints);
  }
  var lastFrameCam;
  onUpdate(() => {
    // for (var i = 0; i < enemies.length; i++) {
    //   enemies[i].pos.y = player.pos.y;
    // }
    // make a smooth camera with lerp()
    if (isKeyDown("left") || isKeyDown("a")) {
      camPos(lerp(camPos().x, player.pos.x - 250, 0.05), height() / 2);
    } else {
      camPos(lerp(camPos().x, player.pos.x + 250, 0.05), height() / 2);
    }
    // camPos(player.pos.x + 250, height() / 2);
    if (player.pos.y > height() * 2) {
      player.pos.x = playerLocation[0];
      player.pos.y = playerLocation[1];
      hurt(100);
    }
    if (player.isGrounded() && isJump) {
      jumpEffect();
      isJump = false;
      doubleJumping = false;
    }
  });

  function jumpEffect() {
    for (var i = 0; i < rand(2, 6); i++) {
      add([
        pos(player.pos.x, player.pos.y),
        rect(rand(32, 10), rand(32, 10)),
        origin("center"),
        scale(rand(0.5, 1)),
        area(),
        body({ solid: false }),
        lifespan(0.3, { fade: 0.25 }),
        move(choose([LEFT, RIGHT]), rand(20, 120)),
      ]).jump(rand(100, 240));
    }
  }
  var rounds = 0;
  var lvl = "lvl1";
  function makePlatforms(x, y, x2, y2, spr) {
    y2 = y2 || height();
    for (var i = x; i < x2; i += 64) {
      for (var j = y; j < y2; j += 64) {
        if (spr == "grass" || spr == "mysticalgrass") {
          if (j == y) {
            add([
              pos(i, j),
              origin("topleft"),
              sprite(spr, { width: 64, height: 64 }),
              area(),
              solid(),
              lvl,
            ]);
          } else {
            var newType = spr.replaceAll("grass", "dirt");
            add([
              pos(i, j),
              origin("topleft"),
              sprite(newType, { width: 64, height: 64 }),
              area(),
              solid(),
              lvl,
            ]);
          }
        } else if (spr == "water") {
          if (j == y) {
            add([
              pos(i, j),
              origin("topleft"),
              sprite("waterbg", { width: 64, height: 64 }),
              lvl + "danger",
            ]);
          } else {
            add([
              pos(i, j),
              origin("topleft"),
              sprite(spr, { width: 64, height: 64 }),
              area(),
              lvl + "danger",
            ]);
          }
        } else if (spr == "lava") {
          add([
            pos(i, j),
            origin("topleft"),
            sprite(spr, { width: 64, height: 64 }),
            area(),
            solid(),
            lvl + "danger",
          ]);
        } else {
          add([
            pos(i, j),
            origin("topleft"),
            sprite(spr, { width: 64, height: 64 }),
            area(),
            solid(),
            lvl,
          ]);
        }
        rounds++;
      }
    }
  }
  var playerLocation = [0, 0];
  function Level(options) {
    eval(options.objectFunc);
    if (player) {
      player.pos.x = playerLocation[0];
      player.pos.y = playerLocation[1];
      return;
    }
    playerLocation = options.playerLocation;
    add([
      sprite("player", { width: 64, height: 64 }),
      pos(options.playerLocation[0], options.playerLocation[1]),
      area(),
      body(),
      rotate(),
      origin("bot"),
      "player",
    ]);
  }

  function level1() {
    makePlatforms(64, 256, 256, height(), "grass", "lvl1");
    makePlatforms(256, 320, 512, height(), "water", "lvl1");
    makePlatforms(512, 320, 768, height(), "grass", "lvl1");
    makePlatforms(1216, 512, 1536, height(), "mysticalgrass", "lvl1");
    makePlatforms(2304, 512, 2432, height(), "box", "lvl1");
    makePlatforms(1536, 576, 2496, height(), "lava", "lvl1");
    makePlatforms(2496, 512, 2880, height(), "grass", "lvl1");
    makePortal(2880, 420, "lvl2()");
    add([
      pos(-24, 24),
      text("Welcome!", {
        size: 48,
        font: "sink",
      }),
      lvl,
    ]);
    add([
      pos(280, 24),
      text("You can use A-D or arrow keys to move and space or W to jump.", {
        size: 36,
        width: 512,
        font: "sink",
      }),
      lvl,
    ]);
    add([
      pos(880, 256),
      text("loooong jump", {
        size: 36,
        width: 512,
        font: "sink",
      }),
      rotate(24),
      lvl,
    ]);
    add([
      pos(2560, 64),
      text("Leave using this portal!", {
        size: 36,
        width: 512,
        font: "sink",
      }),
      rotate(16),
      lvl,
    ]);
    add([
      pos(1800, 320),
      text("super looong jump across deadly lava", {
        size: 36,
        width: 512,
        font: "sink",
      }),
      rotate(-12),
      lvl,
    ]);
    add([
      pos(1200, 12),
      text(
        "See the top left bar? That's your spice power! Don't let this fall to zero or you'll restart the level. You can use special abilities like double jumping if you have enough power. (20%+) Try it here!",
        {
          size: 36,
          width: 512,
          font: "sink",
        }
      ),
      lvl,
    ]);
  }
  var enemy;
  function enemy(x, y, type, hp, dir) {
    enemy = add([
        pos(x, y),
        sprite(type, { width: 290, height: 325 }),
        area(),
        solid(),
        origin("bot"),
        "enemy",
      ]);
  }

  function level2() {
    destroyAll("lvl1");
    destroyAll("lvl1danger");
    destroyAll("portal");
    makePlatforms(64, 256, 256, height(), "grass", "lvl2");
    add([
      pos(-24, 64),
      text("Let's turn the difficulty up. Good luck!", {
        size: 36,
        font: "sink",
      }),
      lvl,
    ]);
    makePlatforms(256, 384, 1152, height(), "water", "lvl2");
    makePlatforms(1152, 320, 2048, height(), "mysticalgrass", "lvl2");
    add([
      pos(1152, 64),
      text("X to attack. (Uses 10%)", {
        size: 36,
        font: "sink",
      }),
      lvl,
    ]);
    enemy(1800, 320, "dragon_red_left", 3);
  }

  function lvl2() {
    lvl = "lvl2";
    Level({
      name: "MainLevel2",
      objectFunc: "level2()",
      playerLocation: [128, 0],
    });
  }

  Level({
    name: "MainLevel1",
    objectFunc: "level1();",
    playerLocation: [128, 0],
  });

  // {
  //   width: 64,
  //   height: 64,
  //   pos: vec2(100, 200),
  //   "@": () => [
  //     sprite("player", { width: 64, height: 64 }),
  //     area(),
  //     body(),
  //     rotate(),
  //     origin("bot"),
  //     "player",
  //   ],
  //   "=": () => [
  //     sprite("grass", { width: 64, height: 64 }),
  //     area(),
  //     solid(),
  //     origin("bot"),
  //   ],
  // }
  // );

  const SPEED = 640;
  const grav = 2000;
  var player = get("player")[0];
  gravity(grav);

  var doubleJumping = false;
  onKeyPress(["space", "w"], () => {
    if (player.isGrounded()) {
      player.jump();
      isJump = true;
    } else if (health > 20 && doubleJumping == false) {
      player.doubleJump();
      hurt(20);
      isJump = true;
      doubleJumping = true;
    }
  });

  var portalCode;

  function makePortal(x, y, func) {
    add([
      pos(x, y),
      origin("bot"),
      sprite("portalto", { width: 90, height: 180 }),
      area(),
      "portal",
    ]);
    portalCode = () => {
      eval(func);
    };
  }

  player.onCollide("portal", () => {
    portalCode();
  });

  player.onDoubleJump(() => {
    jumpEffect();
  });

  setInterval(() => {
    if (lvl == "lvl2") {
    // will add support for multiple enemies soon
    add([
      sprite("fireball_red", { width: 64, height: 64 }),
      pos(enemy.pos.x, enemy.pos.y + rand(-100, 100)),
      area(),
      origin("center"),
      move(dir || LEFT, 1200),
      cleanup(),
      "bullet",
    ]);
  }
  }, 2000);

  onKeyPress("x", () => {
    // attack
    if (health < 11) return;
    add([
      sprite("fireball_blue", { width: 32, height: 32 }),
      pos(player.pos.x, player.pos.y - 32),
      area(),
      origin("center"),
      move(lastPressed || RIGHT, 1200),
      cleanup(),
      "ball",
    ]);
    hurt(10);
  });

  
  var lastPressed = "";
  onKeyDown(["left", "a"], () => {
    if (isKeyDown("left") && isKeyDown("a")) return player.move(-SPEED / 2, 0);
    player.move(-SPEED, 0);
    lastPressed = LEFT;
  });

  onKeyDown(["right", "d"], () => {
    if (isKeyDown("right") && isKeyDown("d")) return player.move(SPEED / 2, 0);
    player.move(SPEED, 0);
    lastPressed = RIGHT;
  });

  player.onCollide(lvl + "danger", () => {
    player.pos.x = playerLocation[0];
    player.pos.y = playerLocation[1];
    hurt(100);
  });
}

var currentPlacement = 1;
function continueLore() {
  if (currentPlacement == document.getElementsByClassName("tt").length) {
    fallout("#gameframe");
    $("#gameDiv").style.opacity = "0";
    $("#gameDiv").style.display = "none";
    $("#srtbtn").style.display = "none";
    gameStarted = true;
    return;
  }
  fallout("#txt" + currentPlacement);
  bringIn("#txt" + (currentPlacement + 1));
  currentPlacement++;
}
// check bullet collision
player.onCollide("bullet", (b) => {
  hurt(25);
  b.destroy();
});

function fallout(id) {
  $(id).style.display = "none";
  $(id).style = `
    transform: initial;
    font-size: initial;
    opacity: 0;
    `;
}

function bringIn(id) {
  $(id).style = `
    transform: translate(-50%, -50%);
    font-size: 64px;
    opacity: 1;
    display: initial;
    `;
}

window.onerror = function (msg, url, line) {
  document.write("Error : " + msg + "<br><br>");
  document.write("Line number : " + line + "<br><br>");
  document.write("File : " + url);
};

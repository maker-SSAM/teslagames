import Phaser from "phaser";
import "../../src/shell/shell.css";
import { mountShellTopbar } from "../../src/shell/topbar.js";
import { playCollectSound, playWinSound } from "../../src/shell/beep.js";

const WIN_TARGET = 20;
const GRAVITY_Y = 1400;
const JUMP_VELOCITY = -520;
const MAX_FALL_SPEED = 700;
const CEIL_MARGIN = 60;
const GROUND_MARGIN = 60;

mountShellTopbar({ showExit: true, exitHref: "../../index.html" });

// Some embedded/preview webviews report window.innerWidth/innerHeight as 0
// for a frame or two before layout settles, so wait until real values show up.
function waitForViewportSize(cb) {
  if (window.innerWidth > 0 && window.innerHeight > 0) {
    cb(window.innerWidth, window.innerHeight);
  } else {
    requestAnimationFrame(() => waitForViewportSize(cb));
  }
}

waitForViewportSize(startGame);

function startGame(W, H) {
  const winBannerEl = document.getElementById("win-banner");

  let leftBalloon;
  let rightBalloon;
  let starsGroup;
  let scoreLabel;
  let score = 0;
  let won = false;

  function makeBalloon(scene, x) {
    const balloon = scene.add.circle(x, H / 2, 36, 0xff9f43);
    balloon.setStrokeStyle(4, 0xe8890f);
    scene.physics.add.existing(balloon);
    balloon.body.setGravityY(GRAVITY_Y);
    balloon.body.setMaxVelocity(9999, MAX_FALL_SPEED);
    balloon.body.setCollideWorldBounds(true);
    balloon.jump = () => balloon.body.setVelocityY(JUMP_VELOCITY);
    return balloon;
  }

  // Stars fall in the same column as their balloon (with a little wobble),
  // so a single tap (which only moves the balloon up/down) is actually
  // enough to catch them -- no side-to-side control needed.
  function spawnStar(scene, columnX) {
    const x = columnX + Phaser.Math.Between(-40, 40);
    const star = scene.add.rectangle(x, -30, 32, 32, 0x2ed573);
    scene.physics.add.existing(star);
    star.body.setAllowGravity(false);
    star.body.setVelocityY(160);
    starsGroup.add(star);
  }

  function handleTap(x) {
    if (x < W / 2) leftBalloon.jump();
    else rightBalloon.jump();
  }

  function win(scene) {
    won = true;
    playWinSound();
    winBannerEl.classList.add("show");
    scene.time.delayedCall(2200, () => {
      winBannerEl.classList.remove("show");
      score = 0;
      scoreLabel.setText(`⭐ 0 / ${WIN_TARGET}`);
      won = false;
    });
  }

  class MainScene extends Phaser.Scene {
    create() {
      // Shrink the collidable area so balloons stop with a margin from the
      // very top/bottom edge instead of touching them.
      this.physics.world.setBounds(0, CEIL_MARGIN, W, H - CEIL_MARGIN - GROUND_MARGIN);

      leftBalloon = makeBalloon(this, W * 0.25);
      rightBalloon = makeBalloon(this, W * 0.75);

      scoreLabel = this.add
        .text(W / 2, 20, `⭐ 0 / ${WIN_TARGET}`, { fontSize: "32px", color: "#22303c" })
        .setOrigin(0.5, 0);

      starsGroup = this.physics.add.group();

      this.time.addEvent({ delay: 1100, loop: true, callback: () => spawnStar(this, leftBalloon.x) });
      this.time.addEvent({ delay: 1300, loop: true, callback: () => spawnStar(this, rightBalloon.x) });

      this.physics.add.overlap([leftBalloon, rightBalloon], starsGroup, (_balloon, star) => {
        if (won) return;
        star.destroy();
        score++;
        scoreLabel.setText(`⭐ ${score} / ${WIN_TARGET}`);
        playCollectSound();
        if (score >= WIN_TARGET) win(this);
      });

      // Phaser's pointer events already unify mouse clicks and touch taps.
      this.input.on("pointerdown", (pointer) => handleTap(pointer.x));
    }

    update() {
      for (const star of starsGroup.getChildren().slice()) {
        if (star.y > H + 50) star.destroy();
      }
    }
  }

  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: W,
    height: H,
    backgroundColor: "#7ec8ff",
    parent: undefined,
    input: { activePointers: 2 },
    physics: { default: "arcade", arcade: { debug: false } },
    scene: MainScene,
  });

  // Make sure the canvas fills the screen and sits below the shell top bar.
  game.canvas.style.position = "fixed";
  game.canvas.style.inset = "0";
  game.canvas.style.display = "block";
}

import kaplay from "kaplay";
import "../../src/shell/shell.css";
import { mountShellTopbar } from "../../src/shell/topbar.js";
import { playCollectSound, playWinSound } from "../../src/shell/beep.js";

const WIN_TARGET = 20;
const GRAVITY = 1400;
const JUMP_VELOCITY = 520;
const MAX_FALL_SPEED = 700;
const CEIL_MARGIN = 60;
const GROUND_MARGIN = 60;

mountShellTopbar({ showExit: true, exitHref: "/" });

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
  const k = kaplay({
    width: W,
    height: H,
    background: [126, 200, 255],
    touchToMouse: true,
    global: false,
  });

  // Make sure the canvas fills the screen and sits below the shell top bar.
  k.canvas.style.position = "fixed";
  k.canvas.style.inset = "0";
  k.canvas.style.display = "block";

  function makeBalloon(x, emoji) {
    const balloon = k.add([
      k.text(emoji, { size: 72 }),
      k.pos(x, H / 2),
      k.anchor("center"),
      k.area(),
      "balloon",
      { vel: 0 },
    ]);

    balloon.onUpdate(() => {
      balloon.vel += GRAVITY * k.dt();
      balloon.vel = Math.min(balloon.vel, MAX_FALL_SPEED);
      balloon.pos.y += balloon.vel * k.dt();

      if (balloon.pos.y > H - GROUND_MARGIN) {
        balloon.pos.y = H - GROUND_MARGIN;
        balloon.vel = 0;
      }
      if (balloon.pos.y < CEIL_MARGIN) {
        balloon.pos.y = CEIL_MARGIN;
        balloon.vel = 0;
      }
    });

    balloon.jump = () => {
      balloon.vel = -JUMP_VELOCITY;
    };

    return balloon;
  }

  const leftBalloon = makeBalloon(W * 0.25, "🎈");
  const rightBalloon = makeBalloon(W * 0.75, "🎈");

  let score = 0;
  const scoreLabel = k.add([
    k.text(`⭐ 0 / ${WIN_TARGET}`, { size: 32 }),
    k.pos(W / 2, 20),
    k.anchor("top"),
    k.fixed(),
  ]);

  // Stars fall in the same column as their balloon (with a little wobble),
  // so a single tap (which only moves the balloon up/down) is actually
  // enough to catch them -- no side-to-side control needed.
  function spawnStar(columnX) {
    const x = columnX + k.rand(-40, 40);
    k.add([
      k.text("⭐", { size: 40 }),
      k.pos(x, -30),
      k.anchor("center"),
      k.area(),
      k.move(k.DOWN, 160),
      "star",
    ]);
  }

  k.loop(1.1, () => spawnStar(leftBalloon.pos.x));
  k.loop(1.3, () => spawnStar(rightBalloon.pos.x));

  k.onUpdate("star", (star) => {
    if (star.pos.y > H + 50) k.destroy(star);
  });

  let won = false;

  k.onCollide("balloon", "star", (_balloon, star) => {
    if (won) return;
    k.destroy(star);
    score++;
    scoreLabel.text = `⭐ ${score} / ${WIN_TARGET}`;
    playCollectSound();
    if (score >= WIN_TARGET) win();
  });

  function handleTap(x) {
    if (x < W / 2) leftBalloon.jump();
    else rightBalloon.jump();
  }

  k.onTouchStart((pos) => handleTap(pos.x));

  // Use a raw DOM listener for mouse clicks (desktop testing): kaplay's
  // onMousePress relies on onMouseMove having already run at least once to
  // track pointer position, which never happens for a synthetic/first click.
  k.canvas.addEventListener("mousedown", (e) => {
    const rect = k.canvas.getBoundingClientRect();
    handleTap(e.clientX - rect.left);
  });

  function win() {
    won = true;
    playWinSound();
    document.getElementById("win-banner").classList.add("show");
    k.wait(2.2, () => {
      document.getElementById("win-banner").classList.remove("show");
      score = 0;
      scoreLabel.text = `⭐ 0 / ${WIN_TARGET}`;
      won = false;
    });
  }
}

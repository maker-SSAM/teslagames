import { mountShellTopbar } from "./shell/topbar.js";

mountShellTopbar({ showExit: false });

const games = [
  {
    id: "balloon-stars",
    title: "별 모으기 열기구",
    icon: "🎈",
    href: "./games/balloon-stars/index.html",
    available: true,
  },
  {
    id: "coming-soon",
    title: "새 게임 준비중",
    icon: "➕",
    available: false,
  },
];

const grid = document.getElementById("hub-grid");

for (const game of games) {
  const card = document.createElement(game.available ? "a" : "div");
  card.className = "game-card" + (game.available ? "" : " game-card--soon");
  if (game.available) card.href = game.href;

  const icon = document.createElement("div");
  icon.className = "game-card__icon";
  icon.textContent = game.icon;

  const title = document.createElement("div");
  title.className = "game-card__title";
  title.textContent = game.title;

  card.appendChild(icon);
  card.appendChild(title);
  grid.appendChild(card);
}

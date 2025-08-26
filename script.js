// Setup canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

// Load character sprite (your couple image)
const playerImg = new Image();
playerImg.src = "characters.png"; // <- put your couple sprite image here

// Player settings
const player = {
  x: 50,
  y: 400,
  width: 80,
  height: 100,
  dx: 0,
  dy: 0,
  speed: 4,
  jumpPower: -12,
  gravity: 0.6,
  grounded: false
};

// Platforms
const platforms = [
  { x: 0, y: 470, width: 900, height: 30 },   // ground
  { x: 200, y: 380, width: 120, height: 20 },
  { x: 400, y: 300, width: 120, height: 20 },
  { x: 600, y: 220, width: 120, height: 20 }
];

// Coins
const coins = [
  { x: 220, y: 340, collected: false },
  { x: 420, y: 260, collected: false },
  { x: 640, y: 180, collected: false }
];

// Goal flag
const goal = { x: 800, y: 140, width: 40, height: 80 };

// Keys
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background sky + ground
  ctx.fillStyle = "#8bc34a";
  ctx.fillRect(0, 470, canvas.width, 30);

  // Platforms
  ctx.fillStyle = "#795548";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Coins
  coins.forEach(c => {
    if (!c.collected) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
      ctx.closePath();
    }
  });

  // Goal (heart flag)
  ctx.fillStyle = "red";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
  ctx.fillStyle = "pink";
  ctx.font = "20px Arial";
  ctx.fillText("♥", goal.x + 10, goal.y + 25);

  // Movement
  if (keys["ArrowLeft"] || keys["a"]) {
    player.dx = -player.speed;
  } else if (keys["ArrowRight"] || keys["d"]) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }

  if ((keys["ArrowUp"] || keys["w"]) && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  // Apply gravity
  player.dy += player.gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Collision with platforms
  player.grounded = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + 20 &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  });

  // Draw player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Collect coins
  coins.forEach(c => {
    if (!c.collected &&
      player.x < c.x + 10 &&
      player.x + player.width > c.x - 10 &&
      player.y < c.y + 10 &&
      player.y + player.height > c.y - 10
    ) {
      c.collected = true;
    }
  });

  // Check win
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("You Win! Love Conquers All ♥", 250, 250);
    return; // stop game loop
  }

  requestAnimationFrame(gameLoop);
}

playerImg.onload = () => {
  gameLoop();
};

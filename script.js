// Audio element reference
const audio = document.getElementById("myAudio");
let isMusicPlaying = false;

// Game state management
let currentScreen = "loading";
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  showScreen("loading");
  simulateLoading();
  addEventListeners();
  // initializeTetris() Dihapus dari sini, dipindahkan ke showScreen("tetris")
  // setupStartButton() Dihapus dan logic-nya dipindahkan ke addEventListeners
}

function simulateLoading() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.querySelector(".progress-text");
  const loadingText = document.querySelector(".loading-text");
  const loadingScreen = document.getElementById("loading-screen");

  let progress = 0;
  const loadingMessages = [
    "> INITIALIZING..._",
    "> LOADING MEMORIES..._",
    "> PREPARING SURPRISE..._",
    "> ALMOST READY..._",
    "> LOADING COMPLETE!_",
  ];

  let messageIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;

    if (progress > 100) progress = 100;

    progressFill.style.width = progress + "%";
    progressText.textContent = Math.floor(progress) + "%";

    const newMessageIndex = Math.floor(
      (progress / 100) * (loadingMessages.length - 1)
    );
    if (
      newMessageIndex !== messageIndex &&
      newMessageIndex < loadingMessages.length
    ) {
      messageIndex = newMessageIndex;

      loadingText.style.opacity = "0";

      setTimeout(() => {
        loadingText.innerHTML = loadingMessages[messageIndex];
        loadingText.style.opacity = "1";
      }, 200);
    }

    if (progress >= 100) {
      clearInterval(interval);
      loadingScreen.classList.add("loading-complete");

      setTimeout(() => {
        transitionToMainScreen();
      }, 1000);
    }
  }, 200);
}

function transitionToMainScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  const mainScreen = document.getElementById("main-screen");

  loadingScreen.classList.add("fade-out");

  setTimeout(() => {
    loadingScreen.classList.remove("active", "fade-out", "loading-complete");

    mainScreen.classList.add("active", "screen-entering");
    currentScreen = "main";

    setTimeout(() => {
      initializeMainScreen();
    }, 100);

    setTimeout(() => {
      mainScreen.classList.remove("screen-entering");
    }, 1200);
  }, 600);
}

function initializeMainScreen() {
  const menuButtons = document.querySelectorAll(".menu-btn");

  // Efek tekan tombol menu
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });

  // Efek hover tombol menu
  menuButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
}

function showScreen(screenName) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(screenName + "-screen");
  if (targetScreen) {
    targetScreen.classList.add("active");
    currentScreen = screenName;

    // Reset tombol 'SELANJUTNYA' untuk pesan, agar disembunyikan lagi
    const msgContinueBtn = document.querySelector(
      "#message-screen .continue-btn"
    );
    if (msgContinueBtn) {
      msgContinueBtn.style.display = "none";
    }

    switch (screenName) {
      case "message":
        setTimeout(() => {
          initializeMessage();
        }, 100);
        break;
      case "gallery":
        setTimeout(() => {
          initializeGallery();
        }, 100);
        break;
      case "music":
        setTimeout(() => {
          initializeMusicPlayer();
        }, 100);
        break;
      case "tetris":
        setTimeout(() => {
          // Inisialisasi Tetris HANYA saat layar Tetris diakses
          if (!tetrisGame) {
            initializeTetris();
          }

          if (tetrisGame && !tetrisGame.gameRunning) {
            startTetrisGame();
          }
        }, 100);
        break;
    }
  }
}

// Message Page Functions
function initializeMessage() {
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }

  const messageScreen = document.getElementById("message-screen");
  if (!messageScreen) return;

  const pageScreen = messageScreen.querySelector(".page-screen");
  if (pageScreen) {
    pageScreen.innerHTML = `
            <div class="page-header">Message</div>
            <div class="message-content">
                </div>
            <button class="skip-btn">SKIP</button>
        `;

    // Menambahkan listener SKIP langsung ke elemen yang baru dibuat
    const skipBtn = pageScreen.querySelector(".skip-btn");
    if (skipBtn) {
      skipBtn.addEventListener("click", skipTypewriter);
    }
  }

  setTimeout(() => {
    startTypewriter();
  }, 300);
}

const FULL_MESSAGE = `Hi, TASYA DWI ANGGRAINI

Happy Birthday!

Hallooooo nyebelinnn, sebelumnya aku mau minta maaf atas segala hal yang udah aku lakuin ke kamu selama ini hehe, hari ini aku pengen kamu ngerasain semua hal positif dan keajaiban yang cuma bisa didapetin kalo kamu ada di dunia ini, Semoga segala keinginanmu tercapai yaaaaaa, semoga yang disemogakan tersemogakan, aku tau kamu kuat kokkkk aku percaya kamu hebat, aku liat sekilas kamu bisa menjalani kerasnya kenyataan dunia ini walaupun tanpa aku hehe, tetap semangat yaaaa gapai apa yang kamu inginkan jangan pernah menyerahhhh.

In the end times makes everything a habit, I trust in another time in a happier place we'll met again, No one sees how broken i really am but it's okay atleast one of us is happy now, I'm really caught between reality, Drowning in my own thoughts

Terima kasih udah jadi bagian hidup aku yang paling berharga, sayanggggggg. Kamu bener-bener bikin hari hariku jadi lebih berarti dan penuh warna, Semoga di tahun yang baru ini(Cieeee udah kepala 2), kamu makin bahagia, makin sukses, dan tentunya makin cantikkkkkk (Walaupun udah cantik banget sih hehe) makin lucu jugaaaaaa (Ah yang ini sih udah gausah dijelasin gimana gimananya, semua orang juga tauuu) Selamat Ulang Tahun yang ke 20 yaaaaaa, sayangkuuuuuuu.

I love you so much!`;

function startTypewriter() {
  const messageContent = document.querySelector(".message-content");
  const continueBtn = document.querySelector("#message-screen .continue-btn");
  const skipBtn = document.querySelector(".skip-btn"); // Ambil skip button

  if (!messageContent) {
    console.log("Error: .message-content element not found!");
    return;
  }

  messageContent.innerHTML = "";
  let charIndex = 0;
  isTyping = true;
  if (skipBtn) skipBtn.style.display = "block"; // Tampilkan skip button saat mengetik

  if (typewriterInterval) {
    clearInterval(typewriterInterval);
  }

  typewriterInterval = setInterval(() => {
    if (charIndex < FULL_MESSAGE.length) {
      const char = FULL_MESSAGE[charIndex];
      if (char === "\n") {
        messageContent.innerHTML += "<br>";
      } else {
        messageContent.innerHTML += char;
      }
      charIndex++;
      messageContent.scrollTop = messageContent.scrollHeight;
    } else {
      // Typewriter Selesai
      clearInterval(typewriterInterval);
      isTyping = false;
      console.log("Typewriter completed!");

      // Sembunyikan Skip, Tampilkan Continue
      if (skipBtn) skipBtn.style.display = "none";
      if (continueBtn) continueBtn.style.display = "block";
    }
  }, 30);
}

function skipTypewriter() {
  const messageContent = document.querySelector(".message-content");
  const continueBtn = document.querySelector("#message-screen .continue-btn");
  const skipBtn = document.querySelector(".skip-btn");

  if (isTyping && typewriterInterval) {
    clearInterval(typewriterInterval);
    if (messageContent) {
      const htmlMessage = FULL_MESSAGE.replace(/\n/g, "<br>");
      messageContent.innerHTML = htmlMessage;
      isTyping = false;
      messageContent.scrollTop = messageContent.scrollHeight;

      // Sembunyikan Skip, Tampilkan Continue
      if (skipBtn) skipBtn.style.display = "none";
      if (continueBtn) continueBtn.style.display = "block";

      console.log("Typewriter skipped - full message displayed");
    }
  }
}

// Gallery Functions
function initializeGallery() {
  const galleryContent = document.querySelector(".gallery-content");
  if (!galleryContent) return;

  galleryContent.innerHTML = "";

  const galleryHTML = `
        <div class="photobox-header">
            <div class="photobox-dot red"></div>
            <span class="photobox-title">PHOTOBOX</span>
            <div class="photobox-dot green"></div>
        </div>
        <div class="photobox-progress">READY TO PRINT</div>
        <div class="photo-display">
            <div class="photo-placeholder">Press MULAI CETAK to start photo session</div>
        </div>
        <div class="photobox-controls">
            <button class="photo-btn">MULAI CETAK</button>
        </div>
    `;

  galleryContent.innerHTML = galleryHTML;

  setTimeout(() => {
    const photoBtn = document.querySelector(".photo-btn");
    if (photoBtn) {
      photoBtn.removeEventListener("click", startPhotoShow); // Hapus listener lama jika ada
      photoBtn.removeEventListener("click", startNewSession);
      photoBtn.addEventListener("click", startPhotoShow);
    }
  }, 100);
}

function startPhotoShow() {
  const photoBtn = document.querySelector(".photo-btn");
  const photoDisplay = document.querySelector(".photo-display");
  const progressDiv = document.querySelector(".photobox-progress");

  if (!photoBtn || !photoDisplay || !progressDiv) return;

  const photos = [
    {
      text: "",
      image: "./images/photo1.jpeg",
    },
    {
      text: "",
      image: "./images/photo2.jpeg",
    },
    {
      text: "",
      image: "./images/photo3.jpeg",
    },
    {
      text: "",
      image: "./images/photo4.jpeg",
    },
    {
      text: "",
      image: "./images/photo5.jpeg",
    },
    {
      text: "",
      image: "./images/photo6.jpeg",
    },
    {
      text: "",
      image: "./images/photo7.jpeg",
    },
    {
      text: "",
      image: "./images/photo8.jpeg",
    },
  ];

  photoBtn.textContent = "MENCETAK...";
  photoBtn.disabled = true;
  progressDiv.textContent = "INITIALIZING CAMERA...";
  photoBtn.removeEventListener("click", startPhotoShow);
  photoBtn.removeEventListener("click", startNewSession);

  let framesHTML = "";
  for (let i = 0; i < photos.length; i++) {
    framesHTML += `
            <div class="photo-frame" id="frame-${i + 1}">
                <div class="photo-content">READY</div>
            </div>
        `;
  }

  const photoStripHTML = `
        <div class="photo-strip">
            <div class="photo-strip-header">PHOTOSTRIP SESSION</div>
            <div class="photo-frames-container">
                ${framesHTML}
            </div>
            <div class="photo-strip-footer">💕 NYEBELIN KOCAKKKKKK 💕</div>
        </div>
        <div class="scroll-indicator">⬇ Scroll Down ⬇</div>
    `;

  photoDisplay.innerHTML = photoStripHTML;
  currentPhotoIndex = 0;

  let countdown = 3;
  progressDiv.textContent = `GET READY... ${countdown}`;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      progressDiv.textContent = `GET READY... ${countdown}`;
    } else {
      clearInterval(countdownInterval);
      progressDiv.textContent = "SMILE! 📸";
      startPhotoCapture(photos);
    }
  }, 1000);
}

function startPhotoCapture(photos) {
  const progressDiv = document.querySelector(".photobox-progress");
  const photoBtn = document.querySelector(".photo-btn");
  const framesContainer = document.querySelector(".photo-frames-container");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  const captureInterval = setInterval(() => {
    if (currentPhotoIndex < photos.length) {
      const frameId = `frame-${currentPhotoIndex + 1}`;
      const frame = document.getElementById(frameId);

      if (frame) {
        progressDiv.textContent = "✨ FLASH! ✨";

        setTimeout(() => {
          if (framesContainer) {
            try {
              const frameTop = frame.offsetTop - framesContainer.offsetTop;
              const containerHeight = framesContainer.clientHeight;
              const frameHeight = frame.clientHeight;

              const scrollPosition =
                frameTop - containerHeight / 2 + frameHeight / 2;

              framesContainer.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
              });
            } catch (error) {
              const frameTop = frame.offsetTop - framesContainer.offsetTop;
              framesContainer.scrollTop =
                frameTop - framesContainer.clientHeight / 2;
            }
          }
        }, 200);

        setTimeout(() => {
          frame.classList.add("filled");

          const photo = photos[currentPhotoIndex];
          frame.innerHTML = `
                        <img src="${photo.image}" alt="${photo.text}" class="photo-image" 
                            onerror="this.style.display='none'; this.nextElementSibling.style.background='linear-gradient(45deg, #ff6b9d, #c44569)';" />
                        <div class="photo-overlay">
                            <div class="photo-content">${photo.text}</div>
                        </div>
                    `;

          const displayCount = currentPhotoIndex + 1;
          progressDiv.textContent = `CAPTURED ${displayCount}/${photos.length}`;

          if (currentPhotoIndex < photos.length - 1 && scrollIndicator) {
            scrollIndicator.style.display = "block";
          }

          currentPhotoIndex++;
        }, 500);
      } else {
        currentPhotoIndex++;
      }
    } else {
      // Selesai
      clearInterval(captureInterval);

      if (scrollIndicator) {
        scrollIndicator.style.display = "none";
      }

      setTimeout(() => {
        if (framesContainer) {
          try {
            framesContainer.scrollTo({ top: 0, behavior: "smooth" });
          } catch (error) {
            framesContainer.scrollTop = 0;
          }
        }
      }, 1000);

      setTimeout(() => {
        progressDiv.textContent = "🎉 PHOTO STRIP COMPLETE! 🎉";
        photoBtn.textContent = "CETAK LAGI";
        photoBtn.disabled = false;

        photoBtn.addEventListener("click", startNewSession);
      }, 2000);
    }
  }, 2500);
}

function startNewSession() {
  const photoBtn = document.querySelector(".photo-btn");
  const progressDiv = document.querySelector(".photobox-progress");
  const photoDisplay = document.querySelector(".photo-display");

  progressDiv.textContent = "READY TO PRINT";
  photoBtn.textContent = "MULAI CETAK";

  photoBtn.removeEventListener("click", startNewSession);
  photoBtn.addEventListener("click", startPhotoShow);

  if (photoDisplay) {
    photoDisplay.innerHTML =
      '<div class="photo-placeholder">Press MULAI CETAK to start photo session</div>';
  }

  currentPhotoIndex = 0;
}

// Music Player Functions
function initializeMusicPlayer() {
  const musicContent = document.querySelector(".music-content");
  if (!musicContent) return;

  musicContent.innerHTML = `
        <div class="spotify-container">
            <div class="spotify-header">
                <div class="spotify-logo">♪ Spotify Playlists</div>
            </div>
            <div class="spotify-embed-container">
                <iframe id="spotify-iframe" 
                        style="border-radius:12px" 
                        src="" 
                        width="100%" 
                        height="200" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                </iframe>
            </div>
            <div class="playlist-controls">
                <button class="playlist-btn active" data-playlist="1">Playlist 1</button>
                <button class="playlist-btn" data-playlist="2">Playlist 2</button>
                <button class="playlist-btn" data-playlist="3">Playlist 3</button>
            </div>
            <div class="music-info">
                <div class="current-playlist">Now Playing: Birthday Special Mix</div>
                <div class="playlist-description">Lagu-lagu spesial untuk hari istimewa kamu ✨</div>
            </div>
        </div>
    `;

  addSpotifyPlayerListeners();
  loadSpotifyPlaylist(1);
}

function addSpotifyPlayerListeners() {
  const playlistBtns = document.querySelectorAll(".playlist-btn");

  playlistBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      playlistBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const playlistNum = parseInt(this.getAttribute("data-playlist"));
      loadSpotifyPlaylist(playlistNum);
    });
  });
}

function loadSpotifyPlaylist(playlistNumber) {
  const iframe = document.getElementById("spotify-iframe");
  const currentPlaylist = document.querySelector(".current-playlist");
  const playlistDescription = document.querySelector(".playlist-description");

  if (!iframe) return;

  // CATATAN: GANTI URL PLACEHOLDER INI DENGAN URL EMBED SPOTIFY ASLI ANDA
  const playlists = {
    1: {
      embedUrl:
        "https://open.spotify.com/embed/playlist/5PCY65bB04srOwJgjuecut?utm_source=generator",
      name: "I",
      description:
        "Aku gatau lagu lagu, ini asal ambil playlist orang di tiktok hehe",
    },
    2: {
      embedUrl:
        "https://open.spotify.com/embed/playlist/3iCsqHYJ2ILzNSsWIuxRgT?utm_source=generator", // Ganti dengan URL Spotify Embed yang valid!
      name: "Love ",
      description: "Ini juga",
    },
    3: {
      embedUrl:
        "https://open.spotify.com/embed/playlist/7tj5Dblki89mIdHVzIm6DO?utm_source=generator", // Ganti dengan URL Spotify Embed yang valid!
      name: "YOU",
      description: "Ini juga hehehe",
    },
  };

  const selectedPlaylist = playlists[playlistNumber];

  if (selectedPlaylist) {
    iframe.src = selectedPlaylist.embedUrl;

    if (currentPlaylist) {
      currentPlaylist.textContent = `Now Playing: ${selectedPlaylist.name}`;
    }

    if (playlistDescription) {
      playlistDescription.textContent = selectedPlaylist.description;
    }

    iframe.style.opacity = "0.5";

    iframe.onload = function () {
      this.style.opacity = "1";
    };
  }
}

// Tetris Game Functions
function initializeTetris() {
  const canvas = document.getElementById("tetris-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const gameContainer = document.querySelector(".tetris-game");
  if (gameContainer) {
    const containerRect = gameContainer.getBoundingClientRect();

    // Menggunakan ukuran hardcode yang lebih aman jika container belum terender penuh
    const maxWidth = containerRect.width > 0 ? containerRect.width - 15 : 285;
    const maxHeight =
      containerRect.height > 0 ? containerRect.height - 15 : 385;

    const aspectRatio = 10 / 20; // Tetris klasik 10x20
    let canvasWidth = Math.min(maxWidth, maxHeight * aspectRatio);
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > maxHeight) {
      canvasHeight = maxHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }

    canvasWidth = Math.max(canvasWidth, 200); // Batasan minimum
    canvasHeight = Math.max(canvasHeight, 400);

    canvas.width = Math.floor(canvasWidth);
    canvas.height = Math.floor(canvasHeight);
  } else {
    canvas.width = 250;
    canvas.height = 500;
  }

  const boardWidth = 10;
  const blockSize = Math.max(Math.floor(canvas.width / boardWidth), 15);
  const boardHeight = Math.floor(canvas.height / blockSize);

  tetrisGame = {
    canvas: canvas,
    ctx: ctx,
    board: createEmptyBoard(boardWidth, boardHeight),
    currentPiece: null,
    gameRunning: false,
    dropTime: 0,
    lastTime: 0,
    dropInterval: 1000,
    blockSize: blockSize,
    boardWidth: boardWidth,
    boardHeight: boardHeight,
  };

  updateTetrisStats();
  drawTetrisBoard();
  addTetrisListeners();
}

function createEmptyBoard(width, height) {
  const board = [];
  for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
      board[y][x] = 0;
    }
  }
  return board;
}

function drawTetrisBoard() {
  if (!tetrisGame) return;

  const { ctx, canvas, board, blockSize } = tetrisGame;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x <= tetrisGame.boardWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * blockSize, 0);
    ctx.lineTo(x * blockSize, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= board.length; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * blockSize);
    ctx.lineTo(canvas.width, y * blockSize);
    ctx.stroke();
  }

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== 0) {
        drawBlock(x, y, getBlockColor(board[y][x]));
      }
    }
  }

  if (tetrisGame.currentPiece) {
    drawPiece(tetrisGame.currentPiece);
  }

  ctx.strokeStyle = "#9bbc0f";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
}

function drawBlock(x, y, color) {
  if (!tetrisGame) return;

  const { ctx, blockSize } = tetrisGame;
  const padding = Math.max(2, Math.floor(blockSize * 0.08));

  ctx.fillStyle = color;
  ctx.fillRect(
    x * blockSize + padding,
    y * blockSize + padding,
    blockSize - padding * 2,
    blockSize - padding * 2
  );

  if (blockSize > 15) {
    // Hanya tambahkan efek jika blok cukup besar
    const effectSize = Math.max(1, Math.floor(blockSize * 0.1));

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // highlight
    ctx.fillRect(
      x * blockSize + padding,
      y * blockSize + padding,
      blockSize - padding * 2,
      effectSize
    );
    ctx.fillRect(
      x * blockSize + padding,
      y * blockSize + padding,
      effectSize,
      blockSize - padding * 2
    );

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // shadow
    ctx.fillRect(
      x * blockSize + padding,
      y * blockSize + blockSize - padding - effectSize,
      blockSize - padding * 2,
      effectSize
    );
    ctx.fillRect(
      x * blockSize + blockSize - padding - effectSize,
      y * blockSize + padding,
      effectSize,
      blockSize - padding * 2
    );
  }
}

function drawPiece(piece) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        drawBlock(piece.x + x, piece.y + y, getBlockColor(value));
      }
    });
  });
}

function getBlockColor(type) {
  const colors = {
    1: "#ff4757", // Merah (Z)
    2: "#2ed573", // Hijau (S)
    3: "#3742fa", // Biru Tua (J)
    4: "#ff6b35", // Oranye (L)
    5: "#ffa502", // Kuning (O)
    6: "#a55eea", // Ungu (T)
    7: "#26d0ce", // Cyan (I)
  };
  return colors[type] || "#ffffff";
}

function createTetrisPiece() {
  const pieces = [
    // I-piece (Type 7)
    {
      shape: [
        [0, 0, 0, 0],
        [7, 7, 7, 7],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
    // O-piece (Type 5)
    {
      shape: [
        [5, 5],
        [5, 5],
      ],
      x: 4,
      y: 0,
    },
    // T-piece (Type 6)
    {
      shape: [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
    // S-piece (Type 2)
    {
      shape: [
        [0, 2, 2],
        [2, 2, 0],
        [0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
    // Z-piece (Type 1)
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
    // L-piece (Type 4)
    {
      shape: [
        [0, 0, 4],
        [4, 4, 4],
        [0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
    // J-piece (Type 3)
    {
      shape: [
        [3, 0, 0],
        [3, 3, 3],
        [0, 0, 0],
      ],
      x: 3,
      y: 0,
    },
  ];

  return pieces[Math.floor(Math.random() * pieces.length)];
}

function startTetrisGame() {
  if (!tetrisGame) return;

  tetrisGame.gameRunning = true;
  tetrisGame.currentPiece = createTetrisPiece();
  gameScore = 0;
  gameLevel = 1;
  gameLines = 0;
  updateTetrisStats();

  tetrisGameLoop();
}

function tetrisGameLoop(time = 0) {
  if (!tetrisGame || !tetrisGame.gameRunning) return;

  const deltaTime = time - tetrisGame.lastTime;
  tetrisGame.lastTime = time;
  tetrisGame.dropTime += deltaTime;

  if (tetrisGame.dropTime > tetrisGame.dropInterval) {
    moveTetrisPiece("down");
    tetrisGame.dropTime = 0;
  }

  drawTetrisBoard();
  requestAnimationFrame(tetrisGameLoop);
}

function moveTetrisPiece(direction) {
  if (!tetrisGame || !tetrisGame.currentPiece) return;

  const piece = tetrisGame.currentPiece;
  let newX = piece.x;
  let newY = piece.y;

  switch (direction) {
    case "left":
      newX = piece.x - 1;
      break;
    case "right":
      newX = piece.x + 1;
      break;
    case "down":
      newY = piece.y + 1;
      break;
  }

  if (isValidMove(piece.shape, newX, newY)) {
    piece.x = newX;
    piece.y = newY;
  } else if (direction === "down") {
    placePiece();
    clearLines();
    tetrisGame.currentPiece = createTetrisPiece();

    if (
      !isValidMove(
        tetrisGame.currentPiece.shape,
        tetrisGame.currentPiece.x,
        tetrisGame.currentPiece.y
      )
    ) {
      gameOver();
    }
  }
}

function rotateTetrisPiece() {
  if (!tetrisGame || !tetrisGame.currentPiece) return;

  const piece = tetrisGame.currentPiece;
  const rotatedShape = rotateMatrix(piece.shape);

  if (isValidMove(rotatedShape, piece.x, piece.y)) {
    piece.shape = rotatedShape;
  }
}

function isValidMove(shape, x, y) {
  if (!tetrisGame) return false;

  for (let py = 0; py < shape.length; py++) {
    for (let px = 0; px < shape[py].length; px++) {
      if (shape[py][px] !== 0) {
        const newX = x + px;
        const newY = y + py;

        // Check boundaries
        if (
          newX < 0 ||
          newX >= tetrisGame.boardWidth ||
          newY >= tetrisGame.boardHeight
        ) {
          return false;
        }

        // Check collision with placed blocks
        if (
          newY >= 0 &&
          tetrisGame.board[newY] &&
          tetrisGame.board[newY][newX] !== 0
        ) {
          return false;
        }
      }
    }
  }

  return true;
}

function placePiece() {
  if (!tetrisGame || !tetrisGame.currentPiece) return;

  const piece = tetrisGame.currentPiece;

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        if (
          boardY >= 0 &&
          boardY < tetrisGame.board.length &&
          boardX >= 0 &&
          boardX < tetrisGame.boardWidth
        ) {
          tetrisGame.board[boardY][boardX] = value;
        }
      }
    });
  });
}

function clearLines() {
  if (!tetrisGame) return;

  let linesCleared = 0;

  for (let y = tetrisGame.board.length - 1; y >= 0; y--) {
    if (tetrisGame.board[y].every((cell) => cell !== 0)) {
      tetrisGame.board.splice(y, 1);
      tetrisGame.board.unshift(new Array(tetrisGame.boardWidth).fill(0));
      linesCleared++;
      y++; // Check the same line again
    }
  }

  if (linesCleared > 0) {
    gameLines += linesCleared;

    // Scoring system
    const lineScores = [0, 40, 100, 300, 1200];
    gameScore += (lineScores[linesCleared] || 0) * gameLevel;

    // Level progression
    gameLevel = Math.floor(gameLines / 10) + 1;
    tetrisGame.dropInterval = Math.max(50, 1000 - (gameLevel - 1) * 50);

    updateTetrisStats();
  }
}

function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated = [];

  for (let i = 0; i < cols; i++) {
    rotated[i] = [];
    for (let j = 0; j < rows; j++) {
      rotated[i][j] = matrix[rows - 1 - j][i];
    }
  }

  return rotated;
}

function updateTetrisStats() {
  const scoreEl = document.getElementById("score");
  const levelEl = document.getElementById("level");
  const linesEl = document.getElementById("lines");

  if (scoreEl) scoreEl.textContent = gameScore;
  if (levelEl) levelEl.textContent = gameLevel;
  if (linesEl) linesEl.textContent = gameLines;
}

function gameOver() {
  if (tetrisGame) {
    tetrisGame.gameRunning = false;
  }
  document.getElementById("game-over-modal").classList.add("active");
}

function resetTetrisGame() {
  if (tetrisGame) {
    tetrisGame.board = createEmptyBoard(
      tetrisGame.boardWidth,
      tetrisGame.boardHeight
    );
    tetrisGame.currentPiece = null;
    tetrisGame.gameRunning = false;
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;
    updateTetrisStats();
    drawTetrisBoard();
  }
}

// Add window resize handler for responsive canvas
window.addEventListener("resize", function () {
  // Reinitialize Tetris jika layar aktif
  if (currentScreen === "tetris" && tetrisGame) {
    setTimeout(() => {
      const wasRunning = tetrisGame.gameRunning;
      initializeTetris();
      if (wasRunning) {
        // Lanjutkan permainan jika sedang berjalan
        tetrisGame.gameRunning = true;
        tetrisGameLoop();
      }
    }, 100);
  }
});

// Event Listeners
function addEventListeners() {
  // Menu buttons
  const menuButtons = document.querySelectorAll(".menu-btn");
  menuButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = this.getAttribute("data-page");
      if (page) {
        showScreen(page);
      }
    });
  });

  // Back buttons
  const backButtons = document.querySelectorAll(".back-btn");
  backButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = this.getAttribute("data-page");
      if (page) {
        showScreen(page);
      }
    });
  });

  // ********************************************
  // PERBAIKAN: Tombol START (Musik + Navigasi)
  // ********************************************
  // Dalam fungsi addEventListeners()

  // ... (kode tombol START yang sudah diperbaiki)

  // --- UJI COBA: Tombol SELECT untuk memastikan audio berfungsi ---

  // --- AKHIR UJI COBA ---
  const startBtn = document.querySelector(".start-btn");
  if (startBtn) {
    // Pastikan Anda hanya memasang SATU listener di sini
    startBtn.addEventListener("click", function () {
      // 1. Logic Musik
      if (!isMusicPlaying) {
        audio.play().catch((err) => {
          console.error("Audio play error:", err);
        });
        isMusicPlaying = true;
      }

      // 2. Logic Navigasi
      if (currentScreen === "main") {
        showScreen("message");
      }
    });
  }

  // Continue buttons
  const continueButtons = document.querySelectorAll(".continue-btn");
  continueButtons.forEach((button) => {
    button.addEventListener("click", function () {
      handleContinueNavigation();
    });
  });

  // Modal buttons
  const confirmBtn = document.getElementById("confirm-btn");
  const okBtn = document.getElementById("ok-btn");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      document.getElementById("game-over-modal").classList.remove("active");
      document.getElementById("final-message-modal").classList.add("active");
    });
  }

  if (okBtn) {
    okBtn.addEventListener("click", function () {
      document.getElementById("final-message-modal").classList.remove("active");
      showScreen("main");
      resetTetrisGame();
    });
  }

  // Keyboard controls
  document.addEventListener("keydown", function (event) {
    if (currentScreen === "tetris" && tetrisGame && tetrisGame.gameRunning) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          moveTetrisPiece("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          moveTetrisPiece("right");
          break;
        case "ArrowDown":
          event.preventDefault();
          moveTetrisPiece("down");
          break;
        case "ArrowUp":
        case " ":
          event.preventDefault();
          rotateTetrisPiece();
          break;
      }
    }
  });
}

function addTetrisListeners() {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const rotateBtn = document.getElementById("rotate-btn");

  if (leftBtn) {
    leftBtn.addEventListener("click", function () {
      moveTetrisPiece("left");
    });
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", function () {
      moveTetrisPiece("right");
    });
  }

  if (rotateBtn) {
    rotateBtn.addEventListener("click", function () {
      rotateTetrisPiece();
    });
  }
}

function handleContinueNavigation() {
  switch (currentScreen) {
    case "message":
      showScreen("gallery");
      break;
    case "gallery":
      showScreen("music");
      break;
    case "music":
      showScreen("tetris");
      break;
    default:
      showScreen("main");
  }
}

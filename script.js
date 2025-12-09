const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const ROW = 20;
const COL = 10;
const SQ = 30;

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = "black";
    }
}

function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}
drawBoard();

// ---------------------------
// TETROMINO SHAPES
// ---------------------------
const PIECES = [
    [Z, "red"],
    [S, "lime"],
    [T, "purple"],
    [O, "yellow"],
    [L, "orange"],
    [I, "cyan"],
    [J, "blue"]
];

function randomPiece() {
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

function Piece(shape, color) {
    this.shape = shape;
    this.color = color;

    this.activeShape = shape[0];
    this.x = 3;
    this.y = -2;
}

Piece.prototype.draw = function () {
    this.activeShape.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val) drawSquare(this.x + c, this.y + r, this.color);
        });
    });
};

Piece.prototype.unDraw = function () {
    this.activeShape.forEach((row, r) => {
        row.forEach((val, c) => {
            if (val) drawSquare(this.x + c, this.y + r, "black");
        });
    });
};

Piece.prototype.collision = function (dx, dy, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (!shape[r][c]) continue;

            let newX = this.x + c + dx;
            let newY = this.y + r + dy;

            if (newX < 0 || newX >= COL || newY >= ROW) return true;
            if (newY < 0) continue;
            if (board[newY][newX] !== "black") return true;
        }
    }
    return false;
};

Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeShape)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
};

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeShape)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
};

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeShape)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
};

Piece.prototype.rotate = function () {
    let next = this.shape[(this.shape.indexOf(this.activeShape) + 1) % this.shape.length];
    if (!this.collision(0, 0, next)) {
        this.unDraw();
        this.activeShape = next;
        this.draw();
    }
};

Piece.prototype.lock = function () {
    this.activeShape.forEach((row, r) => {
        row.forEach((val, c) => {
            if (!val) return;

            if (this.y + r < 0) {
                alert("Game Over");
                document.location.reload();
            }

            board[this.y + r][this.x + c] = this.color;
        });
    });

    // Remove full rows
    for (let r = 0; r < ROW; r++) {
        let full = board[r].every(cell => cell !== "black");
        if (full) {
            board.splice(r, 1);
            board.unshift(Array(COL).fill("black"));
            score += 10;
            document.getElementById("score").innerText = score;
        }
    }

    drawBoard();
};

// TETROMINO SHAPES DEFINITION
const I = [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
];
const J = [
    [[1,0,0],[1,1,1],[0,0,0]],
    [[0,1,1],[0,1,0],[0,1,0]],
    [[0,0,0],[1,1,1],[0,0,1]],
    [[0,1,0],[0,1,0],[1,1,0]]
];
const L = [
    [[0,0,1],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,0],[0,1,1]],
    [[0,0,0],[1,1,1],[1,0,0]],
    [[1,1,0],[0,1,0],[0,1,0]]
];
const O = [
    [[1,1],[1,1]]
];
const S = [
    [[0,1,1],[1,1,0],[0,0,0]],
    [[0,1,0],[0,1,1],[0,0,1]]
];
const T = [
    [[0,1,0],[1,1,1],[0,0,0]],
    [[0,1,0],[0,1,1],[0,1,0]],
    [[0,0,0],[1,1,1],[0,1,0]],
    [[0,1,0],[1,1,0],[0,1,0]]
];
const Z = [
    [[1,1,0],[0,1,1],[0,0,0]],
    [[0,0,1],[0,1,1],[0,1,0]]
];

// GAME LOOP
let score = 0;
let p = randomPiece();
let game;

document.getElementById("startBtn").onclick = () => {
    if (game) clearInterval(game);
    game = setInterval(() => p.moveDown(), 500);
};

document.addEventListener("keydown", e => {
    if (!game) return;
    if (e.key === "ArrowLeft") p.moveLeft();
    if (e.key === "ArrowRight") p.moveRight();
    if (e.key === "ArrowDown") p.moveDown();
    if (e.key === "ArrowUp") p.rotate();
});

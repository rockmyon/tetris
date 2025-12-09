// script.js 파일의 gameLoop 함수
function gameLoop() {
    dropBlock(); // 0.8초마다 이 함수가 호출되어 블록을 한 칸 내립니다.
}

// script.js 파일의 startGame 함수 (수정/확인)
function startGame() {
    // ... [중략: 초기화 및 보드 리셋 코드] ...
    
    // 1. 게임 상태 활성화
    isPlaying = true;
    score = 0;
    scoreEl.textContent = score;
    gameOverMessage.classList.add('hidden');
    
    // 2. 보드 초기화 및 첫 블록 생성
    if (gameBoardEl.children.length === 0) {
        createGrid();
    } else {
        // 기존 블록 지우기 및 보드 초기화
        for (let r = 0; r < ROWS; r++) {
            board[r].fill(0);
        }
        redrawBoard();
    }
    
    // 첫 블록을 생성하고, 생성에 실패하면 (바로 충돌 시) 게임 오버
    if (!generateBlock()) {
        return; 
    }
    
    // 3. 게임 루프 시작 (핵심: 0.8초마다 블록을 내립니다)
    gameInterval = setInterval(gameLoop, 800); 
    
    // 4. 버튼 텍스트 업데이트
    startButton.textContent = '일시정지';
}

// script.js 파일의 dropBlock 함수 (블록을 실제로 한 칸 내리는 로직)
function dropBlock() {
    if (!isPlaying) return;
    const newPosition = currentPosition + COLS; // 현재 위치에서 한 줄 아래로 이동

    if (!updateBlockPosition(newPosition, currentRotation)) {
        // 이동에 실패하면 (충돌하면)
        lockBlock();   // 블록을 보드에 고정
        clearLines();  // 줄 제거
        generateBlock(); // 새 블록 생성
    }
}

const { useState, useEffect, useRef, useCallback } = React;

// --- SÍNTESIS DE VOZ EN ESPAÑOL ---
function hablar(texto) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-ES';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// --- DATOS DEL CUENTO: LA CAPERUCITA ROJA ---
const TARJETAS_CUENTO = [
  { id: 'caperucita', label: 'Caperucita roja', phrase: 'Caperucita roja', img: 'https://i.pinimg.com/originals/15/3b/ef/153bef0e68858821313046d939879898.png' },
  { id: 'lobo', label: 'Lobo feroz', phrase: 'Lobo feroz', img: 'https://thumbs.dreamstime.com/b/lobo-del-caperucita-rojo-133290514.jpg?w=576' },
  { id: 'abuelita', label: 'Abuelita', phrase: 'Abuelita', img: 'https://i.pinimg.com/736x/ec/d4/15/ecd41592c82c876acde4a13f1cdd9529.jpg' },
  { id: 'cazador', label: 'Cazador', phrase: 'Cazador', img: 'https://th.bing.com/th/id/R.a242839f13b8c4c933dacdc6c93a27d0?rik=mQqfArX3UB4zqQ&riu=http%3a%2f%2frosatubes.r.o.pic.centerblog.net%2f9ffb9949.png&ehk=IuVpWW%2fle2W41u3LcigfQYlHmPLRkaSPseEcpk4hKBY%3d&risl=&pid=ImgRaw&r=0' },
  { id: 'sed', label: 'Tengo sed', phrase: 'Tengo sed, por favor dame agua', svg: 'agua' },
  { id: 'descansar', label: 'Descansar', phrase: 'Necesito descansar', svg: 'descansar' },
  { id: 'familia', label: 'Mi familia', phrase: 'Quiero a mi familia', svg: 'familia' },
  { id: 'hambre', label: 'Tengo hambre', phrase: 'Tengo hambre, quiero comer', svg: 'hambre' },
  { id: 'enojado', label: 'Enojado', phrase: 'Estoy enojado', img: 'https://i.pinimg.com/1200x/f0/6d/94/f06d947e51f04483e0a6aa2f4f8832d6.jpg' },
  { id: 'feliz', label: 'Feliz', phrase: 'Estoy feliz', img: 'https://i.pinimg.com/736x/3d/d6/ee/3dd6ee19c54365815e73cec6aa777249.jpg' },
  { id: 'triste', label: 'Triste', phrase: 'Estoy triste', img: 'https://i.pinimg.com/736x/93/c4/56/93c456d0300ecda60e7d26f2aa37fd71.jpg' },
  { id: 'si', label: 'Sí', phrase: 'Sí', img: 'https://thumbs.dreamstime.com/b/icono-de-marca-verificaci%C3%B3n-blanca-en-bot%C3%B3n-verde-con-marco-blanco-475662500.jpg?w=768' }
];

function SvgIcon({ tipo }) {
  if (tipo === 'agua') {
    return (
      <svg viewBox="0 0 100 100" stroke="#0284c7" strokeWidth="4" fill="none" strokeLinejoin="round">
        <path d="M28 20 L72 20 L62 85 A 4 4 0 0 1 58 89 L42 89 A 4 4 0 0 1 38 85 Z" fill="#e0f2fe" />
        <path d="M33 45 Q 50 40 67 45" stroke="#38bdf8" strokeWidth="3" fill="none" />
      </svg>
    );
  }
  if (tipo === 'descansar') {
    return (
      <svg viewBox="0 0 100 100" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round">
        <rect x="15" y="55" width="70" height="25" rx="4" fill="#cbd5e1" />
        <circle cx="35" cy="45" r="10" fill="#fed7aa" stroke="#ea580c" />
        <path d="M25 55 L75 55 L75 75 L25 75 Z" fill="#93c5fd" />
        <path d="M45 42 Q 60 30 75 42" stroke="#64748b" strokeDasharray="2 3" />
      </svg>
    );
  }
  if (tipo === 'familia') {
    return (
      <svg viewBox="0 0 100 100" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round">
        <circle cx="32" cy="30" r="8" fill="#fed7aa" />
        <path d="M22 65 L22 45 C 22 40 42 40 42 45 L42 65" fill="#86efac" />
        <circle cx="68" cy="32" r="8" fill="#fed7aa" />
        <path d="M58 65 L58 47 C 58 42 78 42 78 47 L78 65" fill="#f472b6" />
        <circle cx="50" cy="54" r="6" fill="#fed7aa" />
        <path d="M44 80 L44 66 C 44 62 56 62 56 66 L56 80" fill="#fde047" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="48" cy="30" r="10" fill="#fed7aa" />
      <path d="M48 42 L48 78" strokeWidth="4" />
      <path d="M48 50 L68 50 L68 44" strokeWidth="3" />
      <circle cx="70" cy="42" r="3" fill="#ea580c" />
      <path d="M40 90 L48 78 L56 90" strokeWidth="4" />
    </svg>
  );
}

// --- UTILIDADES DE AJEDREZ ---
const TABLERO_INICIAL = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const SIMBOLOS_PIEZAS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

const NOMBRES_PIEZAS = {
  'K': 'Rey blanco', 'Q': 'Dama blanca', 'R': 'Torre blanca', 'B': 'Alfil blanco', 'N': 'Caballo blanco', 'P': 'Peón blanco',
  'k': 'Rey negro', 'q': 'Dama negra', 'r': 'Torre negra', 'b': 'Alfil negro', 'n': 'Caballo negro', 'p': 'Peón negro'
};

const COLUMNAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function esBlanca(pieza) {
  return pieza !== '' && pieza === pieza.toUpperCase();
}

function obtenerMovimientosSimples(tablero, r, c) {
  const pieza = tablero[r][c];
  if (!pieza) return [];
  const blanca = esBlanca(pieza);
  const tipo = pieza.toLowerCase();
  const moves = [];

  const agregarSiValido = (nr, nc) => {
    if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return false;
    const destino = tablero[nr][nc];
    if (destino === '') {
      moves.push([nr, nc]);
      return true;
    }
    if (esBlanca(destino) !== blanca) {
      moves.push([nr, nc]);
    }
    return false;
  };

  if (tipo === 'p') {
    const dir = blanca ? -1 : 1;
    const filaInicio = blanca ? 6 : 1;
    if (r + dir >= 0 && r + dir <= 7 && tablero[r + dir][c] === '') {
      moves.push([r + dir, c]);
      if (r === filaInicio && tablero[r + 2 * dir][c] === '') {
        moves.push([r + 2 * dir, c]);
      }
    }
    [-1, 1].forEach(dc => {
      const nr = r + dir, nc = c + dc;
      if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
        const dest = tablero[nr][nc];
        if (dest !== '' && esBlanca(dest) !== blanca) moves.push([nr, nc]);
      }
    });
  } else if (tipo === 'n') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => agregarSiValido(r + dr, c + dc));
  } else if (tipo === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) agregarSiValido(r + dr, c + dc);
      }
    }
  } else {
    const dirs = [];
    if (tipo === 'r' || tipo === 'q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    if (tipo === 'b' || tipo === 'q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    dirs.forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (agregarSiValido(nr, nc)) {
        nr += dr;
        nc += dc;
      }
    });
  }
  return moves;
}

// --- COMPONENTE BOTÓN CON FIJACIÓN DE MIRADA (DWELL-CLICK) ---
function GazeElement({ id, className, onActivate, children, style }) {
  return (
    <div
      data-gaze-id={id}
      className={`gaze-btn ${className || ''}`}
      style={style}
      onClick={onActivate}
    >
      {children}
      <div className="dwell-bar" style={{ width: '0%' }} />
    </div>
  );
}

// --- PANTALLA 1: MENÚ PRINCIPAL ---
function HomeMenu({ onSelectView }) {
  return (
    <div className="home-container">
      <p className="home-subtitle">
        Mantené la mirada (o hacé clic) sobre la actividad que querés iniciar
      </p>
      <div className="menu-cards">
        <GazeElement
          id="menu-cuento"
          className="menu-card"
          onActivate={() => {
            hablar('Abriendo cuento La Caperucita Roja');
            onSelectView('cuento');
          }}
        >
          <div className="menu-icon">📖</div>
          <h2>Cuento: Caperucita Roja</h2>
          <p>Tablero interactivo de comunicación aumentativa con personajes, emociones y voz.</p>
        </GazeElement>

        <GazeElement
          id="menu-ajedrez"
          className="menu-card"
          onActivate={() => {
            hablar('Abriendo tablero de ajedrez asistivo');
            onSelectView('ajedrez');
          }}
        >
          <div className="menu-icon">♟️</div>
          <h2>Aprender Ajedrez</h2>
          <p>Tablero accesible controlado con la mirada para practicar movimientos y piezas.</p>
        </GazeElement>
      </div>
    </div>
  );
}

// --- PANTALLA 2: TABLERO CAPERUCITA ROJA ---
function StoryBoard() {
  return (
    <main className="story-grid">
      {TARJETAS_CUENTO.map((item) => (
        <GazeElement
          key={item.id}
          id={`card-${item.id}`}
          className="story-card"
          onActivate={() => hablar(item.phrase)}
        >
          {item.img ? (
            <img src={item.img} alt={item.label} />
          ) : (
            <SvgIcon tipo={item.svg} />
          )}
          <div className="story-label">{item.label}</div>
        </GazeElement>
      ))}
    </main>
  );
}

// --- PANTALLA 3: AJEDREZ ASISTIVO ---
function ChessGame() {
  const [board, setBoard] = useState(TABLERO_INICIAL.map(row => [...row]));
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState('white');
  const [lastMoveText, setLastMoveText] = useState('Seleccioná una pieza blanca');

  const handleSquareAction = (r, c) => {
    const piece = board[r][c];
    const isMoveValid = validMoves.some(([vr, vc]) => vr === r && vc === c);

    // Si hay una pieza seleccionada y la casilla destino es válida
    if (selected && isMoveValid) {
      const [sr, sc] = selected;
      const movingPiece = board[sr][sc];
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = movingPiece;
      newBoard[sr][sc] = '';

      const coordText = `${COLUMNAS[c]}${8 - r}`;
      const msg = `${NOMBRES_PIEZAS[movingPiece]} a ${coordText}`;
      setBoard(newBoard);
      setSelected(null);
      setValidMoves([]);
      setLastMoveText(msg);
      hablar(msg);

      // Cambio de turno o respuesta automática simple de negras tras 1.2s
      if (turn === 'white') {
        setTurn('black');
        setTimeout(() => {
          hacerMovimientoIA(newBoard);
        }, 1200);
      }
      return;
    }

    // Seleccionar pieza propia
    if (piece !== '' && ((turn === 'white' && esBlanca(piece)) || (turn === 'black' && !esBlanca(piece)))) {
      setSelected([r, c]);
      const moves = obtenerMovimientosSimples(board, r, c);
      setValidMoves(moves);
      const msg = `${NOMBRES_PIEZAS[piece]} seleccionado`;
      setLastMoveText(msg);
      hablar(msg);
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  const hacerMovimientoIA = (currentBoard) => {
    const todosLosMovimientos = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = currentBoard[r][c];
        if (p !== '' && !esBlanca(p)) {
          const moves = obtenerMovimientosSimples(currentBoard, r, c);
          moves.forEach(([nr, nc]) => {
            todosLosMovimientos.push({ from: [r, c], to: [nr, nc], piece: p });
          });
        }
      }
    }
    if (todosLosMovimientos.length > 0) {
      const elegido = todosLosMovimientos[Math.floor(Math.random() * todosLosMovimientos.length)];
      const nextBoard = currentBoard.map(row => [...row]);
      nextBoard[elegido.to[0]][elegido.to[1]] = elegido.piece;
      nextBoard[elegido.from[0]][elegido.from[1]] = '';
      const coordText = `${COLUMNAS[elegido.to[1]]}${8 - elegido.to[0]}`;
      const msg = `Negras mueven ${NOMBRES_PIEZAS[elegido.piece]} a ${coordText}`;
      setBoard(nextBoard);
      setLastMoveText(msg);
      hablar(msg);
    }
    setTurn('white');
  };

  const reiniciarPartida = () => {
    setBoard(TABLERO_INICIAL.map(row => [...row]));
    setSelected(null);
    setValidMoves([]);
    setTurn('white');
    setLastMoveText('Tablero reiniciado. Turno blancas.');
    hablar('Tablero reiniciado');
  };

  return (
    <div className="chess-workspace">
      <div className="chess-board">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            const isSel = selected && selected[0] === r && selected[1] === c;
            const isVal = validMoves.some(([vr, vc]) => vr === r && vc === c);

            return (
              <GazeElement
                key={`${r}-${c}`}
                id={`sq-${r}-${c}`}
                className={`chess-square ${isLight ? 'square-light' : 'square-dark'} ${isSel ? 'square-selected' : ''} ${isVal ? 'square-valid' : ''}`}
                onActivate={() => handleSquareAction(r, c)}
              >
                {piece && (
                  <span className={esBlanca(piece) ? 'piece-white' : 'piece-black'}>
                    {SIMBOLOS_PIEZAS[piece]}
                  </span>
                )}
              </GazeElement>
            );
          })
        )}
      </div>

      <div className="chess-sidebar">
        <h3>Ajedrez Asistivo</h3>
        <div className="turn-indicator">
          {turn === 'white' ? '⚪ Tu turno (Blancas)' : '⚫ Pensando negras...'}
        </div>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', minHeight: '44px' }}>
          {lastMoveText}
        </p>
        <GazeElement
          id="btn-reiniciar-ajedrez"
          className="chess-action-btn"
          onActivate={reiniciarPartida}
        >
          🔄 Reiniciar Partida
        </GazeElement>
      </div>
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL CON RASTREO MEDIAPIPE GLOBAL ---
function App() {
  const [vista, setVista] = useState('inicio'); // 'inicio' | 'cuento' | 'ajedrez'
  const [statusText, setStatusText] = useState('Iniciando cámara...');
  const [trackingActive, setTrackingActive] = useState(false);

  const videoRef = useRef(null);
  const cursorRef = useRef(null);

  // Refs para el motor de dwell-click sin re-renders costosos a 60fps
  const hoveredElRef = useRef(null);
  const dwellStartRef = useRef(null);
  const animFrameRef = useRef(null);

  const DWELL_TIME = 1250; // 1.25 segundos fijando la vista para activar
  const SENSIBILIDAD_X = 5.2;
  const SENSIBILIDAD_Y = 4.8;
  const SUAVIZADO = 0.22;

  useEffect(() => {
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    const resetHover = () => {
      if (hoveredElRef.current) {
        hoveredElRef.current.classList.remove('hovered');
        const bar = hoveredElRef.current.querySelector('.dwell-bar');
        if (bar) bar.style.width = '0%';
      }
      hoveredElRef.current = null;
      dwellStartRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };

    const startDwellLoop = () => {
      const step = (now) => {
        if (!hoveredElRef.current || !dwellStartRef.current) return;
        const elapsed = now - dwellStartRef.current;
        const pct = Math.min((elapsed / DWELL_TIME) * 100, 100);
        const bar = hoveredElRef.current.querySelector('.dwell-bar');
        if (bar) bar.style.width = `${pct}%`;

        if (pct >= 100) {
          const targetToClick = hoveredElRef.current;
          resetHover();
          targetToClick.click();
        } else {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    };

    const updateGazePoint = (x, y) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
        cursorRef.current.style.display = 'block';
      }

      const el = document.elementFromPoint(x, y);
      const gazeTarget = el ? el.closest('.gaze-btn') : null;

      if (gazeTarget !== hoveredElRef.current) {
        resetHover();
        if (gazeTarget) {
          hoveredElRef.current = gazeTarget;
          gazeTarget.classList.add('hovered');
          dwellStartRef.current = performance.now();
          startDwellLoop();
        }
      }
    };

    // Configurar MediaPipe FaceMesh
    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setStatusText('Rastreo activo (Nariz)');
        setTrackingActive(true);

        const nariz = results.multiFaceLandmarks[0][1];
        const normX = 1 - nariz.x;
        const normY = nariz.y;

        const targetX = window.innerWidth / 2 + (normX - 0.5) * SENSIBILIDAD_X * window.innerWidth;
        const targetY = window.innerHeight / 2 + (normY - 0.5) * SENSIBILIDAD_Y * window.innerHeight;

        cursorX += (targetX - cursorX) * SUAVIZADO;
        cursorY += (targetY - cursorY) * SUAVIZADO;

        const finalX = Math.max(0, Math.min(window.innerWidth, cursorX));
        const finalY = Math.max(0, Math.min(window.innerHeight, cursorY));

        updateGazePoint(finalX, finalY);
      } else {
        setStatusText('Buscando rostro...');
        setTrackingActive(false);
        resetHover();
      }
    });

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              await faceMesh.send({ image: videoRef.current });
            },
            width: 640,
            height: 480
          });
          camera.start();
        }
      } catch (e) {
        setStatusText('Error de cámara (revisar permisos)');
      }
    }

    initCamera();
    return () => resetHover();
  }, []);

  return (
    <React.Fragment>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">OCULA — Plataforma Asistiva</h1>
          {vista !== 'inicio' && (
            <GazeElement
              id="btn-volver-inicio"
              className="btn-home"
              onActivate={() => {
                hablar('Volviendo al menú principal');
                setVista('inicio');
              }}
            >
              ⬅ Menú Principal
            </GazeElement>
          )}
        </div>
        <div className={`status-badge ${trackingActive ? 'active' : ''}`}>
          {statusText}
        </div>
      </header>

      {vista === 'inicio' && <HomeMenu onSelectView={setVista} />}
      {vista === 'cuento' && <StoryBoard />}
      {vista === 'ajedrez' && <ChessGame />}

      <div id="gaze-cursor" ref={cursorRef} style={{ display: 'none' }} />
      <video id="camera-preview" ref={videoRef} autoPlay playsInline muted />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

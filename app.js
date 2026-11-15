const { useState, useEffect, useRef } = React;

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

// --- MOTOR DE REGLAS COMPLETAS DE AJEDREZ (JAQUE Y JAQUE MATE) ---
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

const NOTACION_PIEZA = {
  'k': 'R', 'q': 'D', 'r': 'T', 'b': 'A', 'n': 'C', 'p': ''
};

const COLUMNAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

function esBlanca(pieza) {
  return pieza !== '' && pieza === pieza.toUpperCase();
}

function clonarTablero(tablero) {
  return tablero.map(row => [...row]);
}

function encontrarRey(tablero, turnoColor) {
  const reyBuscado = turnoColor === 'white' ? 'K' : 'k';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (tablero[r][c] === reyBuscado) return [r, c];
    }
  }
  return null;
}

// Movimientos pseudo-legales (geometría de cada pieza sin verificar aún si deja al propio rey en jaque)
function obtenerPseudoMovimientos(tablero, r, c) {
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

// Verifica si el rey del color indicado está amenazado (en JAQUE)
function estaEnJaque(tablero, turnoColor) {
  const posRey = encontrarRey(tablero, turnoColor);
  if (!posRey) return true; // Si por alguna razón el rey fue capturado
  const [kr, kc] = posRey;
  const esTurnoBlanco = turnoColor === 'white';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = tablero[r][c];
      if (p !== '' && esBlanca(p) !== esTurnoBlanco) {
        const ataques = obtenerPseudoMovimientos(tablero, r, c);
        if (ataques.some(([ar, ac]) => ar === kr && ac === kc)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Filtra los movimientos estrictamente legales (ningún movimiento puede dejar al propio rey en jaque)
function obtenerMovimientosLegales(tablero, r, c) {
  const pieza = tablero[r][c];
  if (!pieza) return [];
  const color = esBlanca(pieza) ? 'white' : 'black';
  const pseudo = obtenerPseudoMovimientos(tablero, r, c);

  return pseudo.filter(([nr, nc]) => {
    const copia = clonarTablero(tablero);
    copia[nr][nc] = pieza;
    copia[r][c] = '';
    // Promoción automática de peón a dama para simulación exacta
    if (pieza === 'P' && nr === 0) copia[nr][nc] = 'Q';
    if (pieza === 'p' && nr === 7) copia[nr][nc] = 'q';
    return !estaEnJaque(copia, color);
  });
}

// Devuelve todos los movimientos legales posibles para un bando
function obtenerTodosLosLegales(tablero, turnoColor) {
  const esTurnoBlanco = turnoColor === 'white';
  const lista = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = tablero[r][c];
      if (p !== '' && esBlanca(p) === esTurnoBlanco) {
        const legales = obtenerMovimientosLegales(tablero, r, c);
        legales.forEach(([nr, nc]) => {
          lista.push({ from: [r, c], to: [nr, nc], piece: p });
        });
      }
    }
  }
  return lista;
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

// --- PANTALLA 1: MENÚ PRINCIPAL + ACCESO SUPERADMIN ---
function HomeMenu({ onSelectView, isSuperAdmin, onLoginSuccess, onLogout, themeMode, onToggleTheme }) {
  const [userInput, setUserInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === 'admin' && passInput === 'ocula2026') {
      setLoginError('');
      setUserInput('');
      setPassInput('');
      onLoginSuccess();
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="home-split-layout">
      <div className="home-activities-panel">
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
            <p>Tablero accesible controlado con la mirada con alertas de Jaque, Jaque Mate y exportación PDF.</p>
          </GazeElement>
        </div>
      </div>

      <aside className="admin-panel">
        <h3>🔐 Acceso Superadmin</h3>
        {!isSuperAdmin ? (
          <form className="admin-form" onSubmit={handleLoginSubmit}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Iniciá sesión como administrador para habilitar la personalización visual del DOM (Modo Claro / Oscuro).
            </p>
            <input
              type="text"
              className="admin-input"
              placeholder="Usuario (admin)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <input
              type="password"
              className="admin-input"
              placeholder="Contraseña (ocula2026)"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
            />
            {loginError && <p className="admin-error">{loginError}</p>}
            <button type="submit" className="admin-btn">
              Ingresar como Superadmin
            </button>
          </form>
        ) : (
          <div className="admin-form">
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', fontSize: '0.9rem' }}>
              ✅ Sesión activa: <strong>Superadmin</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Control de apariencia global del DOM:
            </p>
            <GazeElement
              id="btn-toggle-theme"
              className="admin-btn"
              onActivate={onToggleTheme}
            >
              {themeMode === 'dark' ? '☀️ Cambiar DOM a Modo Claro' : '🌙 Cambiar DOM a Modo Oscuro'}
            </GazeElement>
            <button type="button" className="admin-btn secondary" onClick={onLogout}>
              Cerrar sesión Superadmin
            </button>
          </div>
        )}
      </aside>
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

// --- PANTALLA 3: AJEDREZ ASISTIVO CON DETECCIÓN DE JAQUE Y JAQUE MATE ---
function ChessGame() {
  const [board, setBoard] = useState(() => clonarTablero(TABLERO_INICIAL));
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState('white');
  const [lastMoveText, setLastMoveText] = useState('Seleccioná una pieza blanca');
  const [moveHistory, setMoveHistory] = useState([]);

  // Estados de Jaque, Jaque Mate y control de fin de partida
  const [gameOver, setGameOver] = useState(false);
  const [checkBanner, setCheckBanner] = useState(null); // Mensaje temporal de "¡JAQUE!"
  const [checkmateBanner, setCheckmateBanner] = useState(null); // Cartel fijo de "¡JAQUE MATE!"
  const [kingInCheckPos, setKingInCheckPos] = useState(null); // [r, c] para iluminar rey en rojo

  // Referencia para cancelar timeouts pendientes de la IA si termina o reinicia la partida
  const aiTimeoutRef = useRef(null);
  const checkBannerTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (checkBannerTimeoutRef.current) clearTimeout(checkBannerTimeoutRef.current);
    };
  }, []);

  const mostrarCartelJaque = (textoDetalle) => {
    if (checkBannerTimeoutRef.current) clearTimeout(checkBannerTimeoutRef.current);
    setCheckBanner(textoDetalle);
    checkBannerTimeoutRef.current = setTimeout(() => {
      setCheckBanner(null);
    }, 2600);
  };

  const registrarMovimiento = (color, piece, fromR, fromC, toR, toC, captured, sufijoEspecial = '') => {
    const origen = `${COLUMNAS[fromC]}${8 - fromR}`;
    const destino = `${COLUMNAS[toC]}${8 - toR}`;
    const letraPieza = NOTACION_PIEZA[piece.toLowerCase()];
    const capturaSimbolo = captured ? 'x' : '-';
    const notacion = `${letraPieza}${origen}${capturaSimbolo}${destino}${sufijoEspecial}`;
    const descripcion = `${NOMBRES_PIEZAS[piece]} (${origen} → ${destino})${captured ? ` captura ${NOMBRES_PIEZAS[captured]}` : ''}`;

    setMoveHistory(prev => [
      ...prev,
      {
        numero: prev.length + 1,
        bando: color === 'white' ? 'Blancas' : 'Negras',
        notacion,
        descripcion,
        hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
  };

  // Evalúa si el bando que recibe el turno quedó en JAQUE, JAQUE MATE o AHOGADO
  const evaluarEstadoPostJugada = (tableroActual, colorQueRecibeTurno) => {
    const enJaque = estaEnJaque(tableroActual, colorQueRecibeTurno);
    const movimientosDisponibles = obtenerTodosLosLegales(tableroActual, colorQueRecibeTurno);

    if (enJaque) {
      const posRey = encontrarRey(tableroActual, colorQueRecibeTurno);
      setKingInCheckPos(posRey);
    } else {
      setKingInCheckPos(null);
    }

    // 1. JAQUE MATE: Está en jaque y no tiene ningún movimiento legal para escapar
    if (enJaque && movimientosDisponibles.length === 0) {
      const ganador = colorQueRecibeTurno === 'white' ? 'Negras' : 'Blancas';
      setGameOver(true);
      setCheckBanner(null);
      setCheckmateBanner({
        titulo: '¡JAQUE MATE!',
        subtitulo: `Partida finalizada — Ganan las ${ganador}`
      });
      setLastMoveText(`¡JAQUE MATE! Ganan las ${ganador}.`);
      hablar(`Jaque mate. Ganan las ${ganador}`);
      return { terminado: true, sufijo: '#' };
    }

    // 2. TABLAS POR AHOGADO: No está en jaque pero no tiene movimientos legales
    if (!enJaque && movimientosDisponibles.length === 0) {
      setGameOver(true);
      setCheckBanner(null);
      setCheckmateBanner({
        titulo: '¡TABLAS POR AHOGADO!',
        subtitulo: 'Partida finalizada — Empate técnico'
      });
      setLastMoveText('Tablas por ahogado.');
      hablar('Tablas por ahogado. Partida finalizada.');
      return { terminado: true, sufijo: '' };
    }

    // 3. JAQUE SIMPLE: Está en jaque pero tiene escapatoria
    if (enJaque) {
      const reyAmenazado = colorQueRecibeTurno === 'white' ? 'Rey Blanco' : 'Rey Negro';
      mostrarCartelJaque(`Amenaza al ${reyAmenazado}`);
      return { terminado: false, sufijo: '+' };
    }

    return { terminado: false, sufijo: '' };
  };

  const handleSquareAction = (r, c) => {
    // Bloquear cualquier interacción sobre el tablero si la partida terminó o es turno de la IA
    if (gameOver || turn !== 'white') return;

    const piece = board[r][c];
    const isMoveValid = validMoves.some(([vr, vc]) => vr === r && vc === c);

    // Ejecutar movimiento de piezas blancas
    if (selected && isMoveValid) {
      const [sr, sc] = selected;
      let movingPiece = board[sr][sc];
      const capturedPiece = board[r][c];

      const newBoard = clonarTablero(board);
      // Promoción automática de peón blanco al llegar a fila 0
      if (movingPiece === 'P' && r === 0) {
        movingPiece = 'Q';
      }
      newBoard[r][c] = movingPiece;
      newBoard[sr][sc] = '';

      const coordText = `${COLUMNAS[c]}${8 - r}`;
      const estado = evaluarEstadoPostJugada(newBoard, 'black');

      registrarMovimiento('white', board[sr][sc], sr, sc, r, c, capturedPiece, estado.sufijo);
      setBoard(newBoard);
      setSelected(null);
      setValidMoves([]);

      // SI ES JAQUE MATE O FIN DE PARTIDA, DETENEMOS AQUÍ Y NO LLAMAMOS A LA IA
      if (estado.terminado) {
        return;
      }

      const msg = estado.sufijo === '+'
        ? `¡Jaque! ${NOMBRES_PIEZAS[movingPiece]} a ${coordText}`
        : `${NOMBRES_PIEZAS[movingPiece]} a ${coordText}`;

      setLastMoveText(msg);
      hablar(msg);

      setTurn('black');
      aiTimeoutRef.current = setTimeout(() => {
        hacerMovimientoIA(newBoard);
      }, 1250);
      return;
    }

    // Seleccionar pieza blanca propia y calcular solo sus movimientos legales
    if (piece !== '' && esBlanca(piece)) {
      setSelected([r, c]);
      const moves = obtenerMovimientosLegales(board, r, c);
      setValidMoves(moves);
      const msg = moves.length > 0
        ? `${NOMBRES_PIEZAS[piece]} seleccionado`
        : `${NOMBRES_PIEZAS[piece]} sin movimientos legales`;
      setLastMoveText(msg);
      hablar(msg);
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  };

  const hacerMovimientoIA = (currentBoard) => {
    // Doble guardia: si la partida ya terminó, la IA no mueve bajo ningún concepto
    if (gameOver) return;

    const todosLosMovimientos = obtenerTodosLosLegales(currentBoard, 'black');

    if (todosLosMovimientos.length === 0) {
      evaluarEstadoPostJugada(currentBoard, 'black');
      return;
    }

    // Priorizar capturas o jaques si existen para hacer la partida más didáctica
    const capturas = todosLosMovimientos.filter(m => currentBoard[m.to[0]][m.to[1]] !== '');
    const pool = capturas.length > 0 && Math.random() < 0.7 ? capturas : todosLosMovimientos;
    const elegido = pool[Math.floor(Math.random() * pool.length)];

    const [fr, fc] = elegido.from;
    const [tr, tc] = elegido.to;
    const capturedPiece = currentBoard[tr][tc];
    let piezaFinal = elegido.piece;

    const nextBoard = clonarTablero(currentBoard);
    if (piezaFinal === 'p' && tr === 7) {
      piezaFinal = 'q';
    }
    nextBoard[tr][tc] = piezaFinal;
    nextBoard[fr][fc] = '';

    const coordText = `${COLUMNAS[tc]}${8 - tr}`;
    const estado = evaluarEstadoPostJugada(nextBoard, 'white');

    registrarMovimiento('black', elegido.piece, fr, fc, tr, tc, capturedPiece, estado.sufijo);
    setBoard(nextBoard);

    if (estado.terminado) {
      return;
    }

    const msg = estado.sufijo === '+'
      ? `¡Jaque! Negras mueven ${NOMBRES_PIEZAS[piezaFinal]} a ${coordText}`
      : `Negras mueven ${NOMBRES_PIEZAS[piezaFinal]} a ${coordText}`;

    setLastMoveText(msg);
    hablar(msg);
    setTurn('white');
  };

  const reiniciarPartida = () => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    if (checkBannerTimeoutRef.current) clearTimeout(checkBannerTimeoutRef.current);

    setBoard(clonarTablero(TABLERO_INICIAL));
    setSelected(null);
    setValidMoves([]);
    setTurn('white');
    setMoveHistory([]);
    setGameOver(false);
    setCheckBanner(null);
    setCheckmateBanner(null);
    setKingInCheckPos(null);
    setLastMoveText('Tablero reiniciado. Turno blancas.');
    hablar('Tablero reiniciado');
  };

  const descargarPDF = () => {
    if (!window.jspdf) {
      alert('La librería PDF aún está cargando. Intentá nuevamente en un segundo.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const horaStr = ahora.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text('OCULA — Registro de Partida de Ajedrez', 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(`Fecha de emisión: ${fechaStr} — Hora: ${horaStr}`, 14, 30);
    doc.text(`Total de jugadas registradas: ${moveHistory.length}`, 14, 36);
    if (checkmateBanner) {
      doc.text(`Resultado: ${checkmateBanner.titulo} (${checkmateBanner.subtitulo})`, 14, 42);
    }

    doc.setDrawColor(148, 163, 184);
    doc.line(14, 47, 196, 47);

    let y = 56;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);

    if (moveHistory.length === 0) {
      doc.text('No se realizaron movimientos en esta partida.', 14, y);
    } else {
      doc.setFont(undefined, 'bold');
      doc.text('N°', 14, y);
      doc.text('Bando', 28, y);
      doc.text('Notación', 55, y);
      doc.text('Detalle del Movimiento', 85, y);
      doc.text('Hora', 175, y);
      doc.setFont(undefined, 'normal');
      y += 8;

      moveHistory.forEach((mov) => {
        if (y > 278) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${mov.numero}.`, 14, y);
        doc.text(mov.bando, 28, y);
        doc.text(mov.notacion, 55, y);
        doc.text(mov.descripcion, 85, y);
        doc.text(mov.hora, 175, y);
        y += 7;
      });
    }

    const nombreArchivo = `partida-ajedrez-ocula-${fechaStr.replace(/\//g, '-')}.pdf`;
    doc.save(nombreArchivo);
    hablar('Descargando registro de partida en PDF');
  };

  return (
    <div className="chess-workspace">
      <div className="chess-board-wrapper">
        <div className="chess-board">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const isLight = (r + c) % 2 === 0;
              const isSel = selected && selected[0] === r && selected[1] === c;
              const isVal = validMoves.some(([vr, vc]) => vr === r && vc === c);
              const isKingDanger = kingInCheckPos && kingInCheckPos[0] === r && kingInCheckPos[1] === c;

              return (
                <GazeElement
                  key={`${r}-${c}`}
                  id={`sq-${r}-${c}`}
                  className={`chess-square ${isLight ? 'square-light' : 'square-dark'} ${isSel ? 'square-selected' : ''} ${isVal ? 'square-valid' : ''} ${isKingDanger ? 'square-king-check' : ''}`}
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

        {/* Cartel temporal de JAQUE */}
        {checkBanner && !checkmateBanner && (
          <div className="chess-banner-overlay banner-check">
            <h2 className="banner-title">⚠️ ¡JAQUE!</h2>
            <p className="banner-subtitle">{checkBanner}</p>
          </div>
        )}

        {/* Cartel definitivo de JAQUE MATE (detiene el juego hasta reiniciar) */}
        {checkmateBanner && (
          <div className="chess-banner-overlay banner-checkmate">
            <h2 className="banner-title">👑 {checkmateBanner.titulo}</h2>
            <p className="banner-subtitle">{checkmateBanner.subtitulo}</p>
            <GazeElement
              id="btn-nueva-partida-banner"
              className="chess-action-btn"
              style={{ marginTop: '8px', minWidth: '220px' }}
              onActivate={reiniciarPartida}
            >
              🔄 Jugar Nueva Partida
            </GazeElement>
          </div>
        )}
      </div>

      <div className="chess-sidebar">
        <h3>Ajedrez Asistivo</h3>
        <div className={`turn-indicator ${gameOver ? 'game-over' : ''}`}>
          {gameOver
            ? '🏁 Partida Finalizada'
            : turn === 'white'
              ? '⚪ Tu turno (Blancas)'
              : '⚫ Pensando negras...'}
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-sub)', minHeight: '36px' }}>
          {lastMoveText}
        </p>

        <div className="moves-log-box">
          <strong>Planilla de movimientos ({moveHistory.length}):</strong>
          {moveHistory.length === 0 ? (
            <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Aún no hay jugadas registradas.
            </p>
          ) : (
            moveHistory.map((m) => (
              <div key={m.numero} className="moves-log-item">
                <strong>#{m.numero}</strong> [{m.bando}] {m.notacion} — {m.descripcion}
              </div>
            ))
          )}
        </div>

        <GazeElement
          id="btn-descargar-pdf"
          className="chess-pdf-btn"
          onActivate={descargarPDF}
        >
          📄 Descargar Partida (PDF)
        </GazeElement>

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
  const [vista, setVista] = useState('inicio');
  const [statusText, setStatusText] = useState('Iniciando cámara...');
  const [trackingActive, setTrackingActive] = useState(false);

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [themeMode, setThemeMode] = useState('dark');

  const videoRef = useRef(null);
  const cursorRef = useRef(null);

  const hoveredElRef = useRef(null);
  const dwellStartRef = useRef(null);
  const animFrameRef = useRef(null);

  const DWELL_TIME = 1250;
  const SENSIBILIDAD_X = 5.2;
  const SENSIBILIDAD_Y = 4.8;
  const SUAVIZADO = 0.22;

  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      hablar(next === 'light' ? 'Modo claro activado' : 'Modo oscuro activado');
      return next;
    });
  };

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

      {vista === 'inicio' && (
        <HomeMenu
          onSelectView={setVista}
          isSuperAdmin={isSuperAdmin}
          onLoginSuccess={() => setIsSuperAdmin(true)}
          onLogout={() => {
            setIsSuperAdmin(false);
            setThemeMode('dark');
          }}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />
      )}
      {vista === 'cuento' && <StoryBoard />}
      {vista === 'ajedrez' && <ChessGame />}

      <div id="gaze-cursor" ref={cursorRef} style={{ display: 'none' }} />
      <video id="camera-preview" ref={videoRef} autoPlay playsInline muted />
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

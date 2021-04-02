//DIFICULTAD DEL JUEGO
// const DIFICULTAD = {
//   facil: 1,
//   medio: 1,
//   dificil: 1,
// };
//Tamaño canvas
let ANCHO = window.innerWidth - 32;
let ALTO = window.innerHeight - 82;
-100;
//Tamaño del bicho
let PESO = 5;
//Velocidad de movimiento de bicho
let VELOCIDAD = 6;
//Intevalo del loop
let INTERVALO = 50;
//Crecimiento de bicho
let CRECIMIENTO = 5;
//Configuracion de direcciones
const DIRECCION = {
  KeyS: [0, 1],
  KeyW: [0, -1],
  KeyD: [1, 0],
  KeyA: [-1, 0],

  ArrowDown: [0, 1],
  ArrowUp: [0, -1],
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
};

let score = 0;
//Controles y seteos de direccion y de bicho
let controles = {
  direccion: { x: 1, y: 0 },
  bicho: [{ x: 0, y: 0 }],
  comida: { x: 0, y: 250 },
  crecimiento: 0,
  jugando: false,
};
//Var con direccion actual
let padonde;
//referencio el canvas a JS
let papel = document.querySelector("canvas");
//Referio al contexto del canvas
let ctx = papel.getContext("2d");
//Defino el tamaño del canvas
papel.width = ANCHO;
papel.height = ALTO;

let scoreSpan = document.querySelector(".menu__score");
let pantalla = document.querySelector(".pantalla");
let controlesSection = document.querySelector(".controles");
let btnPlay = document.querySelector(".pantalla__btnPlay");
let btnStart = document.querySelector(".controles__start");
let btnLeft = document.querySelector(".controles__btnLeft");
let btnDown = document.querySelector(".controles__btnDown");
let btnUp = document.querySelector(".controles__btnUp");
let btnRight = document.querySelector(".controles__btnRight");

pantalla.style.width = `${ANCHO + 2}px`;
pantalla.style.height = `${ALTO + 2}px`;

btnPlay.addEventListener("click", () => {
  reiniciar();
});
btnStart.addEventListener("click", () => {
  reiniciar();
});
btnUp.addEventListener("click", () => {
  cambiarDireccion("KeyW");
});
btnLeft.addEventListener("click", () => {
  cambiarDireccion("KeyA");
});
btnDown.addEventListener("click", () => {
  cambiarDireccion("KeyS");
});
btnRight.addEventListener("click", () => {
  cambiarDireccion("KeyD");
});
let looper = () => {
  let cola = {};
  //referencio la cabeza del bicho
  const sq = controles.bicho[0];

  // clonar el ultimo obj del bicho en cola
  Object.assign(cola, controles.bicho[controles.bicho.length - 1]);
  //Verifico que bicho haya atrapado a la comida
  let atrapado = sq.x === controles.comida.x && sq.y === controles.comida.y;

  //detecto si en esta vuelta del loop choco
  if (detectarChoque()) {
    controles.jugando = false;

    pantalla.style.display = "flex";
    //llamo a reiniciar parametros
    // reiniciar();
  }
  //Referencio la direccion actual
  let dx = controles.direccion.x;
  let dy = controles.direccion.y;

  //Guardo el tama;o del bicho
  let tamaño = controles.bicho.length - 1;

  //Si el juego esta corriendo
  if (controles.jugando) {
    score += CRECIMIENTO;
    //Recorro las partes del bicho de atras a adelante
    for (let idx = tamaño; idx > -1; idx--) {
      //referencio desde la ultima posicion
      const sq = controles.bicho[idx];
      if (idx == 0) {
        //cabeza
        //Le sumo la direccion a su posicion
        sq.x += dx;
        sq.y += dy;
      } else {
        //cuerpo
        //le doy la posicion del elemento anterior
        sq.x = controles.bicho[idx - 1].x;
        sq.y = controles.bicho[idx - 1].y;
      }
    }
  }
  //verifico si atrape comida
  if (atrapado) {
    controles.crecimiento += CRECIMIENTO;
    score += INTERVALO * CRECIMIENTO;
    INTERVALO -= 2;
    CRECIMIENTO += 1;
    recomida();
  }
  // Pregunto si tengo que crecer
  if (controles.crecimiento > 0) {
    // Agrego a mi bicho el clon de cola creado antes
    controles.bicho.push(cola);
    controles.crecimiento--;
  }
  //Llamo a la animacion a dibujar
  requestAnimationFrame(dibujar);
  scoreSpan.innerHTML = score;

  //Llamo a la funcion luego de X intervalo
  setTimeout(looper, INTERVALO);
};
document.onkeydown = (e) => {
  if (e.code === "Space" || e.code === "NumpadEnter" || e.code === "Enter") {
    if (!controles.jugando) reiniciar();
  } else {
    cambiarDireccion(e.code);
  }
};

let cambiarDireccion = (dir) => {
  let direccion = Object.values(DIRECCION);
  padonde = DIRECCION[dir];
  if (direccion.includes(padonde)) {
    // Deconstruyo x e y de padonde
    const [x, y] = padonde;
    // Valido  que no cambie a la direccion contraria
    if (-x !== controles.direccion.x && -y !== controles.direccion.y) {
      controles.direccion.x = x;
      controles.direccion.y = y;
    }
  }
};
// Detecta choques contra paredes o si misma
let detectarChoque = () => {
  const head = controles.bicho[0];
  // Pregunto si salio fuera del papel
  if (
    head.x <= 0 ||
    head.x >= ANCHO / VELOCIDAD - 1 ||
    head.y <= 0 ||
    head.y >= ALTO / VELOCIDAD - 1
  ) {
    return true;
  }
  // Pregunto si la cabeza esta en alguna posicion del cuerpo
  for (let idx = 1; idx < controles.bicho.length; idx++) {
    const sq = controles.bicho[idx];
    if (sq.x == head.x && sq.y == head.y) {
      return true;
    }
  }
};

let dibujar = (color) => {
  //Limpia el canvas
  ctx.clearRect(0, 0, ANCHO, ALTO);

  ctx.fillStyle = "white";
  ctx.fillRect(
    controles.bicho[0] * VELOCIDAD,
    controles.bicho[0] * VELOCIDAD,
    PESO / 10,
    PESO / 10
  );

  // Recorro el bicho
  for (let idx = 0; idx < controles.bicho.length; idx++) {
    const { x, y } = controles.bicho[idx];
    // Dibujo cada parte del cuerpo
    dibujarActores("green", x, y);
  }

  //instancio comida
  const comida = controles.comida;
  dibujarActores("white", comida.x, comida.y);
};

let dibujarActores = (color, x, y) => {
  ctx.fillStyle = color;
  //Creo un rectangulo en el contexto
  ctx.fillRect(x * VELOCIDAD, y * VELOCIDAD, PESO, PESO);
};

let cualquierLado = (lejos) => {
  let direccion = Object.values(DIRECCION);
  return {
    x: parseInt((Math.random() * (ANCHO - 20 * lejos)) / VELOCIDAD + lejos),
    y: parseInt((Math.random() * (ALTO - 20 * lejos)) / VELOCIDAD + lejos),
    p: direccion[parseInt(Math.random() * 8)],

    //TODO validar direccion cerca del borde
    //TODO dejar menos margen
  };
};

let recomida = () => {
  comidaCualquiera = cualquierLado(0);

  //validar que no este sobre el bicho
  for (let idx = 0; idx < controles.bicho.length; idx++) {
    const sq = controles.bicho[idx];
    // si esta sobre bicho, se vuelve a buscar valor
    if (sq.x == comidaCualquiera.x && sq.y == comidaCualquiera.y) {
      recomida();
    }
  }

  controles.comida.x = comidaCualquiera.x;
  controles.comida.y = comidaCualquiera.y;
};

let reiniciar = () => {
  controles = {
    direccion: { x: 1, y: 0 },
    bicho: [{ x: 0, y: 0 }],
    comida: { x: 0, y: 250 },
    crecimiento: 0,
    jugando: false,
  };

  const cualquiera = cualquierLado(12);
  controles.bicho[0].x = cualquiera.x;
  controles.bicho[0].y = cualquiera.y;
  controles.direccion.x = cualquiera.p[0];
  controles.direccion.y = cualquiera.p[1];
  comidaCualquiera = cualquierLado(0);

  controles.comida.x = comidaCualquiera.x;
  controles.comida.y = comidaCualquiera.y;
  pantalla.style.display = "none";
  score = 0;
  INTERVALO = 50;
  CRECIMIENTO = 5;
  scoreSpan.innerHTML = score;
  controles.jugando = true;
};
//Cuand el documento carga llamo a looper
window.onload = () => {
  reiniciar();
  looper();
};

// Media Queries para cambio layout
var mql = window.matchMedia("(min-width: 1024px)");

function screenTest(e) {
  if (e.matches) {
    /* Para desktop */
    controlesSection.style.display = "none";
    ANCHO = window.innerWidth - 32;
    ALTO = window.innerHeight - 82;
    VELOCIDAD = 11;
    PESO = 10;
    papel.width = ANCHO;
    papel.height = ALTO;
    pantalla.style.width = `${ANCHO + 2}px`;
    pantalla.style.height = `${ALTO + 2}px`;
  } else {
    /* Para mobile */
    ANCHO = window.innerWidth - 32;
    ALTO = (window.innerHeight - 102) * 0.7;
    VELOCIDAD = 6;
    PESO = 5;
    controlesSection.style.display = "flex";
    controlesSection.style.top = `${ALTO}px`;
    controlesSection.style.height = `${(ALTO * 30) / 70}px`;
    papel.width = ANCHO;
    papel.height = ALTO;
    pantalla.style.width = `${ANCHO + 2}px`;
    pantalla.style.height = `${ALTO + 2}px`;
  }
}
mql.addListener(screenTest);
screenTest(mql);

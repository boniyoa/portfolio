// ===== BANNER DE CLIENTES =====
// Franja fija abajo con los logos de las empresas con las que he trabajado.
// Los logos se muestran por grupos y cada 30 segundos se funden al grupo siguiente.
//
// El grupo visible se calcula con el reloj del ordenador (Date.now), no con el
// tiempo que llevas en la página: así, al cambiar de página, el banner sigue
// por donde iba en vez de volver a empezar.
//
// Para añadir o quitar un cliente, basta con tocar la lista CLIENTES.

(function () {
  // Carga sus propios estilos (banner-clientes.css, en la misma carpeta que este script),
  // así el banner funciona igual en todas las páginas, carguen o no style.css
  const estilos = document.createElement("link");
  estilos.rel = "stylesheet";
  estilos.href = new URL("banner-clientes.css", document.currentScript.src).href;
  document.head.appendChild(estilos);

  const CLIENTES = [
    ["square-one", "Square One Media"],
    ["mediapro", "Grup Mediapro"],
    ["videoreport", "Videoreport"],
    ["tres60", "Tres60"],
    ["enubes", "eNubes"],
    ["el-economista", "El Economista"],
    ["iberdrola", "Iberdrola"],
    ["prg", "PRG"],
    ["cifras-y-letras", "Cifras y Letras"],
    ["averal", "Averal"],
    ["telemadrid", "Telemadrid"],
    ["bbva", "BBVA"],
    ["mutua-madrid-open", "Mutua Madrid Open"],
    ["agora-news", "Agora News"],
    ["rtve", "RTVE"],
    ["stream-media-event", "Stream Media Event"],
    ["eikonos", "Eikonos"],
  ];
  const INTERVALO = 30000; // 30 segundos entre grupo y grupo
  const FUNDIDO = 600; // duración del fundido, en milisegundos

  // Datos de contacto fijos a los lados del banner
  const TELEFONO = "+34660222932"; // así, sin espacios, para el enlace "tel:"
  const TELEFONO_VISIBLE = "+34 660 222 932";
  const EMAIL = "borja.letpro@gmail.com";

  // Iconos dibujados en SVG (no necesitan archivos aparte)
  const ICONO_TELEFONO =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  const ICONO_EMAIL =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>';

  // Crea la franja: [teléfono] [logos que cambian] [email]
  const banner = document.createElement("div");
  banner.className = "banner-clientes";
  banner.setAttribute("aria-label", "Contacto y empresas con las que he trabajado");
  banner.innerHTML = `
    <a class="banner-clientes__contacto" href="tel:${TELEFONO}">${ICONO_TELEFONO}<span>${TELEFONO_VISIBLE}</span></a>
    <div class="banner-clientes__grupo"></div>
    <a class="banner-clientes__contacto" href="mailto:${EMAIL}">${ICONO_EMAIL}<span>${EMAIL}</span></a>
  `;
  document.body.appendChild(banner);
  const grupo = banner.querySelector(".banner-clientes__grupo");

  // Cuántos logos caben a la vez según el ancho de la pantalla
  function logosPorGrupo() {
    // (a los lados van el teléfono y el email, que también ocupan sitio)
    const ancho = window.innerWidth;
    if (ancho >= 1500) return 6;
    if (ancho >= 1200) return 5;
    if (ancho >= 900) return 4;
    if (ancho >= 500) return 3;
    return 2;
  }

  // Reparte los clientes en grupos de tamaño parecido
  // (17 logos de 4 en 4 dan 4-4-3-3-3, y no 4-4-4-4-1 con un logo solo)
  function hacerGrupos() {
    const numGrupos = Math.ceil(CLIENTES.length / logosPorGrupo());
    const grupos = [];
    for (let i = 0; i < numGrupos; i++) {
      const inicio = Math.round((i * CLIENTES.length) / numGrupos);
      const fin = Math.round(((i + 1) * CLIENTES.length) / numGrupos);
      grupos.push(CLIENTES.slice(inicio, fin));
    }
    return grupos;
  }

  let claveMostrada = "";

  function pintar() {
    const grupos = hacerGrupos();
    const indice = Math.floor(Date.now() / INTERVALO) % grupos.length;
    const clave = grupos.length + "-" + indice;
    if (clave === claveMostrada) return; // ya se está viendo ese grupo
    const esPrimeraVez = claveMostrada === "";
    claveMostrada = clave;

    const cambiarLogos = () => {
      grupo.innerHTML = grupos[indice]
        .map(([archivo, nombre]) => `<img src="gaveta/clientes/${archivo}.webp" alt="${nombre}" title="${nombre}" />`)
        .join("");
      grupo.style.opacity = 1;
    };

    if (esPrimeraVez) {
      cambiarLogos();
    } else {
      grupo.style.opacity = 0; // se funde a blanco...
      setTimeout(cambiarLogos, FUNDIDO); // ...cambia los logos y vuelve a aparecer
    }
  }

  // Programa cada cambio justo cuando el reloj cruza el siguiente múltiplo de 30 s
  function programarSiguiente() {
    const espera = INTERVALO - (Date.now() % INTERVALO);
    setTimeout(() => {
      pintar();
      programarSiguiente();
    }, espera + 50);
  }

  pintar();
  programarSiguiente();
  // Si cambia el ancho de la ventana, se recalculan los grupos
  window.addEventListener("resize", pintar);
})();

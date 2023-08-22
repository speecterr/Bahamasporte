function loadImage() {
  const fileInput = document.getElementById("imageUpload");
  const uploadedImg = document.getElementById("uploadedImage");

  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      uploadedImg.src = e.target.result;
    };

    reader.onloadend = function () {
      uploadedImg.style.display = "block";
    };

    reader.readAsDataURL(file);
  }
}

// Função para a imagem carregada
interact(".uploaded")
  .draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictEdges({
        outer: ".carteira-container",
      }),
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    autoScroll: true,
    listeners: {
      move(event) {
        let x =
          (parseFloat(event.target.getAttribute("data-x")) || 0) + event.dx;
        let y =
          (parseFloat(event.target.getAttribute("data-y")) || 0) + event.dy;

        event.target.style.transform = `translate(${x}px, ${y}px)`;
        event.target.setAttribute("data-x", x);
        event.target.setAttribute("data-y", y);
      },
    },
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    modifiers: [
      interact.modifiers.restrictEdges({
        outer: ".carteira-container",
      }),
    ],
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`,
        });

        Object.assign(event.target.dataset, x, y);
      },
    },
  });

let textCounter = 0;

function fixText() {
  const textInput = document.getElementById("textInput");
  const carteiraContainer = document.querySelector(".carteira-container");

  const newTextElement = document.createElement("span");
  newTextElement.innerText = textInput.value;
  newTextElement.className = "movable-text";
  newTextElement.id = "movableText" + textCounter++;

  carteiraContainer.appendChild(newTextElement);

  // tornando o texto recém-criado móvel
  makeTextMovable(newTextElement);

  // limpando o input para uma nova entrada
  textInput.value = "";
}

function makeTextMovable(textElement) {
  interact(textElement).draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true,
      }),
    ],
    autoScroll: true,
    listeners: {
      move(event) {
        let x =
          (parseFloat(event.target.getAttribute("data-x")) || 0) + event.dx;
        let y =
          (parseFloat(event.target.getAttribute("data-y")) || 0) + event.dy;

        event.target.style.transform = `translate(${x}px, ${y}px)`;

        event.target.setAttribute("data-x", x);
        event.target.setAttribute("data-y", y);
      },
    },
  });
}

function clearAll() {
  console.log("Função clearAll chamada"); // Isso é apenas para fins de depuração

  // Limpar a imagem carregada
  const uploadedImg = document.getElementById("uploadedImage");
  uploadedImg.src = "#";
  uploadedImg.style.display = "none";
  uploadedImg.removeAttribute("data-x");
  uploadedImg.removeAttribute("data-y");

  // Limpar todos os textos
  const allMovableTexts = document.querySelectorAll(".movable-text");
  allMovableTexts.forEach((textElement) => {
    textElement.remove();
  });

  // Limpar o campo de entrada de texto
  const textInput = document.getElementById("textInput");
  textInput.value = "";

  // Limpar o campo de entrada de arquivo
  const fileInput = document.getElementById("imageUpload");
  fileInput.value = "";
}

function downloadImage() {
  const carteiraContainer = document.querySelector(".carteira-container");

  html2canvas(carteiraContainer).then((canvas) => {
    let link = document.createElement("a");
    link.download = "carteira.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

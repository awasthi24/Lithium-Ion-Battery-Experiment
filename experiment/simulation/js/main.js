//Your JavaScript goes in here
const electrolyteBtn = document.getElementById("electrolyte-btn");
const electrolytePopover = document.getElementById("electrolyte-popover");
const instructionsSpan = document.getElementById("instructions");
const beakerElectrolyte = document.getElementById('electrolyte-liquid');
electrolyteBtn.addEventListener("mouseenter", () => {
  electrolytePopover.style.display = "block";
});
electrolyteBtn.addEventListener("mouseleave", () => {
  electrolytePopover.style.display = "none";
});
electrolyteBtn.addEventListener("focus", () => {
  electrolytePopover.style.display = "block";
});
electrolyteBtn.addEventListener("blur", () => {
  electrolytePopover.style.display = "none";
});
// --- Separator logic ---
const separatorBtn = document.getElementById("separator-btn");
const separatorHighlight = document.getElementById("separator-highlight");
const separatorGroup = document.getElementById("separator-group");
// --- Anode logic ---
const anodeBtn = document.getElementById("anode-btn");
const anodePopover = document.getElementById("anode-popover");
const anodeHighlight = document.getElementById("anode-highlight");
const anodeGroup = document.getElementById("anode-group");
// --- Cathode logic ---
const cathodeBtn = document.getElementById("cathode-btn");
const cathodePopover = document.getElementById("cathode-popover");
const cathodeHighlight = document.getElementById("cathode-highlight");
const cathodeGroup = document.getElementById("cathode-group");
// --- Connector logic ---
const connectorBtn = document.getElementById("connector-btn");
const connectorPopover = document.getElementById("connector-popover");
const connectorHighlight = document.getElementById("connector-highlight");
const bulbHighlight = document.getElementById("bulb-highlight");
const connectorGroup = document.getElementById("connectorGroup");
const switchOnBtn = document.getElementById("switch-on-btn");
// --- Drag-and-drop logic with animated electrolyte fill ---
const electrodes = document.getElementById('electrodes');
const liIonsGroup = document.getElementById('li-ions');
const labelsGroup = document.getElementById('labels-group');
const diagramLabels = document.getElementById('diagram-labels');
const pageTitle = document.getElementById('page-title');
const chargingScreen = document.getElementById('charging-screen');
let placed = { electrolyte: false, separator: false, anode: false, cathode: false, connector: false };
let current = "electrolyte";
let draggingSeparator = false;
let draggingAnode = false;
let draggingCathode = false;
let draggingConnector = false;
let bulbGlowing = false;

function showGhost(comp) {
  separatorHighlight.style.display = comp === "separator" ? "block" : "none";
  anodeHighlight.style.display = comp === "anode" ? "block" : "none";
  cathodeHighlight.style.display = comp === "cathode" ? "block" : "none";
  if (comp === "connector") {
    connectorHighlight.style.display = "";
    bulbHighlight.style.display = "";
  } else {
    connectorHighlight.style.display = "none";
    bulbHighlight.style.display = "none";
  }
}
function hideGhosts() {
  separatorHighlight.style.display = "none";
  anodeHighlight.style.display = "none";
  cathodeHighlight.style.display = "none";
  connectorHighlight.style.display = "none";
  bulbHighlight.style.display = "none";
}
const dropZones = {
  electrolyte: { x: 48, y: 85, width: 876, height: 170 },
  separator: { x: 480, y: 85, width: 24, height: 170 },
  anode: { x: 120, y: 85, width: 48, height: 170 },
  cathode: { x: 812, y: 85, width: 48, height: 170 },
  connector: { x: 160, y: 30, width: 670, height: 60 }
};
let draggedComponent = null;
anodeBtn.addEventListener("mouseenter", () => { anodePopover.style.display = "block"; });
anodeBtn.addEventListener("mouseleave", () => { anodePopover.style.display = "none"; });
anodeBtn.addEventListener("focus", () => { anodePopover.style.display = "block"; });
anodeBtn.addEventListener("blur", () => { anodePopover.style.display = "none"; });
cathodeBtn.addEventListener("mouseenter", () => { cathodePopover.style.display = "block"; });
cathodeBtn.addEventListener("mouseleave", () => { cathodePopover.style.display = "none"; });
cathodeBtn.addEventListener("focus", () => { cathodePopover.style.display = "block"; });
cathodeBtn.addEventListener("blur", () => { cathodePopover.style.display = "none"; });
connectorBtn.addEventListener("mouseenter", () => { connectorPopover.style.display = "block"; });
connectorBtn.addEventListener("mouseleave", () => { connectorPopover.style.display = "none"; });
connectorBtn.addEventListener("focus", () => { connectorPopover.style.display = "block"; });
connectorBtn.addEventListener("blur", () => { connectorPopover.style.display = "none"; });
function setInstruction(msg) {
  instructionsSpan.textContent = msg;
}
function animateElectrolyteFill(callback) {
  const startY = 255;
  const endY = 85;
  const height = 170;
  beakerElectrolyte.setAttribute('y', startY);
  beakerElectrolyte.setAttribute('height', 0);
  beakerElectrolyte.style.display = "";
  let frame = 0;
  const totalFrames = 32;
  function animate() {
    frame++;
    let progress = frame / totalFrames;
    if (progress > 1) progress = 1;
    let currentH = height * progress;
    let currentY = startY - currentH;
    beakerElectrolyte.setAttribute('y', currentY);
    beakerElectrolyte.setAttribute('height', currentH);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      beakerElectrolyte.setAttribute('y', endY);
      beakerElectrolyte.setAttribute('height', height);
      if (typeof callback === "function") callback();
    }
  }
  animate();
}
function drawSeparator() {
  let dots = "";
  const x = 492;
  const width = 8;
  for (let i = 0; i < 13; ++i) {
    let cy = 95 + i * 12;
    let r = 2 + 0.3 * Math.sin(i*2);
    let offset = ((i % 2) === 0) ? -2 : 2;
    let cx = x + width/2 + offset;
    dots += `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
  }
  separatorGroup.innerHTML = `
    <rect id="svg-separator-strip" x="488" y="85" width="16" height="170" rx="4"/>
    <g class="svg-separator-dots">${dots}</g>
  `;
}
function drawAnode() {
  let face = `<rect class="svg-anode-cuboid-face" x="144" y="85" width="40" height="170"/>`;
  let side = `<polygon class="svg-anode-cuboid-side" points="184,85 200,100 200,255 184,255"/>`;
  let top = `<polygon class="svg-anode-cuboid-top" points="144,85 184,85 200,100 160,100"/>`;
  anodeGroup.innerHTML = top + face + side;
}
function drawCathode() {
  let face = `<rect class="svg-cathode-cuboid-face" x="812" y="85" width="48" height="170"/>`;
  let side = `<polygon class="svg-cathode-cuboid-side" points="860,85 876,100 876,255 860,255"/>`;
  let top = `<polygon class="svg-cathode-cuboid-top" points="812,85 860,85 876,100 828,100"/>`;
  cathodeGroup.innerHTML = top + face + side;
}
function drawConnector(glow) {
  let wire = `<polyline class="svg-connector-wire" points="164,85 164,38 490,38 812,38 812,85"/>`;
  let bulbClass = glow ? "svg-bulb on" : "svg-bulb";
  let bulb = `<ellipse class="${bulbClass}" id="svg-bulb" cx="490" cy="38" rx="18" ry="13"/>`;
  let bulbBase = `<rect x="480" y="50" width="20" height="6" rx="2" fill="#ccc" stroke="#bbb" stroke-width="2"/>`;
  let filament = `<polyline points="485,56 490,52 495,56" fill="none" stroke="#bcb77e" stroke-width="2"/>`;
  connectorGroup.innerHTML = wire + bulb + bulbBase + filament;
}
function drawDiagramLabels() {
  diagramLabels.innerHTML = "";
  const labels = [
    { t: "Anode", x1: 135, y1: 190, x2: 144, y2: 170, bx: 65, by: 170, bw: 60, bh: 24, anchor: "middle" },
    { t: "Cathode", x1: 910, y1: 170, x2: 876, y2: 170, bx: 920, by: 160, bw: 60, bh: 24, anchor: "middle" },
    { t: "Electrolyte", x1: 520, y1: 230, x2: 530, y2: 200, bx: 500, by: 242, bw: 90, bh: 24, anchor: "middle" },
    { t: "Separator", x1: 512, y1: 115, x2: 575, y2: 110, bx: 577, by: 100, bw: 100, bh: 24, anchor: "middle" },
    { t: "Connecting wire", x1: 164, y1: 38, x2: 164, y2: 8, bx: 64, by: 0, bw: 150, bh: 24, anchor: "middle" },
    { t: "Load", x1: 490, y1: 8, x2: 490, y2: -12, bx: 460, by: -28, bw: 60, bh: 24, anchor: "middle" }
  ];
  for (const lbl of labels) {
    diagramLabels.innerHTML += `
      <rect class="diagram-label-box" x="${lbl.bx}" y="${lbl.by}" width="${lbl.bw}" height="${lbl.bh}"/>
    `;
    diagramLabels.innerHTML += `
      <line class="diagram-pointer" x1="${lbl.x1}" y1="${lbl.y1}" x2="${lbl.x2}" y2="${lbl.y2}"/>
    `;
    diagramLabels.innerHTML += `
      <text class="diagram-label" x="${lbl.bx + lbl.bw / 2}" y="${lbl.by + lbl.bh / 2 + 1}" text-anchor="${lbl.anchor}" alignment-baseline="middle">${lbl.t}</text>
    `;
  }
}
function placeElectrode(comp) {
  if (placed[comp]) return;
  placed[comp] = true;
  hideGhosts();
  if (comp === "electrolyte") {
    animateElectrolyteFill(() => {
      setInstruction("Select and drag the separator to its location");
      current = "separator";
    });
  } else if (comp === "separator") {
    drawSeparator();
    setInstruction("Select and drag the Anode to its location");
    current = "anode";
  } else if (comp === "anode") {
    drawAnode();
    setInstruction("Select and drag cathode to its location");
    current = "cathode";
  } else if (comp === "cathode") {
    drawCathode();
    setInstruction("Select connector and drag it to its location");
    current = "connector";
  } else if (comp === "connector") {
    drawConnector(false);
    setInstruction("Congratulations ! Your battery is ready to use ");
    switchOnBtn.style.display = "";
    current = null;
    drawDiagramLabels();
  }
}
document.querySelectorAll(".component-btn[draggable=true]").forEach(btn => {
  const comp = btn.getAttribute("data-component");
  btn.addEventListener("dragstart", e => {
    if (placed[comp] || current !== comp) {
      e.preventDefault();
      return;
    }
    draggedComponent = comp;
    showGhost(comp);
    if(comp === "separator") draggingSeparator = true;
    if(comp === "anode") draggingAnode = true;
    if(comp === "cathode") draggingCathode = true;
    if(comp === "connector") draggingConnector = true;
  });
  btn.addEventListener("touchstart", e => {
    if (placed[comp] || current !== comp) {
      e.preventDefault();
      return;
    }
    draggedComponent = comp;
    showGhost(comp);
    if(comp === "separator") draggingSeparator = true;
    if(comp === "anode") draggingAnode = true;
    if(comp === "cathode") draggingCathode = true;
    if(comp === "connector") draggingConnector = true;
  }, {passive:false});
  btn.addEventListener("dragend", () => {
    draggedComponent = null;
    draggingSeparator = false;
    draggingAnode = false;
    draggingCathode = false;
    draggingConnector = false;
    hideGhosts();
  });
  btn.addEventListener("touchend", () => {
    draggedComponent = null;
    draggingSeparator = false;
    draggingAnode = false;
    draggingCathode = false;
    draggingConnector = false;
    hideGhosts();
  });
});
const beakerSVG = document.getElementById("beaker-svg");
beakerSVG.addEventListener("dragover", e => {
  e.preventDefault();
  if (draggedComponent === current) showGhost(current);
  if(current === "separator" && draggingSeparator) {
    const rect = beakerSVG.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dz = dropZones.separator;
    if (
      mouseX >= dz.x && mouseX <= dz.x + dz.width &&
      mouseY >= dz.y && mouseY <= dz.y + dz.height
    ) {
      placeElectrode("separator");
      draggedComponent = null;
      draggingSeparator = false;
      hideGhosts();
    }
  }
  if (current === "anode" && draggingAnode) {
    const rect = beakerSVG.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dz = dropZones.anode;
    if (
      mouseX >= dz.x && mouseX <= dz.x + dz.width &&
      mouseY >= dz.y && mouseY <= dz.y + dz.height
    ) {
      placeElectrode("anode");
      draggedComponent = null;
      draggingAnode = false;
      hideGhosts();
    }
  }
  if (current === "cathode" && draggingCathode) {
    const rect = beakerSVG.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dz = dropZones.cathode;
    if (
      mouseX >= dz.x && mouseX <= dz.x + dz.width &&
      mouseY >= dz.y && mouseY <= dz.y + dz.height
    ) {
      placeElectrode("cathode");
      draggedComponent = null;
      draggingCathode = false;
      hideGhosts();
    }
  }
  if (current === "connector" && draggingConnector) {
    const rect = beakerSVG.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dz = dropZones.connector;
    if (
      mouseX >= dz.x && mouseX <= dz.x + dz.width &&
      mouseY >= dz.y && mouseY <= dz.y + dz.height
    ) {
      placeElectrode("connector");
      draggedComponent = null;
      draggingConnector = false;
      hideGhosts();
    }
  }
});
beakerSVG.addEventListener("dragleave", e => {
  hideGhosts();
});
beakerSVG.addEventListener("drop", e => {
  e.preventDefault();
  if (!draggedComponent || draggedComponent !== current) {
    hideGhosts();
    return;
  }
  const rect = beakerSVG.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const dz = dropZones[draggedComponent];
  if (
    mouseX >= dz.x && mouseX <= dz.x + dz.width &&
    mouseY >= dz.y && mouseY <= dz.y + dz.height
  ) {
    placeElectrode(draggedComponent);
  } else {
    setInstruction("Drop in the highlighted region.");
  }
  draggedComponent = null;
  draggingSeparator = false;
  draggingAnode = false;
  draggingCathode = false;
  draggingConnector = false;
  hideGhosts();
});
beakerSVG.addEventListener("touchend", e => {
  if (!draggedComponent || draggedComponent !== current) {
    hideGhosts();
    return;
  }
  const rect = beakerSVG.getBoundingClientRect();
  const touch = e.changedTouches[0];
  const mouseX = touch.clientX - rect.left;
  const mouseY = touch.clientY - rect.top;
  const dz = dropZones[draggedComponent];
  if (
    mouseX >= dz.x && mouseX <= dz.x + dz.width &&
    mouseY >= dz.y && mouseY <= dz.y + dz.height
  ) {
    placeElectrode(draggedComponent);
  } else {
    setInstruction("Drop in the highlighted region.");
  }
  draggedComponent = null;
  draggingSeparator = false;
  draggingAnode = false;
  draggingCathode = false;
  draggingConnector = false;
  hideGhosts();
});
switchOnBtn.addEventListener("click", function() {
  drawConnector(true);
  setInstruction("Congratulations ! Your battery is ready to use ");
  switchOnBtn.style.display = "none";
});
setInstruction("Select and drag electrolyte in the beaker.");
hideGhosts();

// --- TTS Section with Toggle Button in Heading ---
const ttsText = "Lithium ion Battery set-up. In our setup we use graphite as anode, Lithium cobalt oxide as cathode and Lithium hexafluorophosphate as electrolyte. A porous seperator is placed between the electrodes in the electrolyte. The electrodes are connected via connectors externally. Adding a load like bulb ensures complete setup of lithium ion battery.";
let speaking = false;
let utter = null;

// Place the button into the instructions title, right after the heading
const instructionsTitle = document.querySelector('.instructions-title');
const ttsBtn = document.createElement('button');
ttsBtn.id = 'tts-btn';
ttsBtn.setAttribute("aria-label", "Toggle narration");
ttsBtn.style.background = "none";
ttsBtn.style.border = "none";
ttsBtn.style.cursor = "pointer";
ttsBtn.style.marginLeft = "0.6em";
ttsBtn.style.outline = "none";
ttsBtn.innerHTML = `
  <svg id="tts-icon" width="28" height="28" viewBox="0 0 28 28">
    <g>
      <path id="tts-icon-sound" d="M6 10v8h6l5 5V5l-5 5H6z" fill="#376996"/>
      <path id="tts-icon-cross" d="" fill="none" stroke="#C33" stroke-width="2" stroke-linecap="round" style="display:none"/>
    </g>
  </svg>
`;
instructionsTitle.appendChild(ttsBtn);
const ttsIcon = document.getElementById("tts-icon");
const crossPath = ttsIcon.querySelector("#tts-icon-cross");

// TTS Play/Stop logic
function speakTTS() {
  if (speaking) return;
  window.speechSynthesis.cancel();
  utter = new SpeechSynthesisUtterance(ttsText);
  utter.lang = 'en-US';
  utter.rate = 1;
  speaking = true;
  updateTTSIcon();
  utter.onend = () => { speaking = false; updateTTSIcon(); };
  utter.onerror = () => { speaking = false; updateTTSIcon(); };
  window.speechSynthesis.speak(utter);
}
function stopTTS() {
  if (!speaking) return;
  window.speechSynthesis.cancel();
  speaking = false;
  updateTTSIcon();
}
function updateTTSIcon() {
  if (speaking) {
    crossPath.setAttribute("d", "");
    crossPath.style.display = "none";
    ttsIcon.querySelector("#tts-icon-sound").setAttribute("fill", "#20b455");
  } else {
    // Draw cross
    crossPath.setAttribute("d", "M7,7 L21,21 M21,7 L7,21");
    crossPath.style.display = "";
    ttsIcon.querySelector("#tts-icon-sound").setAttribute("fill", "#888");
  }
}
ttsBtn.addEventListener("click", function() {
  if (speaking) {
    stopTTS();
  } else {
    speakTTS();
  }
});
// Try to play on page load (browsers may block!)
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    speakTTS();
  }, 400);
});
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});
  

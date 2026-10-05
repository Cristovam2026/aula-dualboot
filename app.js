/* ══════════════════════════════════════════════
   Dualboot Lab — App Logic
   ══════════════════════════════════════════════ */
"use strict";

const tabs = ["overview", "disk", "bios", "grub", "quiz"];
let profModeUnlocked = false;

// ─── Navegação ───
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    const tab = item.dataset.tab;
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    
    document.querySelectorAll(".tab-content").forEach(s => s.classList.remove("active"));
    document.getElementById("tab-" + tab).classList.add("active");
    
    const titles = { overview: "O que é Dualboot?", disk: "Particionamento", bios: "Simulador de BIOS", grub: "O Bootloader (GRUB)", quiz: "Quiz Final" };
    document.getElementById("headerTitle").textContent = titles[tab];
  });
});

function toggleSidebar() {
  document.getElementById("sidebar").style.transform = 
    document.getElementById("sidebar").style.transform === "translateX(0px)" ? "translateX(-100%)" : "translateX(0px)";
}

// ─── Professor Mode ───
function openProfModal() {
  document.getElementById("profOverlay").style.display = "block";
  document.getElementById("profModal").style.display = "flex";
  if (!profModeUnlocked) {
    document.getElementById("profPassScreen").style.display = "flex";
    document.getElementById("profContent").style.display = "none";
  }
}
function closeProfModal() {
  document.getElementById("profOverlay").style.display = "none";
  document.getElementById("profModal").style.display = "none";
}
function checkProfPass() {
  if (document.getElementById("profPassInput").value === "Luana@2011") {
    profModeUnlocked = true;
    document.getElementById("profPassScreen").style.display = "none";
    document.getElementById("profContent").style.display = "block";
  } else {
    document.getElementById("passError").style.display = "block";
  }
}
function switchProfTab(tab) {
  document.querySelectorAll(".prof-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.prof-tab[data-ptab="${tab}"]`).classList.add("active");
  document.querySelectorAll(".prof-tab-content").forEach(c => c.style.display = "none");
  document.getElementById(`ptab-${tab}`).style.display = "block";
}

function markDone(id) {
  document.getElementById(`badge-${id}`).style.display = "inline-block";
  document.getElementById(`nc-${id}`).textContent = "✅";
  
  const total = 5;
  const done = document.querySelectorAll(".nav-check:not(:empty)").length;
  document.getElementById("globalProgress").style.width = (done/total*100) + "%";
  document.getElementById("progressPct").textContent = Math.round(done/total*100) + "%";
}

// ─── ATIVIDADE 1: Mitos e Verdades ───
const mitos = [
  { q: "Fazer Dualboot deixa o computador mais lento.", a: "mito" },
  { q: "Preciso de dois HDs físicos separados para instalar dois sistemas.", a: "mito" },
  { q: "Existe risco de apagar o Windows se eu formatar a partição errada.", a: "verdade" }
];
let mitoIdx = 0;
function renderMitos() {
  if (mitoIdx >= mitos.length) {
    document.getElementById("actBody-overview").innerHTML = `<div class="act-feedback correct" style="text-align:center;font-size:1.1rem;padding:20px;">Você desvendou todos os mitos! 🎉</div>`;
    markDone("overview");
    return;
  }
  document.getElementById("actBody-overview").innerHTML = `
    <div style="font-weight:600; font-size:1.1rem; margin-bottom:15px; text-align:center;">${mitos[mitoIdx].q}</div>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button class="btn btn-primary" onclick="checkMito('verdade')">Verdade</button>
      <button class="btn btn-danger" style="background:#dc2626; color:#fff;" onclick="checkMito('mito')">Mito</button>
    </div>
    <div id="mitoFb" class="act-feedback" style="display:none; text-align:center; margin-top:15px;"></div>
  `;
}
function checkMito(ans) {
  const fb = document.getElementById("mitoFb");
  fb.style.display = "block";
  if (ans === mitos[mitoIdx].a) {
    fb.className = "act-feedback correct"; fb.textContent = "Correto! Muito bem.";
    setTimeout(() => { mitoIdx++; renderMitos(); }, 1200);
  } else {
    fb.className = "act-feedback wrong"; fb.textContent = "Ops, não é bem assim. Tente de novo.";
  }
}
renderMitos();

// ─── ATIVIDADE 2: Particionamento ───
let diskState = { win: 500, free: 0, linux: 0 };
function renderDisk() {
  document.getElementById("partWin").style.width = (diskState.win/500*100) + "%";
  document.getElementById("sizeWin").textContent = diskState.win + " GB";
  
  const freeEl = document.getElementById("partFree");
  if (diskState.free > 0) { freeEl.style.display = "flex"; freeEl.style.width = (diskState.free/500*100) + "%"; document.getElementById("sizeFree").textContent = diskState.free + " GB"; }
  else { freeEl.style.display = "none"; }
  
  const linEl = document.getElementById("partLinux");
  if (diskState.linux > 0) { linEl.style.display = "flex"; linEl.style.width = (diskState.linux/500*100) + "%"; document.getElementById("sizeLinux").textContent = diskState.linux + " GB"; }
  else { linEl.style.display = "none"; }
  
  const ctrls = document.getElementById("diskControls");
  if (diskState.win === 500) {
    ctrls.innerHTML = `<button class="btn btn-primary" onclick="shrinkWin()">✂️ Reduzir Volume (Shrink 100GB)</button>`;
  } else if (diskState.free === 100) {
    ctrls.innerHTML = `<button class="btn btn-secondary" onclick="createLinux()">🐧 Criar Partição Linux</button>`;
  } else if (diskState.linux === 100) {
    ctrls.innerHTML = `<button class="btn btn-success" disabled>✅ Instalação Pronta</button>`;
  }
}
function shrinkWin() {
  diskState.win = 400; diskState.free = 100; renderDisk();
  document.getElementById("diskStatusMsg").className = "disk-status success";
  document.getElementById("diskStatusMsg").textContent = "Excelente! Agora temos espaço livre. Crie a partição do Linux.";
}
function createLinux() {
  diskState.free = 0; diskState.linux = 100; renderDisk();
  document.getElementById("diskStatusMsg").className = "disk-status success";
  document.getElementById("diskStatusMsg").innerHTML = "Missão Cumprida! O disco está pronto para o Dualboot. 🎉";
  markDone("disk");
}
renderDisk();

// ─── ATIVIDADE 3: BIOS Simulator ───
let biosState = { fast: "Enabled", secure: "Enabled", order: ["Windows Boot Manager", "USB Flash Drive", "CD/DVD ROM"] };

function toggleBiosOpt(opt, values) {
  if (opt === 'Fast Boot') {
    biosState.fast = biosState.fast === values[0] ? values[1] : values[0];
    document.getElementById("biosFastBoot").textContent = `[${biosState.fast}]`;
  } else if (opt === 'Secure Boot Control') {
    biosState.secure = biosState.secure === values[0] ? values[1] : values[0];
    document.getElementById("biosSecureBoot").textContent = `[${biosState.secure}]`;
  }
  checkBios();
}

// Simple Drag & Drop Logic for Boot Order
let dragSrcEl = null;
function handleDragStart(e) { dragSrcEl = this; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/html', this.innerHTML); }
function handleDragOver(e) { if (e.preventDefault) { e.preventDefault(); } return false; }
function handleDrop(e) {
  if (e.stopPropagation) { e.stopPropagation(); }
  if (dragSrcEl !== this) {
    let srcData = dragSrcEl.dataset.device;
    let targetData = this.dataset.device;
    let srcIdx = biosState.order.indexOf(srcData);
    let targetIdx = biosState.order.indexOf(targetData);
    biosState.order[srcIdx] = targetData;
    biosState.order[targetIdx] = srcData;
    renderBiosOrder();
  }
  return false;
}
function renderBiosOrder() {
  const list = document.getElementById("biosBootList");
  list.innerHTML = "";
  biosState.order.forEach((dev, idx) => {
    let div = document.createElement("div");
    div.className = "bios-boot-item"; div.draggable = true; div.dataset.device = dev;
    let icon = dev.includes("USB") ? "usb" : (dev.includes("Windows") ? "hd" : "cd");
    div.innerHTML = `Boot Option #${idx+1}: [${dev}]`;
    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('drop', handleDrop, false);
    list.appendChild(div);
  });
  checkBios();
}
function checkBios() {
  let c1 = biosState.secure === "Disabled", c2 = biosState.fast === "Disabled", c3 = biosState.order[0] === "USB Flash Drive";
  document.getElementById("chk-secure").innerHTML = `${c1?'✅':'❌'} Secure Boot deve estar <strong>Disabled</strong>`;
  document.getElementById("chk-fast").innerHTML = `${c2?'✅':'❌'} Fast Boot deve estar <strong>Disabled</strong>`;
  document.getElementById("chk-usb").innerHTML = `${c3?'✅':'❌'} USB Flash Drive deve ser a <strong>Boot Option #1</strong>`;
  if (c1 && c2 && c3) markDone("bios");
}
renderBiosOrder();

// ─── ATIVIDADE 4: GRUB Simulator ───
let grubActive = 0;
const grubOptions = ["ubuntu", "advanced", "windows", "uefi"];
function updateGrubUI() {
  document.querySelectorAll(".grub-item").forEach((el, idx) => {
    el.classList.toggle("active", idx === grubActive);
  });
}
function grubMove(dir) {
  grubActive += dir;
  if (grubActive < 0) grubActive = grubOptions.length - 1;
  if (grubActive >= grubOptions.length) grubActive = 0;
  updateGrubUI();
}
function grubEnter() {
  const fb = document.getElementById("grubFeedback");
  fb.style.display = "block";
  if (grubOptions[grubActive] === "windows") {
    fb.className = "act-feedback correct";
    fb.textContent = "Booting Windows... Sucesso! Você escolheu o sistema correto.";
    markDone("grub");
  } else if (grubOptions[grubActive] === "ubuntu") {
    fb.className = "act-feedback wrong";
    fb.textContent = "Booting Ubuntu... O objetivo da atividade é iniciar o Windows. Tente novamente.";
  } else {
    fb.className = "act-feedback wrong";
    fb.textContent = "Opção incorreta para essa atividade.";
  }
}
document.addEventListener("keydown", (e) => {
  if (document.getElementById("tab-grub").classList.contains("active")) {
    if (e.key === "ArrowUp") { grubMove(-1); e.preventDefault(); }
    if (e.key === "ArrowDown") { grubMove(1); e.preventDefault(); }
    if (e.key === "Enter") { grubEnter(); e.preventDefault(); }
  }
});

// ─── ATIVIDADE 5: QUIZ FINAL ───
const quizQuestions = [
  { q: "No particionamento, o que significa a opção 'Shrink' (Reduzir)?", options: ["Apagar todos os dados do disco", "Diminuir uma partição existente para criar espaço livre", "Clonar o HD"], correct: 1 },
  { q: "Qual a função do GRUB no Dualboot?", options: ["Deixar o PC mais rápido", "Antivírus padrão do Linux", "Menu que permite escolher qual sistema iniciar"], correct: 2 },
  { q: "Por que precisamos desativar o Secure Boot na BIOS?", options: ["Para deixar o PC vulnerável a vírus", "Porque alguns sistemas Linux não possuem a assinatura digital reconhecida pela placa-mãe", "Para fazer overclock no processador"], correct: 1 },
  { q: "Qual é a ordem recomendada de instalação?", options: ["Linux primeiro, Windows depois", "Windows primeiro, Linux depois", "Não faz diferença"], correct: 1 },
  { q: "Se eu excluir a partição do Linux pelo Windows (Gerenciador de Disco), o que acontece?", options: ["O Windows ganha mais RAM", "O GRUB pode quebrar e o PC não iniciar nem o Windows", "A BIOS é resetada"], correct: 1 }
];
let currentQ = 0, answers = new Array(5).fill(null);
function renderQuiz() {
  const q = quizQuestions[currentQ], ans = answers[currentQ] !== null;
  document.getElementById("quizProgFill").style.width = (answers.filter(a=>a!==null).length / 5 * 100) + "%";
  document.getElementById("quizProgText").textContent = `Questão ${currentQ+1} de 5`;
  let html = `<div style="font-weight:600;font-size:1.1rem;margin-bottom:15px;">${q.q}</div><div style="display:flex;flex-direction:column;gap:10px;">`;
  q.options.forEach((opt, i) => {
    let cls = ans ? (i === q.correct ? "correct" : (i === answers[currentQ] ? "wrong" : "")) : "";
    let bg = cls==="correct" ? "background:rgba(16,185,129,0.2);border-color:#10b981;" : cls==="wrong" ? "background:rgba(239,68,68,0.2);border-color:#ef4444;" : "background:rgba(255,255,255,0.05);";
    html += `<button class="btn" style="${bg} text-align:left; padding:12px; border:1px solid rgba(255,255,255,0.2); justify-content:flex-start; color:#fff;" onclick="selectQuiz(${i})" ${ans?'disabled':''}>${opt}</button>`;
  });
  document.getElementById("questionArea").innerHTML = html + `</div>`;
  document.getElementById("btnPrevQ").disabled = currentQ === 0;
  document.getElementById("btnNextQ").disabled = !ans;
}
function selectQuiz(opt) {
  answers[currentQ] = opt; renderQuiz();
  if (answers.every(a => a !== null)) setTimeout(showResults, 800);
}
function nextQuestion() { if(currentQ < 4) { currentQ++; renderQuiz(); } }
function prevQuestion() { if(currentQ > 0) { currentQ--; renderQuiz(); } }
function showResults() {
  const score = answers.filter((a, i) => a === quizQuestions[i].correct).length;
  document.getElementById("quizCard").style.display = "none"; document.getElementById("quizResults").style.display = "block";
  document.getElementById("resultsTitle").textContent = score === 5 ? "Gabaritou!" : "Bom trabalho!";
  document.getElementById("resultsScore").textContent = `${score} / 5`;
  document.getElementById("resultsBar").style.width = (score/5*100) + "%";
  markDone("quiz");
}
function restartQuiz() {
  currentQ = 0; answers.fill(null);
  document.getElementById("quizCard").style.display = "block"; document.getElementById("quizResults").style.display = "none";
  renderQuiz();
}
renderQuiz();

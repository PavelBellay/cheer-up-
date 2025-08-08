/* === Config === */
const CINNAMOROLL_DURATION = 12000;
const CINNAMOROLL_LIMIT_TIME = 30000;
const CINNAMOROLL_INITIAL_COUNT = 3;

/* === Cheer-up AI lines, no repeats until reset === */
let aiResponses = [
  "You're stronger than you think. 🌟",
  "Every day is a fresh start, keep shining! ✨",
  "Believe in yourself — I believe in you! 💚",
  "You bring so much joy just by being you.",
  "Keep blooming, beautiful soul. 🌸",
  "Your smile lights up the darkest days.",
  "Take a deep breath, you've got this.",
  "Small steps every day lead to big changes.",
  "You are loved more than you know.",
  "The world is better with you in it.",
  "Keep going, amazing things await you.",
  "Remember, you’re doing your best and that’s enough."
];
let usedResponses = [];

function getAIReply(){
  if (aiResponses.length === 0) {
    aiResponses = [...usedResponses];
    usedResponses = [];
  }
  const index = Math.floor(Math.random() * aiResponses.length);
  const line = aiResponses.splice(index, 1)[0];
  usedResponses.push(line);
  return line;
}

/* === Elements === */
const chatWindow = document.getElementById('chat-window');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const cinnamorollWrap = document.getElementById('cinnamoroll-wrap');
const cursor = document.getElementById('cursor-follower');
const sendBtn = document.getElementById('send-btn');

/* === Append messages with enhanced physics animation === */
function appendMessage(who, text){
  const el = document.createElement('div');
  el.className = 'message ' + (who === 'You'? 'you': 'bot');
  el.innerHTML = `<strong>${who}</strong><div class="bubble">${text}</div>`;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  // "fly in" with bounce
  gsap.fromTo(el, {y:-30, opacity:0, rotation:-2, scale:0.9}, {
    y:0, opacity:1, rotation:0, scale:1,
    duration:0.6,
    ease:'elastic.out(1, 0.6)'
  });
}

/* === Form submit === */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if(!val) return;
  appendMessage('You', val);
  input.value = '';
  gsap.fromTo(sendBtn, {scale:1}, {scale:0.96, duration:0.08, yoyo:true, repeat:1});
  setTimeout(()=>{
    appendMessage('AI Friend', getAIReply());
  }, 700);
});

/* === Cinnamoroll floating animation === */
function createCinnamoroll(){
  const c = document.createElement('div');
  c.className = 'cinnamoroll';
  c.textContent = '🐰'; // fallback emoji if image not loading
  cinnamorollWrap.appendChild(c);
  const startX = Math.random() * window.innerWidth;
  const wobble = (Math.random()*100) - 50;
  gsap.set(c, { x: startX, y: window.innerHeight + 80, rotation: -5 + Math.random()*10, scale: 0.8 + Math.random()*0.4});
  gsap.to(c, {
    x: startX + wobble,
    y: window.innerHeight - 150 - Math.random()*50,
    rotation: 10 - Math.random()*20,
    duration: (CINNAMOROLL_DURATION/1000) + Math.random()*3,
    ease: 'power1.inOut',
    yoyo:true,
    repeat: -1,
  });
}
function launchCinnamorolls(){
  for(let i=0; i<CINNAMOROLL_INITIAL_COUNT; i++) createCinnamoroll();
}

/* === Cursor follower === */
function enableCursorFollower(){
  if(('ontouchstart' in window) || navigator.maxTouchPoints > 0) return;
  cursor.style.display = 'block';
  document.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' });
    gsap.to(cursor, { scale: 1.0, duration: 0.12, ease:'power2.out' });
  });
  document.addEventListener('mousedown', () => {
    gsap.to(cursor, { scale: 0.8, duration: 0.08 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(cursor, { scale: 1.0, duration: 0.08 });
  });
}

/* === Title & entrance animations === */
gsap.from(".title", { y:-40, opacity:0, duration:0.9, ease:"back.out(1.2)" });
gsap.from(".subtitle", { y:-10, opacity:0, duration:0.6, delay:0.15 });
gsap.from("#chat-card", { scale:0.96, opacity:0, duration:0.9, delay:0.25, ease:"elastic.out(1,0.6)" });

/* === Start cinnamorolls and cursor === */
launchCinnamorolls();
enableCursorFollower();
input.focus();
setTimeout(()=> appendMessage('AI Friend', 'Hi — I\'m your green AI buddy! Say something sweet to start.'), 650);

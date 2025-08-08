/* === Config === */
const BALLOON_DURATION = 9000; // ms travel time
const BALLOON_LIMIT_TIME = 30000; // show balloons for first 30s
const BALLOON_INITIAL_COUNT = 5;

/* === Simple fake AI data === */
const aiResponses = [
  "You are capable of amazing things. 🌿",
  "Your kindness makes a difference every day. 💚",
  "Breathe deeply, you are exactly where you need to be. 🍃",
  "Small steps every day lead to big changes. 🌱",
  "You radiate calm and confidence. ✨",
  "Every challenge you face is an opportunity to grow. 🌿",
  "You are stronger than you think. 💪",
  "Your presence is a gift to the world. 🎁",
  "You deserve peace and happiness. 🕊️",
  "Your heart knows the way — trust it. 💚"
];
let usedResponses = [];
function getAIReply(){
  if (aiResponses.length === 0) {
    aiResponses.push(...usedResponses);
    usedResponses = [];
  }
  const idx = Math.floor(Math.random() * aiResponses.length);
  const reply = aiResponses.splice(idx, 1)[0];
  usedResponses.push(reply);
  return reply;
}

/* === Form submit === */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if(!val) return;
  appendMessage('You', val);
  input.value = '';
  // send button micro effect
  gsap.fromTo(sendBtn, {scale:1}, {scale:0.96, duration:0.08, yoyo:true, repeat:1});

  // fake thinking
  const thinking = setTimeout(()=>{
    appendMessage('AI Friend', getAIReply());
    clearTimeout(thinking);
  }, 700);
});

/* === Balloons logic (spread across width) === */
let balloonStart = Date.now();

function createBalloon(){
  const b = document.createElement('div');
  b.className = 'balloon';
  b.textContent = '🌿';
  balloonWrap.appendChild(b);

  const startX = Math.random() * window.innerWidth;
  const wobble = (Math.random()*200) - 100;
  // position start
  gsap.set(b, { x: startX, y: window.innerHeight + 80, rotation: -8 + Math.random()*16, scale: 0.95 + Math.random()*0.2});
  // animate upward with subtle sway
  gsap.to(b, {
    x: startX + wobble,
    y: -160,
    rotation: -20 + Math.random()*40,
    duration: (BALLOON_DURATION/1000) + Math.random()*2,
    ease: 'power1.inOut',
    onComplete: () => { b.remove(); }
  });
}

/* spawn loop (stop after BALLOON_LIMIT_TIME) */
function launchBalloons(){
  for(let i=0;i<BALLOON_INITIAL_COUNT;i++){
    createBalloon();
  }
  const spawnInterval = setInterval(()=>{
    if(Date.now() - balloonStart > BALLOON_LIMIT_TIME){
      clearInterval(spawnInterval);
      return;
    }
    createBalloon();
  }, 1400);
}

/* === Cursor follower (desktop only) === */
function enableCursorFollower(){
  // hide on touch devices
  if(('ontouchstart' in window) || navigator.maxTouchPoints > 0) return;
  cursor.style.display = 'block';
  let lastX = window.innerWidth/2, lastY = window.innerHeight/2;
  let mouseX = lastX, mouseY = lastY;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power3.out' });
    gsap.to(cursor, { scale: 1.0, duration: 0.12, ease:'power2.out' });
  });
  // click micro effect
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

/* === start balloons and cursor === */
launchBalloons();
enableCursorFollower();

/* === Accessibility: focus on input quickly === */
input.focus();

/* === optional: polite initial greeting message === */
setTimeout(()=> appendMessage('AI Friend', 'Hi — I\'m your golden party buddy! Say something to get a fun line.'), 650);


// Floating animation for Cinnamoroll
gsap.to("#cinnamoroll", { y: -10, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });

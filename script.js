// ==========================================
// 1. CLOCK & GREETING FEATURE
// ==========================================
function updateClock() {
  const now = new Date();
  
  // Format jam (HH:MM:SS)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

  // Format tanggal
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);

  // Sapaan berdasarkan waktu
  const currentHour = now.getHours();
  let greetingText = 'Good Morning';
  if (currentHour >= 12 && currentHour < 18) {
    greetingText = 'Good Afternoon';
  } else if (currentHour >= 18) {
    greetingText = 'Good Evening';
  }
  document.getElementById('greeting').textContent = greetingText;
}

// Jalankan clock setiap 1 detik
setInterval(updateClock, 1000);
updateClock();


// ==========================================
// 2. FOCUS TIMER FEATURE (25 Mins)
// ==========================================
let timerInterval = null;
let timeLeft = 25 * 60; // 25 menit dalam detik

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

function updateTimerDisplay() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

startBtn.addEventListener('click', () => {
  if (timerInterval === null) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Focus time is over! Take a break.');
      }
    }, 1000);
  }
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 25 * 60;
  updateTimerDisplay();
});


// ==========================================
// 3. TO-DO LIST FEATURE (dengan LocalStorage)
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];

function saveAndRenderTasks() {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  todoList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
        <span style="margin-left: 8px;">${task.text}</span>
      </div>
      <button class="btn btn-secondary" style="padding: 2px 8px; font-size: 0.8rem;" onclick="deleteTask(${index})">Delete</button>
    `;
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = todoInput.value.trim();
  
  // Challenge: Prevent duplicate tasks
  const isDuplicate = tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());
  if (isDuplicate) {
    alert('Task already exists!');
    return;
  }

  if (taskText !== '') {
    tasks.push({ text: taskText, completed: false });
    todoInput.value = '';
    saveAndRenderTasks();
  }
});

window.toggleTask = function(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRenderTasks();
};

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  saveAndRenderTasks();
};

renderTasks();


// ==========================================
// 4. QUICK LINKS FEATURE (dengan LocalStorage)
// ==========================================
const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput = document.getElementById('link-url-input');
const linksContainer = document.getElementById('links-container');

let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [
  { name: 'Google', url: 'https://google.com' },
  { name: 'Gmail', url: 'https://mail.google.com' }
];

function saveAndRenderLinks() {
  localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
  renderLinks();
}

function renderLinks() {
  linksContainer.innerHTML = '';
  quickLinks.forEach((link, index) => {
    const linkAnchor = document.createElement('a');
    linkAnchor.className = 'link-chip';
    linkAnchor.href = link.url;
    linkAnchor.target = '_blank';
    linkAnchor.innerHTML = `
      ${link.name}
      <span onclick="event.preventDefault(); deleteLink(${index});" style="color: #e53e3e; cursor: pointer; font-weight: bold; margin-left: 4px;">&times;</span>
    `;
    linksContainer.appendChild(linkAnchor);
  });
}

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  if (name && url) {
    quickLinks.push({ name, url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    saveAndRenderLinks();
  }
});

window.deleteLink = function(index) {
  quickLinks.splice(index, 1);
  saveAndRenderLinks();
};

renderLinks();
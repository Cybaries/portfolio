const body = document.getElementById('terminal-body');
const input = document.getElementById('terminal-input');

function printLine(html) {
  const line = document.createElement('div');
  line.className = 'terminal-line';
  line.innerHTML = html;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

function printPrompt(cmd) {
  printLine(`<span class="prompt">$</span> ${escapeHtml(cmd)}`);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const COMMANDS = {
  help: {
    desc: 'list available commands',
    run: () => {
      printLine('<span class="out">available commands:</span>');
      Object.entries(COMMANDS).forEach(([name, c]) => {
        printLine(`<span class="out">&nbsp;&nbsp;<span class="out-link">${name}</span> — ${c.desc}</span>`);
      });
    }
  },
  whoami: {
    desc: 'about me',
    run: () => {
      printLine('<span class="out">Aman Kant Jha — Backend Developer (Python, Node.js, Django)</span>');
      printLine('<span class="out">Specialized in scale & legacy system transformation. Currently at TCS, Pune.</span>');
    }
  },
  experience: {
    desc: 'jump to work experience',
    run: () => { printLine('<span class="out">→ scrolling to experience...</span>'); scrollToSection('experience'); }
  },
  projects: {
    desc: 'jump to projects',
    run: () => { printLine('<span class="out">→ scrolling to projects...</span>'); scrollToSection('projects'); }
  },
  skills: {
    desc: 'jump to tech stack',
    run: () => { printLine('<span class="out">→ scrolling to skills...</span>'); scrollToSection('skills'); }
  },
  contact: {
    desc: 'jump to contact info',
    run: () => { printLine('<span class="out">→ scrolling to contact...</span>'); scrollToSection('contact'); }
  },
  clear: {
    desc: 'clear the terminal',
    run: () => { body.innerHTML = ''; }
  },
  'sudo hire-me': {
    desc: '???',
    run: () => {
      printLine('<span class="out-warn">[sudo] password for visitor: ********</span>');
      setTimeout(() => {
        printLine('<span class="out">Permission granted. Redirecting to contact...</span>');
        scrollToSection('contact');
      }, 600);
    }
  }
};

function handleCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  printPrompt(cmd);

  const key = Object.keys(COMMANDS).find(k => k.toLowerCase() === cmd.toLowerCase());
  if (key) {
    COMMANDS[key].run();
  } else {
    printLine(`<span class="out-warn">command not found: ${escapeHtml(cmd)}</span> <span class="out">(try "help")</span>`);
  }
}

if (input) {
  const history = [];
  let historyIdx = -1;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      if (val.trim()) {
        history.push(val);
        historyIdx = history.length;
      }
      handleCommand(val);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) { historyIdx -= 1; input.value = history[historyIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) { historyIdx += 1; input.value = history[historyIdx]; }
      else { historyIdx = history.length; input.value = ''; }
    }
  });

  // Clicking a suggested command in the output runs it
  body.addEventListener('click', (e) => {
    if (e.target.matches('.out-link[data-cmd]')) {
      handleCommand(e.target.dataset.cmd);
    }
  });

  // Focus terminal input on click anywhere in the terminal
  document.getElementById('terminal').addEventListener('click', () => input.focus());
}

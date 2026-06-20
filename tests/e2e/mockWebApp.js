const http = require('http');

const port = Number(process.env.MOCK_WEB_PORT || 3000);

function page(title, body) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    nav a { margin-right: 16px; }
    table { border-collapse: collapse; margin-top: 16px; }
    td, th { border: 1px solid #ccc; padding: 8px 12px; }
    .room-type-row { margin: 8px 0; padding: 8px; border: 1px solid #ddd; }
    .time-slot { min-height: 48px; min-width: 220px; border: 1px dashed #777; padding: 12px; margin-top: 12px; }
    .lesson-card { display: inline-block; padding: 8px 12px; background: #eef; border: 1px solid #99c; cursor: move; }
    .error { color: #b00020; font-weight: bold; }
  </style>
</head>
<body>
  <nav>
    <a href="/schedule">Schedule</a>
    <a href="/room-types">Room Types</a>
    <a href="/login">Login</a>
  </nav>
  ${body}
</body>
</html>`;
}

function loginPage() {
  return page('Login', `
    <h1>Login</h1>
    <form id="login-form">
      <label>Username <input data-testid="username" name="username" /></label>
      <label>Password <input data-testid="password" name="password" type="password" /></label>
      <button type="submit">Login</button>
    </form>
    <script>
      document.getElementById('login-form').addEventListener('submit', event => {
        event.preventDefault();
        window.location.href = '/schedule';
      });
    </script>
  `);
}

function schedulePage() {
  return page('Schedule', `
    <h1>Schedule / Розклад</h1>
    <label>Group
      <select data-testid="group-select" name="group">
        <option>Test Group</option>
        <option>QA Group</option>
      </select>
    </label>
    <label>Week
      <select data-testid="week-type" name="weekType">
        <option>even</option>
        <option>odd</option>
      </select>
    </label>
    <input data-testid="schedule-search" type="search" placeholder="Search schedule" />
    <section>
      <h2>Lessons</h2>
      <div class="lesson-card" data-testid="lesson-card" draggable="true">Test lesson</div>
      <div class="time-slot" data-testid="time-slot">Monday 09:00 Test lesson</div>
      <div id="lesson-details">Teacher: Test Teacher | Room: 101 | Time: Monday 09:00 | Type: Lecture</div>
    </section>
    <script>
      const lesson = document.querySelector('[data-testid="lesson-card"]');
      const slot = document.querySelector('[data-testid="time-slot"]');
      lesson.addEventListener('dragstart', event => event.dataTransfer.setData('text/plain', 'Test lesson'));
      slot.addEventListener('dragover', event => event.preventDefault());
      slot.addEventListener('drop', event => {
        event.preventDefault();
        slot.textContent = 'Monday 09:00 ' + event.dataTransfer.getData('text/plain');
      });
    </script>
  `);
}

function roomTypesPage() {
  return page('Room Types', `
    <h1>Room Types / Типи аудиторій</h1>
    <input data-testid="room-type-search" type="search" placeholder="Search room type" />
    <button id="open-create">Create</button>
    <form id="room-form" style="display:none">
      <input data-testid="room-type-name" name="name" placeholder="Name" />
      <textarea data-testid="room-type-description" name="description" placeholder="Description"></textarea>
      <button type="submit">Save</button>
    </form>
    <div id="validation" class="error"></div>
    <div id="list">
      <div class="room-type-row"><span>lecture</span><button>Edit</button><button>Delete</button></div>
    </div>
    <script>
      const form = document.getElementById('room-form');
      const list = document.getElementById('list');
      const validation = document.getElementById('validation');
      let editingRow = null;

      document.getElementById('open-create').addEventListener('click', () => {
        editingRow = null;
        form.style.display = 'block';
        form.elements.name.value = '';
        form.elements.description.value = '';
        validation.textContent = '';
      });

      function createRow(name) {
        const row = document.createElement('div');
        row.className = 'room-type-row';
        row.innerHTML = '<span>' + name + '</span> <button>Edit</button> <button>Delete</button>';
        row.querySelector('button:nth-of-type(1)').addEventListener('click', () => {
          editingRow = row;
          form.style.display = 'block';
          form.elements.name.value = row.querySelector('span').textContent;
        });
        row.querySelector('button:nth-of-type(2)').addEventListener('click', () => row.remove());
        return row;
      }

      for (const button of list.querySelectorAll('button')) {
        if (button.textContent === 'Edit') {
          button.addEventListener('click', event => {
            editingRow = event.target.closest('.room-type-row');
            form.style.display = 'block';
            form.elements.name.value = editingRow.querySelector('span').textContent;
          });
        }
        if (button.textContent === 'Delete') {
          button.addEventListener('click', event => event.target.closest('.room-type-row').remove());
        }
      }

      form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.elements.name.value.trim();
        if (!name) {
          validation.textContent = 'Name is required';
          return;
        }
        validation.textContent = '';
        if (editingRow) {
          editingRow.querySelector('span').textContent = name;
        } else {
          list.appendChild(createRow(name));
        }
        form.style.display = 'none';
      });
    </script>
  `);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let html;
  if (url.pathname === '/' || url.pathname === '/schedule') {
    html = schedulePage();
  } else if (url.pathname === '/login') {
    html = loginPage();
  } else if (url.pathname === '/room-types') {
    html = roomTypesPage();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`Mock web app is running on http://localhost:${port}`);
});

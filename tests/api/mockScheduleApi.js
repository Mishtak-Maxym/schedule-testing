const http = require('http');

const port = Number(process.env.MOCK_API_PORT || 8080);
let nextClassId = 1;
let nextLessonId = 1;
const classes = new Map();
const lessons = new Map();

function send(res, status, body = null) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  if (body === null) {
    res.end();
    return;
  }
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

function getIdFromPath(path, prefix) {
  const id = path.replace(prefix, '').replace(/^\//, '');
  return id ? Number(id) : null;
}

function isClassPath(path) {
  return path === '/api/classes' || path.startsWith('/api/classes/');
}

function isLessonPath(path) {
  return path === '/api/lessons' || path.startsWith('/api/lessons/');
}

async function handleClasses(req, res, path) {
  const id = getIdFromPath(path, '/api/classes');

  if (req.method === 'GET' && !id) {
    return send(res, 200, Array.from(classes.values()));
  }

  if (req.method === 'GET' && id) {
    const item = classes.get(id);
    return item ? send(res, 200, item) : send(res, 404, { message: 'Class not found' });
  }

  if (req.method === 'POST' && !id) {
    const body = await readJson(req);
    if (!body.name || String(body.name).trim() === '') {
      return send(res, 400, { message: 'Name is required' });
    }
    const item = {
      id: nextClassId++,
      name: body.name,
      description: body.description || ''
    };
    classes.set(item.id, item);
    return send(res, 201, item);
  }

  if (req.method === 'PUT' && id) {
    if (!classes.has(id)) {
      return send(res, 404, { message: 'Class not found' });
    }
    const body = await readJson(req);
    if (!body.name || String(body.name).trim() === '') {
      return send(res, 400, { message: 'Name is required' });
    }
    const item = {
      id,
      name: body.name,
      description: body.description || ''
    };
    classes.set(id, item);
    return send(res, 200, item);
  }

  if (req.method === 'DELETE' && id) {
    if (!classes.has(id)) {
      return send(res, 404, { message: 'Class not found' });
    }
    classes.delete(id);
    for (const [lessonId, lesson] of lessons.entries()) {
      if (lesson.classId === id) {
        lessons.delete(lessonId);
      }
    }
    return send(res, 204);
  }

  return send(res, 405, { message: 'Method not allowed' });
}

async function handleLessons(req, res, path) {
  const id = getIdFromPath(path, '/api/lessons');

  if (req.method === 'GET' && !id) {
    return send(res, 200, Array.from(lessons.values()));
  }

  if (req.method === 'GET' && id) {
    const item = lessons.get(id);
    return item ? send(res, 200, item) : send(res, 404, { message: 'Lesson not found' });
  }

  if (req.method === 'POST' && !id) {
    const body = await readJson(req);
    if (!body.name && !body.title) {
      return send(res, 400, { message: 'Lesson title is required' });
    }
    if (!body.classId || !classes.has(Number(body.classId))) {
      return send(res, 400, { message: 'Valid classId is required' });
    }
    const item = {
      id: nextLessonId++,
      name: body.name || body.title,
      title: body.title || body.name,
      subject: body.subject || '',
      classId: Number(body.classId)
    };
    lessons.set(item.id, item);
    return send(res, 201, item);
  }

  if (req.method === 'PUT' && id) {
    if (!lessons.has(id)) {
      return send(res, 404, { message: 'Lesson not found' });
    }
    const body = await readJson(req);
    if (!body.name && !body.title) {
      return send(res, 400, { message: 'Lesson title is required' });
    }
    const item = {
      id,
      name: body.name || body.title,
      title: body.title || body.name,
      subject: body.subject || '',
      classId: Number(body.classId)
    };
    lessons.set(id, item);
    return send(res, 200, item);
  }

  if (req.method === 'DELETE' && id) {
    if (!lessons.has(id)) {
      return send(res, 404, { message: 'Lesson not found' });
    }
    lessons.delete(id);
    return send(res, 204);
  }

  return send(res, 405, { message: 'Method not allowed' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  if (req.method === 'OPTIONS') {
    return send(res, 204);
  }

  if (path === '/health') {
    return send(res, 200, { status: 'ok' });
  }

  if (isClassPath(path)) {
    return handleClasses(req, res, path);
  }

  if (isLessonPath(path)) {
    return handleLessons(req, res, path);
  }

  return send(res, 404, { message: 'Not found' });
});

server.listen(port, () => {
  console.log(`Mock schedule API is running on http://localhost:${port}`);
});

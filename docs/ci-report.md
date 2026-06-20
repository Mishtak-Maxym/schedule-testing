# CI/CD Pipeline Report

## Лабораторна робота №6

### Мета

Налаштувати GitHub Actions workflow для автоматичного запуску тестів у репозиторії `schedule-testing` при кожному `push` та `pull_request`.

### Workflow

Файл pipeline:

```text
.github/workflows/tests.yml
```

Workflow запускається у трьох випадках:

- `push` у гілку `main`;
- `pull_request` у гілку `main`;
- ручний запуск через `workflow_dispatch`.

### Jobs

#### 1. Unit tests

Запускає Jest unit-тести з папки `frontend`.

Команди:

```bash
cd frontend
npm install
npm test
npm run test:coverage
```

Матриця версій Node.js:

- Node.js 18
- Node.js 20

Артефакт:

```text
frontend/coverage
```

#### 2. API tests

Запускає API-тести з ЛР4:

- Jest + axios;
- Postman/Newman.

Для стабільного проходження в CI використовується mock API:

```text
tests/api/mockScheduleApi.js
```

Команди:

```bash
npm install
npm run start:mock-api
npm run test:api
npm run test:postman
```

Матриця версій Node.js:

- Node.js 18
- Node.js 20

Артефакти:

```text
reports/api
reports/postman
mock-api.log
```

#### 3. Playwright E2E

Запускає E2E-тести з ЛР5.

Для стабільного проходження в CI використовується mock web app:

```text
tests/e2e/mockWebApp.js
```

Команди:

```bash
npm install
npx playwright install --with-deps chromium
npm run start:mock-web
npx playwright test --project=chromium
```

Матриця браузерів:

- Chromium

Артефакти:

```text
playwright-report
test-results
mock-web.log
```

### Status badge

Badge додано у `README.md`:

```markdown
[![Schedule Testing](https://github.com/Mishtak-Maxym/schedule-testing/actions/workflows/tests.yml/badge.svg)](https://github.com/Mishtak-Maxym/schedule-testing/actions/workflows/tests.yml)
```

### Що перевірити перед здачею

1. Відкрити вкладку `Actions` у GitHub.
2. Вибрати workflow `Schedule Testing`.
3. Переконатися, що всі jobs мають зелений статус.
4. Перевірити, що артефакти доступні для завантаження.
5. Зробити скріншот успішного workflow для звіту.

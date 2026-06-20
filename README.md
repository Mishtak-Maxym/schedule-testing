# Schedule Testing

[![Schedule Testing](https://github.com/Mishtak-Maxym/schedule-testing/actions/workflows/tests.yml/badge.svg)](https://github.com/Mishtak-Maxym/schedule-testing/actions/workflows/tests.yml)

## Опис проєкту

Репозиторій містить матеріали лабораторних робіт для системи управління розкладом:

- GitHub Issues та Project Board для user stories, questions і bug reports.
- Unit-тести на Jest.
- API-тести на Jest + axios та Postman/Newman.
- E2E-тести на Playwright.
- SQL helper для підготовки, перевірки та очищення тестових даних.
- GitHub Actions CI/CD workflow для автоматичного запуску тестів.

## Запуск тестів локально

### Unit-тести ЛР3

```bash
cd frontend
npm install
npm test
npm run test:coverage
npm run stryker
```

### API-тести ЛР4

```bash
npm install
npm run test:api
npm run test:postman
```

### E2E-тести ЛР5

```bash
npm install
npx playwright install
npm run test:e2e
npm run test:e2e:report
```

## CI/CD

Workflow знаходиться у файлі:

```text
.github/workflows/tests.yml
```

Pipeline запускається при кожному `push`, `pull_request` і вручну через `workflow_dispatch`.

У workflow є jobs:

- `unit-tests` — запускає Jest unit-тести з папки `frontend`.
- `api-tests` — запускає Jest API-тести та Postman/Newman тести.
- `e2e-tests` — запускає Playwright E2E-тести.

Для стабільного проходження pipeline без локального backend/frontend у CI використовуються mock-сервери:

```text
tests/api/mockScheduleApi.js
tests/e2e/mockWebApp.js
```

Після виконання workflow доступні артефакти зі звітами:

- unit coverage report;
- API test logs;
- Newman logs;
- Playwright HTML report.

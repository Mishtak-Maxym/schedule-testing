# E2E Testing Report

## Мета

Перевірити основні сценарії системи управління розкладом за допомогою Playwright та SQL-перевірок.

## Трек

- Мова: JavaScript
- Інструмент: Playwright
- Варіант: 1
- CRUD сутність: RoomType
- Drag & Drop: розміщення заняття у розкладі
- SQL: setup/cleanup для RoomType, перевірка створення типу аудиторії в БД

## Структура файлів

```text
schedule-testing/
├── tests/
│   └── e2e/
│       ├── pages/
│       │   ├── LoginPage.js
│       │   ├── RoomTypePage.js
│       │   └── SchedulePage.js
│       ├── specs/
│       │   ├── schedule.spec.js
│       │   ├── roomType.spec.js
│       │   └── database.spec.js
│       └── helpers/
│           └── database.js
├── playwright.config.js
└── package.json
```

## Запуск тестів

```bash
npm install
npx playwright install
npm run test:e2e
```

Запуск у видимому браузері:

```bash
npm run test:e2e:headed
```

Відкрити HTML-звіт:

```bash
npm run test:e2e:report
```

## Змінні середовища

```bash
E2E_BASE_URL=http://localhost:3000
E2E_LOGIN_PATH=/login
E2E_SCHEDULE_PATH=/schedule
E2E_ROOM_TYPE_PATH=/room-types
E2E_USERNAME=admin
E2E_PASSWORD=admin
E2E_GROUP_NAME="Test Group"
E2E_LESSON_NAME="Test lesson"
E2E_TIME_SLOT="Monday 09:00"
DATABASE_URL=postgres://user:password@localhost:5432/schedule
ROOM_TYPE_TABLE=room_type
```

## Покриті сценарії

### Базові E2E-тести

- Відображення сторінки розкладу.
- Перевірка основних елементів розкладу.
- Відображення login-форми.
- Успішний login.
- Навігація до сторінки RoomType.
- Пошук/фільтрація сутностей.

### Page Object Model

Створено 3 Page Objects:

- `LoginPage`
- `RoomTypePage`
- `SchedulePage`

Кожен Page Object містить методи для роботи зі сторінкою та приховує прямі селектори від тестів.

### Складні сценарії

- CRUD через UI: створення, перегляд, редагування, видалення RoomType.
- Drag & Drop: переміщення заняття до комірки розкладу.
- Валідація форми: RoomType не може бути збережений без назви.
- Відкриття деталей заняття з розкладу.

### SQL для тестування

- Setup: створення тестового RoomType в БД.
- Verification: перевірка, що RoomType існує в БД.
- Cleanup: видалення тестових записів після тестів.

## Результати запуску

### Playwright test result

Додайте скріншот результату після запуску:

```bash
npm run test:e2e
```

![Playwright result](./screenshots/e2e-playwright-result.png)

### HTML report

Додайте скріншот HTML-звіту:

```bash
npm run test:e2e:report
```

![Playwright HTML report](./screenshots/e2e-html-report.png)

## Висновок

E2E-тести покривають базові сценарії користувача, Page Object Model, складні сценарії з CRUD і Drag & Drop, а також SQL-перевірки для підготовки, верифікації та очищення тестових даних.

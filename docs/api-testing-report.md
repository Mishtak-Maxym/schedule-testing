# API Testing Report

## Лабораторна робота №4

**Предметна область:** система управління розкладом  
**Трек:** JavaScript  
**Інструменти:** Postman + Newman, Jest + axios  
**Варіант:** 1  
**Основний ресурс:** Class  
**Додатковий ресурс:** Lesson

## 1. Структура файлів

```text
schedule-testing/
├── docs/
│   ├── checklists.md
│   ├── coverage-report.md
│   └── api-testing-report.md
├── tests/
│   └── api/
│       ├── apiClient.js
│       ├── class.api.test.js
│       ├── lesson.api.test.js
│       └── postman/
│           ├── Schedule_API_Tests.postman_collection.json
│           └── schedule-local.postman_environment.json
├── package.json
└── jest.config.js
```

## 2. Postman collection

Файл колекції:

```text
tests/api/postman/Schedule_API_Tests.postman_collection.json
```

Файл середовища:

```text
tests/api/postman/schedule-local.postman_environment.json
```

Колекція містить 3 папки:

1. **Class CRUD** — основний ресурс.
2. **Lesson dependent resource** — додатковий залежний ресурс.
3. **Negative scenarios** — негативні сценарії та перевірки помилок.

У колекції використано environment variables:

- `baseUrl`
- `classPath`
- `lessonPath`
- `classId`
- `lessonId`
- `uniqueName`

## 3. Postman checks

Колекція містить перевірки для таких сценаріїв:

### Class

- GET all classes
- POST create class
- GET class by id
- PUT update class
- DELETE class
- GET non-existing class
- POST class with empty name

### Lesson

- POST create parent class for lesson
- GET all lessons
- POST create lesson
- GET lesson by id
- DELETE lesson
- POST lesson without class dependency

## 4. Автоматизовані API-тести

Автоматизовані тести знаходяться у файлах:

```text
tests/api/class.api.test.js
tests/api/lesson.api.test.js
```

### Class API tests

Файл `class.api.test.js` містить 10 тестів:

1. GET all returns successful response.
2. POST create returns created class with identifier.
3. GET by id returns existing class after create.
4. PUT update changes existing class data.
5. GET by id after update still returns the class.
6. POST create with invalid empty name returns validation error.
7. GET by non-existing id returns 404 or client error.
8. DELETE removes existing class.
9. GET deleted class returns 404 or client error.
10. DELETE non-existing class returns 404 or client error.

### Lesson API tests

Файл `lesson.api.test.js` містить 6 тестів:

1. GET all lessons returns successful response.
2. POST create lesson with existing class dependency succeeds.
3. GET lesson by id returns created lesson.
4. POST create lesson with missing class dependency returns client error.
5. POST create lesson with non-existing class id returns client error.
6. POST create lesson with empty title returns validation error.

## 5. Запуск

Перед запуском потрібно запустити API локально або змінити `baseUrl` на реальну адресу сервера.

### Встановлення залежностей

```bash
npm install
```

### Запуск Jest + axios тестів

```bash
npm run test:api
```

### Запуск Postman/Newman тестів

```bash
npm run test:postman
```

## 6. Налаштування endpoint-ів

За замовчуванням використано:

```text
baseUrl = http://localhost:8080
classPath = /api/classes
lessonPath = /api/lessons
```

Якщо у Swagger endpoint-и мають інші назви, потрібно змінити їх у файлі:

```text
tests/api/postman/schedule-local.postman_environment.json
```

або передати змінні для Jest:

```bash
BASE_URL=http://localhost:8080 CLASS_PATH=/api/classes LESSON_PATH=/api/lessons npm run test:api
```

## 7. Що потрібно додати після запуску

Після запуску тестів потрібно додати скріншоти результатів:

- скріншот виконання Postman/Newman collection;
- скріншот виконання Jest + axios API tests;
- за потреби короткий коментар, які запити пройшли успішно, а які потребували виправлення endpoint-ів.

## 8. Висновок

Для ЛР №4 підготовлено Postman collection, Postman environment та автоматизовані API-тести для двох ресурсів: `Class` і `Lesson`. Тести покривають CRUD-операції, позитивні сценарії, негативні сценарії, перевірки статус-кодів 400/404 та роботу з залежністю `Lesson` від `Class`.

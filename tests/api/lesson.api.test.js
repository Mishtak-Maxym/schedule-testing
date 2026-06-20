const {
  client,
  classPath,
  lessonPath,
  classPayload,
  lessonPayload,
  getEntityId,
  expectSuccessStatus,
  expectClientErrorStatus
} = require('./apiClient');
const { isDbEnabled, findLessonById } = require('./dbClient');

describe('Lesson API - additional dependent resource', () => {
  let parentClassId;
  let createdLessonId;

  beforeAll(async () => {
    const response = await client.post(classPath, classPayload({ name: `QA-parent-${Date.now()}` }));
    parentClassId = getEntityId(response);

    expectSuccessStatus(response.status);
    expect(parentClassId).toBeTruthy();
  });

  test('GET all lessons returns successful response and an array-like body', async () => {
    const response = await client.get(lessonPath);

    expectSuccessStatus(response.status);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data) || Array.isArray(response.data?.content) || Array.isArray(response.data?.data)).toBe(true);
  });

  test('POST create lesson with existing class dependency succeeds and stores it in database', async () => {
    const payload = lessonPayload(parentClassId);

    const response = await client.post(lessonPath, payload);
    createdLessonId = getEntityId(response);

    expectSuccessStatus(response.status);
    expect(createdLessonId).toBeTruthy();

    if (isDbEnabled()) {
      const dbLesson = await findLessonById(createdLessonId);
      expect(dbLesson).not.toBeNull();
    }
  });

  test('GET lesson by id returns created lesson', async () => {
    const response = await client.get(`${lessonPath}/${createdLessonId}`);

    expectSuccessStatus(response.status);
    expect(getEntityId(response)).toBeTruthy();
  });

  test('POST create lesson with missing class dependency returns client error', async () => {
    const payload = lessonPayload(null, { classId: null });

    const response = await client.post(lessonPath, payload);

    expectClientErrorStatus(response.status);
  });

  test('POST create lesson with non-existing class id returns client error', async () => {
    const payload = lessonPayload(999999999, { classId: 999999999 });

    const response = await client.post(lessonPath, payload);

    expectClientErrorStatus(response.status);
  });

  test('POST create lesson with empty title returns validation error', async () => {
    const payload = lessonPayload(parentClassId, {
      name: '',
      title: ''
    });

    const response = await client.post(lessonPath, payload);

    expectClientErrorStatus(response.status);
  });

  afterAll(async () => {
    if (createdLessonId) {
      await client.delete(`${lessonPath}/${createdLessonId}`);
    }

    if (parentClassId) {
      await client.delete(`${classPath}/${parentClassId}`);
    }
  });
});

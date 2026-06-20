const {
  client,
  classPath,
  classPayload,
  getEntityId,
  expectSuccessStatus,
  expectClientErrorStatus
} = require('./apiClient');

describe('Class API - main resource CRUD', () => {
  let createdClassId;
  let classForDeleteId;

  test('GET all returns successful response and an array-like body', async () => {
    const response = await client.get(classPath);

    expectSuccessStatus(response.status);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data) || Array.isArray(response.data?.content) || Array.isArray(response.data?.data)).toBe(true);
  });

  test('POST create returns created class with identifier', async () => {
    const payload = classPayload();

    const response = await client.post(classPath, payload);
    createdClassId = getEntityId(response);

    expectSuccessStatus(response.status);
    expect(createdClassId).toBeTruthy();
  });

  test('GET by id returns existing class after create', async () => {
    const response = await client.get(`${classPath}/${createdClassId}`);

    expectSuccessStatus(response.status);
    expect(getEntityId(response)).toBeTruthy();
  });

  test('PUT update changes existing class data', async () => {
    const updatedPayload = classPayload({
      name: `QA-updated-${Date.now()}`,
      description: 'Updated by Jest API test'
    });

    const response = await client.put(`${classPath}/${createdClassId}`, updatedPayload);

    expectSuccessStatus(response.status);
    if (response.status !== 204) {
      expect(response.data).toBeDefined();
    }
  });

  test('GET by id after update still returns the class', async () => {
    const response = await client.get(`${classPath}/${createdClassId}`);

    expectSuccessStatus(response.status);
    expect(getEntityId(response)).toBeTruthy();
  });

  test('POST create with invalid empty name returns validation error', async () => {
    const invalidPayload = classPayload({ name: '' });

    const response = await client.post(classPath, invalidPayload);

    expectClientErrorStatus(response.status);
  });

  test('GET by non-existing id returns 404 or client error', async () => {
    const response = await client.get(`${classPath}/999999999`);

    expectClientErrorStatus(response.status);
  });

  test('DELETE removes existing class', async () => {
    const createResponse = await client.post(classPath, classPayload({ name: `QA-delete-${Date.now()}` }));
    classForDeleteId = getEntityId(createResponse);

    expectSuccessStatus(createResponse.status);
    expect(classForDeleteId).toBeTruthy();

    const deleteResponse = await client.delete(`${classPath}/${classForDeleteId}`);

    expectSuccessStatus(deleteResponse.status);
  });

  test('GET deleted class returns 404 or client error', async () => {
    const response = await client.get(`${classPath}/${classForDeleteId}`);

    expectClientErrorStatus(response.status);
  });

  test('DELETE non-existing class returns 404 or client error', async () => {
    const response = await client.delete(`${classPath}/999999999`);

    expectClientErrorStatus(response.status);
  });
});

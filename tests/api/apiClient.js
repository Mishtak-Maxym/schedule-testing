const axios = require('axios');

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
const classPath = process.env.CLASS_PATH || '/api/classes';
const lessonPath = process.env.LESSON_PATH || '/api/lessons';

const client = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  validateStatus: () => true
});

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function classPayload(overrides = {}) {
  const suffix = uniqueSuffix();

  return {
    name: `QA-${suffix}`,
    description: 'Class created by API automated test',
    ...overrides
  };
}

function lessonPayload(classId, overrides = {}) {
  const suffix = uniqueSuffix();

  return {
    name: `Lesson-${suffix}`,
    title: `Lesson-${suffix}`,
    subject: 'API Testing',
    classId,
    ...overrides
  };
}

function getEntityId(response) {
  return response?.data?.id ?? response?.data?._id ?? response?.data?.uuid ?? null;
}

function expectSuccessStatus(status) {
  expect([200, 201, 204]).toContain(status);
}

function expectClientErrorStatus(status) {
  expect([400, 404, 409, 422]).toContain(status);
}

module.exports = {
  client,
  classPath,
  lessonPath,
  classPayload,
  lessonPayload,
  getEntityId,
  expectSuccessStatus,
  expectClientErrorStatus
};

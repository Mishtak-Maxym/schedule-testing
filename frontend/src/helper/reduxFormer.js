function findById(items, id) {
  if (!Array.isArray(items) || id === null || id === undefined || id === '') {
    return null;
  }

  const normalizedId = String(id);
  return items.find((item) => item && String(item.id) === normalizedId) || null;
}

function setValueToTeacherForSiteHandler(teachers, teacherId, setValue) {
  const teacher = findById(teachers, teacherId);

  if (typeof setValue === 'function') {
    setValue('teacher', teacher);
  }

  return teacher;
}

function setValueToSubjectForSiteHandler(subjects, subjectId, setValue) {
  const subject = findById(subjects, subjectId);

  if (typeof setValue === 'function') {
    setValue('subject', subject);
  }

  return subject;
}

function saveTeacherForStHandler(formState = {}, teacherId) {
  const teacher = findById(formState.teachers, teacherId);

  if (!teacher) {
    return {
      ...formState,
      selectedTeacher: null,
      teacherSaved: false
    };
  }

  return {
    ...formState,
    selectedTeacher: teacher,
    teacherSaved: true
  };
}

function getScheduleForWeek(lessons, weekType) {
  if (!Array.isArray(lessons)) {
    return [];
  }

  if (weekType !== 'even' && weekType !== 'odd') {
    return [];
  }

  return lessons.filter((lesson) => lesson.weekType === weekType || lesson.weekType === 'both');
}

function selectTeacherSchedule(lessons, teacherId) {
  if (!Array.isArray(lessons) || teacherId === null || teacherId === undefined || teacherId === '') {
    return [];
  }

  const normalizedTeacherId = String(teacherId);
  return lessons.filter((lesson) => lesson && String(lesson.teacherId) === normalizedTeacherId);
}

module.exports = {
  findById,
  setValueToTeacherForSiteHandler,
  setValueToSubjectForSiteHandler,
  saveTeacherForStHandler,
  getScheduleForWeek,
  selectTeacherSchedule
};

const {
  findById,
  setValueToTeacherForSiteHandler,
  setValueToSubjectForSiteHandler,
  saveTeacherForStHandler,
  getScheduleForWeek,
  selectTeacherSchedule
} = require('./reduxFormer');

describe('reduxFormer schedule helpers', () => {
  describe('findById', () => {
    test('finds item by string id', () => {
      const items = [{ id: 't1', name: 'Teacher 1' }];

      const result = findById(items, 't1');

      expect(result).toEqual({ id: 't1', name: 'Teacher 1' });
    });

    test('finds item when id is number and searched id is string', () => {
      const items = [{ id: 12, name: 'Math' }];

      const result = findById(items, '12');

      expect(result).toEqual({ id: 12, name: 'Math' });
    });

    test('returns null when list is empty', () => {
      const items = [];

      const result = findById(items, 'unknown');

      expect(result).toBeNull();
    });

    test('returns null for null id', () => {
      const items = [{ id: 1, name: 'Item' }];

      const result = findById(items, null);

      expect(result).toBeNull();
    });
  });

  describe('teacher and subject handlers', () => {
    test('sets teacher when teacher is found', () => {
      const teachers = [{ id: 't1', fullName: 'Ivan Petrenko' }];
      const setValue = jest.fn();

      const result = setValueToTeacherForSiteHandler(teachers, 't1', setValue);

      expect(result).toEqual({ id: 't1', fullName: 'Ivan Petrenko' });
      expect(setValue).toHaveBeenCalledWith('teacher', { id: 't1', fullName: 'Ivan Petrenko' });
    });

    test('sets teacher to null when teacher is not found', () => {
      const teachers = [{ id: 't1', fullName: 'Ivan Petrenko' }];
      const setValue = jest.fn();

      const result = setValueToTeacherForSiteHandler(teachers, 'missing', setValue);

      expect(result).toBeNull();
      expect(setValue).toHaveBeenCalledWith('teacher', null);
    });

    test('sets subject when subject is found', () => {
      const subjects = [{ id: 's1', title: 'Testing' }];
      const setValue = jest.fn();

      const result = setValueToSubjectForSiteHandler(subjects, 's1', setValue);

      expect(result).toEqual({ id: 's1', title: 'Testing' });
      expect(setValue).toHaveBeenCalledWith('subject', { id: 's1', title: 'Testing' });
    });

    test('does not throw when setValue is not a function', () => {
      const subjects = [{ id: 's1', title: 'Testing' }];

      const action = () => setValueToSubjectForSiteHandler(subjects, 's1', null);

      expect(action).not.toThrow();
    });
  });

  describe('saveTeacherForStHandler', () => {
    test('saves selected teacher for existing teacher id', () => {
      const formState = {
        teachers: [{ id: 't1', fullName: 'Ivan Petrenko' }],
        selectedTeacher: null,
        teacherSaved: false
      };

      const result = saveTeacherForStHandler(formState, 't1');

      expect(result.selectedTeacher).toEqual({ id: 't1', fullName: 'Ivan Petrenko' });
      expect(result.teacherSaved).toBe(true);
    });

    test('does not save teacher for unknown teacher id', () => {
      const formState = {
        teachers: [{ id: 't1', fullName: 'Ivan Petrenko' }],
        selectedTeacher: { id: 'old' },
        teacherSaved: true
      };

      const result = saveTeacherForStHandler(formState, 'unknown');

      expect(result.selectedTeacher).toBeNull();
      expect(result.teacherSaved).toBe(false);
    });
  });

  describe('schedule filtering', () => {
    const lessons = [
      { id: 1, weekType: 'even', teacherId: 't1', subject: 'Math' },
      { id: 2, weekType: 'odd', teacherId: 't2', subject: 'English' },
      { id: 3, weekType: 'both', teacherId: 't1', subject: 'Testing' }
    ];

    test('returns even week lessons and common lessons', () => {
      const result = getScheduleForWeek(lessons, 'even');

      expect(result).toEqual([
        { id: 1, weekType: 'even', teacherId: 't1', subject: 'Math' },
        { id: 3, weekType: 'both', teacherId: 't1', subject: 'Testing' }
      ]);
    });

    test('returns odd week lessons and common lessons', () => {
      const result = getScheduleForWeek(lessons, 'odd');

      expect(result).toEqual([
        { id: 2, weekType: 'odd', teacherId: 't2', subject: 'English' },
        { id: 3, weekType: 'both', teacherId: 't1', subject: 'Testing' }
      ]);
    });

    test('returns empty array for unsupported week type', () => {
      const result = getScheduleForWeek(lessons, 'holiday');

      expect(result).toEqual([]);
    });

    test('returns empty array when lessons are null', () => {
      const result = getScheduleForWeek(null, 'even');

      expect(result).toEqual([]);
    });

    test('returns lessons for selected teacher', () => {
      const result = selectTeacherSchedule(lessons, 't1');

      expect(result).toEqual([
        { id: 1, weekType: 'even', teacherId: 't1', subject: 'Math' },
        { id: 3, weekType: 'both', teacherId: 't1', subject: 'Testing' }
      ]);
    });

    test('returns empty array for empty teacher id', () => {
      const result = selectTeacherSchedule(lessons, '');

      expect(result).toEqual([]);
    });
  });
});

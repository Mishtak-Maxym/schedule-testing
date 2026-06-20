const {
  isEmptyValue,
  setDisabledSaveButtonSemester,
  shouldAllowSaveSemester
} = require('./disableComponent');

describe('disableComponent helper', () => {
  describe('isEmptyValue', () => {
    test('returns true for null value', () => {
      const value = null;

      const result = isEmptyValue(value);

      expect(result).toBe(true);
    });

    test('returns true for empty string with spaces', () => {
      const value = '   ';

      const result = isEmptyValue(value);

      expect(result).toBe(true);
    });

    test('returns true for empty array', () => {
      const value = [];

      const result = isEmptyValue(value);

      expect(result).toBe(true);
    });

    test('returns false for non-empty object', () => {
      const value = { id: 1 };

      const result = isEmptyValue(value);

      expect(result).toBe(false);
    });
  });

  describe('setDisabledSaveButtonSemester', () => {
    test('enables save button when semester, selected groups and semester group are valid', () => {
      const data = {
        semesterId: '2024-fall',
        selectedGroups: [{ id: 1, name: 'KN-21' }],
        semesterGroup: { id: 10 }
      };

      const result = setDisabledSaveButtonSemester(data);

      expect(result).toBe(false);
    });

    test('disables save button when semester id is null', () => {
      const data = {
        semesterId: null,
        selectedGroups: [{ id: 1, name: 'KN-21' }],
        semesterGroup: { id: 10 }
      };

      const result = setDisabledSaveButtonSemester(data);

      expect(result).toBe(true);
    });

    test('disables save button when semester id is empty string', () => {
      const data = {
        semesterId: '',
        selectedGroups: [{ id: 1, name: 'KN-21' }],
        semesterGroup: { id: 10 }
      };

      const result = setDisabledSaveButtonSemester(data);

      expect(result).toBe(true);
    });

    test('disables save button when selected groups are empty', () => {
      const data = {
        semesterId: '2024-fall',
        selectedGroups: [],
        semesterGroup: { id: 10 }
      };

      const result = setDisabledSaveButtonSemester(data);

      expect(result).toBe(true);
    });

    test('disables save button when semester group is empty object', () => {
      const data = {
        semesterId: '2024-fall',
        selectedGroups: [{ id: 1, name: 'KN-21' }],
        semesterGroup: {}
      };

      const result = setDisabledSaveButtonSemester(data);

      expect(result).toBe(true);
    });

    test('allows saving for boundary case with exactly one selected group', () => {
      const data = {
        semesterId: '1',
        selectedGroups: [{ id: 1 }],
        semesterGroup: { id: 1 }
      };

      const result = shouldAllowSaveSemester(data);

      expect(result).toBe(true);
    });
  });
});

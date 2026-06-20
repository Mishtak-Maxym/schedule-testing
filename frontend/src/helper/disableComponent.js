function isEmptyValue(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

function setDisabledSaveButtonSemester(data = {}) {
  const { semesterId, selectedGroups, semesterGroup } = data;

  if (isEmptyValue(semesterId)) {
    return true;
  }

  if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) {
    return true;
  }

  if (isEmptyValue(semesterGroup)) {
    return true;
  }

  return false;
}

function shouldAllowSaveSemester(data = {}) {
  return !setDisabledSaveButtonSemester(data);
}

module.exports = {
  isEmptyValue,
  setDisabledSaveButtonSemester,
  shouldAllowSaveSemester
};

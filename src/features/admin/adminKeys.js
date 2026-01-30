export const adminKeys = {
  // Subjects
  subjects: {
    all: ['subjects', 'admin'],
    list: () => [...adminKeys.subjects.all, 'list'],
  },
  
  // Unites
  unites: {
    all: ['unites'],
    list: () => [...adminKeys.unites.all, 'list'],
  },
  
  // Departments
  departments: {
    all: ['departments'],
    list: () => [...adminKeys.departments.all, 'list'],
  },

  // Levels
  levels: {
    all: ['levels'],
    list: () => [...adminKeys.levels.all, 'list'],
  },

  // Specialties
  specialties: {
    all: ['specialties'],
    list: () => [...adminKeys.specialties.all, 'list'],
  },

  // Program Subjects
  programSubjects: {
    all: ['programSubjects'],
    list: () => [...adminKeys.programSubjects.all, 'list'],
  },
};

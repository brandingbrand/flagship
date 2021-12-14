const nx = require('./workspace.json');

const projects = Object.keys(nx.projects);
const projectScopes = projects.map((project) => ({
  name: project,
  description: `anything ${project} specific`,
}));

const ticketScopes = projects.map((name) => `${name.toUpperCase()}-`);

module.exports = {
  types: [
    { name: 'feat:     A new feature', value: 'feat' },
    { name: 'fix:      A bug fix', value: 'fix' },
    { name: 'test:     A missing test', value: 'test' },
    { name: 'perf:     A code change that purely improves performance', value: 'perf' },
    { name: 'docs:     Documentation only changes', value: 'docs' },
    {
      name: 'refactor:  A code change that neither fixes a bug nor adds a feature',
      value: 'refactor',
    },
    {
      name: 'build:  A code change that affects how a project is built',
      value: 'build',
    },
    {
      name: "chore:    Other changes that don't modify src or test files",
      value: 'chore',
    },
  ],

  scopes: [
    ...projectScopes,
    { name: 'release', description: 'for creating a release' },
    {
      name: 'repo',
      description: 'anything related to managing the repo itself',
    },
    { name: 'misc', description: 'misc stuff' },
  ],

  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: ticketScopes,
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE (lowercase) description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['ticketNumber'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  askForBreakingChangeFirst: true, // default is false
};

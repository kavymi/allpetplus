module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always'],
    'scope-enum': [
      2,
      'always',
      [
        'web',
        'backend',
        'ui',
        'shared',
        'workspace',
        'deps',
        'docs',
        'ci',
        'testing',
        'config'
      ]
    ],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ]
  }
};

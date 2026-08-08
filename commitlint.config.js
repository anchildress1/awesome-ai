export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [2, 'always', [
      'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'
    ]],
    // Blocks Title Case and SHOUTING while still allowing identifiers (OAuth2, JSDoc, API);
    // 'always lower-case' rejected those outright.
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 72],
    'subject-min-length': [2, 'always', 1],
    'header-trim': [2, 'always'],
    'body-leading-blank': [2, 'always'],
    'body-empty': [2, 'never'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always',],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 72],
    'signed-off-by': [1, 'always'],
    'trailer-exists': [1, 'always', ['Signed-off-by']]
  }
};

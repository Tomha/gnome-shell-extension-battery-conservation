module.exports = {
  '*.{json,md}': 'prettier --write',
  '*.{js,ts}': 'eslint --fix',
  '*.ts': () => 'tsc --noEmit',
}

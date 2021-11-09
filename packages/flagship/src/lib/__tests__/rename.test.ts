const rename = require('../rename');
const fs = require('../fs');
const path = require('path');
const { trueCasePathSync } =
  require('true-case-path'); // tslint:disable-line:no-implicit-dependencies

const kFileNameOld = 'OldName/test_file_OldName.js';
const kFileNameTest = 'lib/test_file.js';
const kTestContents = 'this is in FOO\n';

const testDirName = '__rename_test';
const tempRootDir = path.join(__dirname, testDirName);

function createFile(filePath: string, body: string = ''): void {
  fs.ensureFileSync(path.join(tempRootDir, filePath));
  fs.writeFileSync(path.join(tempRootDir, filePath), body);
}

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test('rename file', () => {
  createFile(kFileNameOld);
  rename.files('OldName', 'NewFile', __dirname, testDirName);

  const exist = fs.existsSync(path.join(tempRootDir, 'NewFile/test_file_NewFile.js'));
  expect(exist).toBe(true);
});

test('old file removed after rename file', () => {
  createFile(kFileNameOld);
  rename.files('OldName', 'NewFile', __dirname, testDirName);

  const oldExist = fs.existsSync(path.join(tempRootDir, kFileNameOld));
  expect(oldExist).toBe(false);
});

test('rename nested file', () => {
  createFile('lib/OldName/test_file_OldName.js');
  rename.files('OldName', 'NewFile', __dirname, testDirName);

  const exist = fs.existsSync(path.join(tempRootDir, 'lib/NewFile/test_file_NewFile.js'));
  expect(exist).toBe(true);
});

test('rename file in lowercase', () => {
  createFile('lib/oldfile/test_file_OldFile.js');
  rename.files('OldFile', 'NewFile', __dirname, testDirName);

  const isLowerCase =
    trueCasePathSync(path.join(tempRootDir, 'lib/NewFile/test_file_NewFile.js')) ===
    path.join(tempRootDir, 'lib/newfile/test_file_NewFile.js');

  expect(isLowerCase).toBe(true);
});

test('rename source code', () => {
  createFile(kFileNameTest, kTestContents);
  rename.source('FOO', 'BAR', __dirname, testDirName);

  const content = fs.readFileSync(path.join(tempRootDir, kFileNameTest)).toString();

  expect(content).toBe('this is in BAR\n');
});

test('rename source code no match', () => {
  createFile(kFileNameTest, 'this is in\n');
  rename.source('FOO', 'BAR', __dirname, testDirName);

  const content = fs.readFileSync(path.join(tempRootDir, kFileNameTest)).toString();

  expect(content).toBe('this is in\n');
});

test('rename source code in lowercase', () => {
  createFile(kFileNameTest, 'this is in foo\n');
  rename.source('FOO', 'BAR', __dirname, testDirName);

  const content = fs.readFileSync(path.join(tempRootDir, kFileNameTest)).toString();

  expect(content).toBe('this is in bar\n');
});

test("don't rename source code under Pods folder", () => {
  createFile('Pods/test_file.js', kTestContents);
  rename.source('FOO', 'BAR', __dirname, testDirName);

  const content = fs.readFileSync(path.join(tempRootDir, 'Pods/test_file.js')).toString();

  expect(content).toBe(kTestContents);
});

// Force to be treated as a module
export {};

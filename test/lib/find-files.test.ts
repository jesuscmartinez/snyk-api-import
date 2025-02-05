import * as path from 'path';

import { find } from '../../src/lib';

export function getFixturePath(fixtureName: string): string {
  return path.join(__dirname, './fixtures', fixtureName);
}
const testFixture = getFixturePath('find-files');

test('find path is empty string', async () => {
  await expect(find('')).rejects.toThrowError("Error finding files in path ''");
});

test('find path that does not exist', async () => {
  await expect(find('does-not-exist')).rejects.toThrowError(
    "Error finding files in path 'does-not-exist'",
  );
});

test('find all files in test fixture ignoring node_modules', async () => {
  // six levels deep to ensure node_modules is tested
  const { files: result } = await find(testFixture, ['node_modules'], [], 6);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'maven', 'test.txt'),
    path.join(testFixture, 'mvn', 'pom.xml'),
    path.join(testFixture, 'mvn', 'test.txt'),
  ];
  expect(result.sort()).toStrictEqual(expected.sort());
}, 5000);

test('find all files in test fixture ignoring node_modules by default', async () => {
  // six levels deep to ensure node_modules is tested
  const { files: result } = await find(testFixture, [], [], 6);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'maven', 'test.txt'),
    path.join(testFixture, 'mvn', 'pom.xml'),
    path.join(testFixture, 'mvn', 'test.txt'),
  ];
  expect(result.sort()).toStrictEqual(expected.sort());
}, 5000);

test('find all files in test fixture ignoring *.txt', async () => {
  // six levels deep to ensure node_modules is tested
  const { files: result } = await find(testFixture, ['*.txt'], [], 6);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'mvn', 'pom.xml'),
  ];
  expect(result.sort()).toStrictEqual(expected.sort());
}, 5000);

test('find all files in test fixture by filtering for *.xml', async () => {
  // six levels deep to ensure node_modules is tested
  const { files: result } = await find(testFixture, [], ['*.xml'], 6);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'mvn', 'pom.xml'),
  ];
  expect(result.sort()).toStrictEqual(expected.sort());
}, 5000);

test('find all files in test fixture but filter out specific path for mvn', async () => {
  const { files: result } = await find(testFixture, ['**/mvn/**.xml'], [], 6);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'maven', 'test.txt'),
    path.join(testFixture, 'mvn', 'test.txt'),
  ];
  expect(result.sort()).toStrictEqual(expected.sort());
}, 5000);

test.todo('Test **/folder/*.txt');

test('find pom.xml files in test fixture', async () => {
  const { files: result } = await find(testFixture, [], ['pom.xml']);
  const expected = [
    path.join(testFixture, 'maven', 'pom.xml'),
    path.join(testFixture, 'mvn', 'pom.xml'),
  ];
  expect(result.sort()).toStrictEqual(expected);
});

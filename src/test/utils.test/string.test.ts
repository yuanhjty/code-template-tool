import { assert } from 'chai';
import {
  isUpperCase,
  isLowerCase,
  isTitleCase,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toLowerCaseIfNotUpperCase,
  toTitleCaseIfNotUpperCase,
  duplicate,
  trim,
  escapeRegExpSpecialChars,
  words,
  compare,
} from '../../utils/string';

/* tslint:disable:no-unused-expression */

describe('String Utils Tests', function() {
  const testStrings = ['UPPERCASE', 'lowercase', 'Capital', 'string01'];

  function testCaseChecker(
    checker: typeof isUpperCase,
    testCases: string[],
    assertions: boolean[]
  ): void {
    describe(checker.name, function() {
      testCases.forEach((testCase: string, index: number) => {
        it(`'${testCase}' should return ${assertions[index]}`, function() {
          assert.strictEqual(checker(testCase), assertions[index]);
        });
      });
    });
  }
  testCaseChecker(isUpperCase, testStrings, [true, false, false, false]);
  testCaseChecker(isLowerCase, testStrings, [false, true, false, true]);
  testCaseChecker(isTitleCase, testStrings, [false, false, true, false]);

  function testCaseConverter(
    converter: typeof toUpperCase,
    testCases: string[],
    assertions: string[]
  ): void {
    describe(converter.name, function() {
      testCases.forEach((testCase: string, index: number) => {
        it(`${converter.name}('${testCases[index]}') should return '${assertions[index]}'`, function() {
          assert.strictEqual(converter(testCase), assertions[index]);
        });
      });
    });
  }
  testCaseConverter(toUpperCase, testStrings, ['UPPERCASE', 'LOWERCASE', 'CAPITAL', 'STRING01']);
  testCaseConverter(toLowerCase, testStrings, ['uppercase', 'lowercase', 'capital', 'string01']);
  testCaseConverter(toTitleCase, testStrings, ['Uppercase', 'Lowercase', 'Capital', 'String01']);
  testCaseConverter(toLowerCaseIfNotUpperCase, testStrings, [
    'UPPERCASE',
    'lowercase',
    'capital',
    'string01',
  ]);
  testCaseConverter(toTitleCaseIfNotUpperCase, testStrings, [
    'UPPERCASE',
    'Lowercase',
    'Capital',
    'String01',
  ]);

  describe(duplicate.name, function() {
    const str = 'Duplicate';
    const n = 3;
    const result = 'DuplicateDuplicateDuplicate';
    it(`${duplicate.name}('${str}', ${n}) should return '${result}'`, function() {
      assert.strictEqual(duplicate(str, n), result);
    });
  });

  describe(trim.name, function() {
    const baseString = 'baseString';
    const affix0 = ' ';
    const affix1 = '-';
    const affix2 = '[affix]';
    function getTestString(
      affix: string,
      nPrefix: number,
      nSuffix: number,
      base: string = baseString
    ): string {
      return `${duplicate(affix, nPrefix)}${base}${duplicate(affix, nSuffix)}`;
    }
    const testCases = [
      [getTestString(affix0, 2, 0), affix0],
      [getTestString(affix0, 0, 1), affix0],
      [getTestString(affix0, 3, 2), affix0],
      [getTestString(affix1, 1, 0), affix1],
      [getTestString(affix1, 0, 3), affix1],
      [getTestString(affix1, 1, 1), affix1],
      [getTestString(affix2, 2, 0), affix2],
      [getTestString(affix2, 0, 3), affix2],
      [getTestString(affix2, 2, 2), affix2],
    ];

    testCases.forEach((item: string[]) => {
      it(`${trim.name}('${item[0]}', '${item[1]}') should return '${baseString}'`, function() {
        assert.strictEqual(trim(item[0], item[1]), baseString);
      });
    });
  });

  describe('escapeRegExpSpecialChars', function() {
    const testCases: [string, string][] = [
      [
        'Aa1~!@#%&=_:;\'"<>,-^$.*?+|/\\[](){}',
        'Aa1~!@#%&=_:;\'"<>,-\\^\\$\\.\\*\\?\\+\\|\\/\\\\\\[\\]\\(\\)\\{\\}',
      ],
    ];

    testCases.forEach((item: [string, string]) => {
      const [input, output] = item;
      it(`escapeRegExpSpecialChars('${input}') should return ${JSON.stringify(
        output
      )}`, function() {
        assert.strictEqual(escapeRegExpSpecialChars(input), output);
      });
    });
  });

  describe('words', function() {
    const testCases: [string, string[]][] = [
      ['lowercase', ['lowercase']],
      ['UPPERCASE', ['UPPERCASE']],
      ['camelCaseIdentifier', ['camel', 'Case', 'Identifier']],
      ['PascalCaseIdentifier', ['Pascal', 'Case', 'Identifier']],
      ['PASCALCaseIdentifier', ['PASCAL', 'Case', 'Identifier']],
      ['camelCASEIdentifier', ['camel', 'CASE', 'Identifier']],
      ['camelCaseIDENTIFIER', ['camel', 'Case', 'IDENTIFIER']],

      ['camel8Case88Identifier8', ['camel8', 'Case88', 'Identifier8']],
      ['c88amelCa88seIde88ntifier', ['c88amel', 'Ca88se', 'Ide88ntifier']],
      ['888camelCaseIdentifier', ['888camel', 'Case', 'Identifier']],
      ['PA88SCALCaseID88ENTIFIER', ['PA88SCAL', 'Case', 'ID88ENTIFIER']],
      ['PASCAL88CaseIDENTIFIER88', ['PASCAL88', 'Case', 'IDENTIFIER88']],
      ['camelC88ASEIdentifier', ['camel', 'C88ASE', 'Identifier']],
      ['camelCASE88Identifier', ['camel', 'CASE88', 'Identifier']],

      ['  space space space ', ['space', 'space', 'space']],
      ['_underscore-hyphen space ', ['underscore', 'hyphen', 'space']],
      ['_Underscore-HYPHEN Space ', ['Underscore', 'HYPHEN', 'Space']],
      ['hyphen-underscore_space ', ['hyphen', 'underscore', 'space']],
    ];

    testCases.forEach((item: [string, string[]]) => {
      const [input, output] = item;
      it(`words('${input}') should return ${JSON.stringify(output)}`, function() {
        assert.deepStrictEqual(words(input), output);
      });
    });
  });

  describe(compare.name, function() {
    const testCases: [string, string, number][] = [
      ['abcd', 'abcd', 0],
      ['abcd', 'abdd', -1],
      ['abcd', 'abbd', 1],
    ];

    testCases.forEach((item: [string, string, number]) => {
      const [p1, p2, r] = item;
      it(`${compare.name}('${p1}', '${p2}) should return ${r}`, function() {
        assert.strictEqual(compare(p1, p2), r);
      });
    });
  });
});

import { assert } from 'chai';
import {
  toLowerCase,
  toUpperCase,
  toPascalCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toSnakeUpperCase,
  toSnakePascalCase,
  toKebabUpperCase,
  toKebabPascalCase,
  normalizeCase,
  checkIdentifierCase,
  convertIdentifierCase,
  convertIdentifierStyle,
  LOWER_CASE,
  UPPER_CASE,
  CAMEL_CASE,
  PASCAL_CASE,
  SNAKE_CASE,
  KEBAB_CASE,
  SNAKE_UPPER_CASE,
  SNAKE_PASCAL_CASE,
  KEBAB_UPPER_CASE,
  KEBAB_PASCAL_CASE,
  UNKNOWN,
} from '../../utils/identifier';

describe('Identifier Utils Tests', function() {
  function testCaseConverter(
    converter: typeof toCamelCase,
    testCases: { [propName: string]: string[] },
    keepUpperCase?: boolean
  ): void {
    describe(converter.name, function() {
      testCases.identifiers.forEach((identifier: string, index: number) => {
        const expectedValue = testCases[converter.name][index];
        it(`${converter.name}('${identifier}'${
          keepUpperCase ? `, ${keepUpperCase}` : ''
        }) should return '${expectedValue}'`, function() {
          assert.strictEqual(converter(identifier, keepUpperCase), expectedValue);
        });
      });
    });
  }

  const convertersNotKeepUpperCaseTestCases = {
    identifiers: ['cat', 'CAT', 'myLovelyCat', 'MYLovelyCat', 'myLOVELYCat', 'MY_LOVELY_CAT'],
    [toLowerCase.name]: ['cat', 'cat', 'mylovelycat', 'mylovelycat', 'mylovelycat', 'mylovelycat'],
    [toUpperCase.name]: ['CAT', 'CAT', 'MYLOVELYCAT', 'MYLOVELYCAT', 'MYLOVELYCAT', 'MYLOVELYCAT'],
    [toPascalCase.name]: ['Cat', 'Cat', 'MyLovelyCat', 'MyLovelyCat', 'MyLovelyCat', 'MyLovelyCat'],
    [toCamelCase.name]: ['cat', 'cat', 'myLovelyCat', 'myLovelyCat', 'myLovelyCat', 'myLovelyCat'],
    [toSnakeCase.name]: [
      'cat',
      'cat',
      'my_lovely_cat',
      'my_lovely_cat',
      'my_lovely_cat',
      'my_lovely_cat',
    ],
    [toKebabCase.name]: [
      'cat',
      'cat',
      'my-lovely-cat',
      'my-lovely-cat',
      'my-lovely-cat',
      'my-lovely-cat',
    ],
    [toSnakeUpperCase.name]: [
      'CAT',
      'CAT',
      'MY_LOVELY_CAT',
      'MY_LOVELY_CAT',
      'MY_LOVELY_CAT',
      'MY_LOVELY_CAT',
    ],
    [toSnakePascalCase.name]: [
      'Cat',
      'Cat',
      'My_Lovely_Cat',
      'My_Lovely_Cat',
      'My_Lovely_Cat',
      'My_Lovely_Cat',
    ],
    [toKebabUpperCase.name]: [
      'CAT',
      'CAT',
      'MY-LOVELY-CAT',
      'MY-LOVELY-CAT',
      'MY-LOVELY-CAT',
      'MY-LOVELY-CAT',
    ],
    [toKebabPascalCase.name]: [
      'Cat',
      'Cat',
      'My-Lovely-Cat',
      'My-Lovely-Cat',
      'My-Lovely-Cat',
      'My-Lovely-Cat',
    ],
  };
  testCaseConverter(toLowerCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toUpperCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toPascalCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toCamelCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toSnakeCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toKebabCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toSnakeUpperCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toSnakePascalCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toKebabUpperCase, convertersNotKeepUpperCaseTestCases);
  testCaseConverter(toKebabPascalCase, convertersNotKeepUpperCaseTestCases);

  const convertersKeepUpperCaseTestCases = {
    identifiers: ['cat', 'CAT', 'myLovelyCat', 'MYLovelyCat', 'myLOVELYCat', 'MY_LOVELY_CAT'],
    [toLowerCase.name]: ['cat', 'CAT', 'mylovelycat', 'MYlovelycat', 'myLOVELYcat', 'MYLOVELYCAT'],
    [toPascalCase.name]: ['Cat', 'CAT', 'MyLovelyCat', 'MYLovelyCat', 'MyLOVELYCat', 'MYLOVELYCAT'],
    [toCamelCase.name]: ['cat', 'CAT', 'myLovelyCat', 'MYLovelyCat', 'myLOVELYCat', 'MYLOVELYCAT'],
    [toSnakeCase.name]: [
      'cat',
      'CAT',
      'my_lovely_cat',
      'MY_lovely_cat',
      'my_LOVELY_cat',
      'MY_LOVELY_CAT',
    ],
    [toKebabCase.name]: [
      'cat',
      'CAT',
      'my-lovely-cat',
      'MY-lovely-cat',
      'my-LOVELY-cat',
      'MY-LOVELY-CAT',
    ],
    [toSnakePascalCase.name]: [
      'Cat',
      'CAT',
      'My_Lovely_Cat',
      'MY_Lovely_Cat',
      'My_LOVELY_Cat',
      'MY_LOVELY_CAT',
    ],
    [toKebabPascalCase.name]: [
      'Cat',
      'CAT',
      'My-Lovely-Cat',
      'MY-Lovely-Cat',
      'My-LOVELY-Cat',
      'MY-LOVELY-CAT',
    ],
  };
  testCaseConverter(toLowerCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toPascalCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toCamelCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toSnakeCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toKebabCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toSnakePascalCase, convertersKeepUpperCaseTestCases, true);
  testCaseConverter(toKebabPascalCase, convertersKeepUpperCaseTestCases, true);

  describe(normalizeCase.name, function() {
    const caseStringTestCases = [
      'camelCase',
      'camelcase',
      'CamelCase',
      'CAMELCASE',
      'camel_case',
      'Camel_Case',
      'CAMEL_CASE',
      'camel-case',
      'Camel-Case',
      'CAMEL-CASE',
      'camel case',
      'Camel Case',
      'CAMEL CASE',
    ];

    caseStringTestCases.forEach((testCase: string) => {
      it(`${normalizeCase.name}('${testCase}') should return 'CAMELCASE'`, function() {
        assert.strictEqual(normalizeCase(testCase), 'CAMELCASE');
      });
    });
  });

  describe(checkIdentifierCase.name, function() {
    const testCases = [
      ['lowercase', LOWER_CASE, 'LOWER_CASE'],
      ['UPPERCASE', UPPER_CASE, 'UPPER_CASE'],
      ['camelCase', CAMEL_CASE, 'CAMEL_CASE'],
      ['PascalCase', PASCAL_CASE, 'PASCAL_CASE'],
      ['snake_case', SNAKE_CASE, 'SNAKE_CASE'],
      ['kebab-case', KEBAB_CASE, 'KEBAB_CASE'],
      ['SNAKE_UPPER_CASE', SNAKE_UPPER_CASE, 'SNAKE_UPPER_CASE'],
      ['Snake_Pascal_Case', SNAKE_PASCAL_CASE, 'SNAKE_PASCAL_CASE'],
      ['KEBAB-UPPER-CASE', KEBAB_UPPER_CASE, 'KEBAB_UPPER_CASE'],
      ['Kebab-Pascal-Case', KEBAB_PASCAL_CASE, 'KEBAB_PASCAL_CASE'],
      ['$unknown', UNKNOWN, 'UNKNOWN'],
      ['kebab-snake_case', UNKNOWN, 'UNKNOWN'],
      ['camel-Case', UNKNOWN, 'UNKNOWN'],
      ['camel_Case', UNKNOWN, 'UNKNOWN'],
      ['Capital_lowercase', UNKNOWN, 'UNKNOWN'],
    ];

    testCases.forEach((testCase: string[]) => {
      it(`${checkIdentifierCase.name}('${testCase[0]}') should return ${testCase[2]} / ${testCase[2]}: '${testCase[1]}'`, function() {
        assert.strictEqual(checkIdentifierCase(testCase[0]), testCase[1]);
      });
    });
  });

  describe(convertIdentifierCase.name, function() {
    const testCases = [
      [LOWER_CASE, 'LOWER_CASE', 'mylovelycat'],
      [UPPER_CASE, 'UPPER_CASE', 'MYLOVELYCAT'],
      [CAMEL_CASE, 'CAMEL_CASE', 'myLovelyCat'],
      [PASCAL_CASE, 'PASCAL_CASE', 'MyLovelyCat'],
      [SNAKE_CASE, 'SNAKE_CASE', 'my_lovely_cat'],
      [KEBAB_CASE, 'KEBAB_CASE', 'my-lovely-cat'],
      [SNAKE_UPPER_CASE, 'SNAKE_UPPER_CASE', 'MY_LOVELY_CAT'],
      [SNAKE_PASCAL_CASE, 'SNAKE_PASCAL_CASE', 'My_Lovely_Cat'],
      [KEBAB_UPPER_CASE, 'KEBAB_UPPER_CASE', 'MY-LOVELY-CAT'],
      [KEBAB_PASCAL_CASE, 'KEBAB_PASCAL_CASE', 'My-Lovely-Cat'],
    ];

    testCases.forEach((testCase: string[]) => {
      it(`${convertIdentifierCase.name}('my lovely cat', ${testCase[1]}) should return '${testCase[2]}' / ${testCase[1]}: '${testCase[0]}'`, function() {
        assert.strictEqual(convertIdentifierCase('my lovely cat', testCase[0]), testCase[2]);
      });
    });
  });

  describe(convertIdentifierStyle.name, function() {
    const testCases = [
      [
        'my_Lovely-CAT',
        {
          noTransformation: true,
          case: 'camelCase',
          prefix: '$',
          suffix: '$$',
        },
        'placeholder',
        'my_Lovely-CAT',
      ],
      [
        'my_Lovely-CAT',
        {
          noTransformation: false,
          case: 'camelCase',
          prefix: '__',
          suffix: '$$',
        },
        'placeholder',
        '__myLovelyCat$$',
      ],
      [
        'my_Lovely-CAT',
        {
          noTransformation: false,
          keepUpperCase: true,
          case: 'camelCase',
          prefix: '__',
          suffix: '$$',
        },
        'placeholder',
        '__myLovelyCAT$$',
      ],
      [
        'my_Lovely-cat',
        {
          noTransformation: false,
          case: 'Snake_Pascal_Case',
          prefix: '_',
          suffix: '',
        },
        'place_holder',
        '_My_Lovely_Cat',
      ],
      [
        'myLovelyCat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '',
          suffix: '',
        },
        'Place_Holder',
        'My_Lovely_Cat',
      ],
      [
        'my lovely cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '',
          suffix: '',
        },
        'place-holder',
        'my-lovely-cat',
      ],
      [
        'my lovely cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '',
          suffix: '',
        },
        'PLACE-HOLDER',
        'MY-LOVELY-CAT',
      ],
      [
        'myLovely-cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '',
          suffix: '',
        },
        'placeholder',
        'mylovelycat',
      ],
      [
        'myLovely-cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '_',
          suffix: '',
        },
        'place$holder',
        '_myLovely-cat',
      ],
      [
        'myLovely-cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '_',
          suffix: '',
        },
        'kebab-snake_case',
        '_myLovely-cat',
      ],
      [
        'myLovely-cat',
        {
          noTransformation: false,
          case: 'auto',
          prefix: '_',
          suffix: '',
        },
        'place-Holder',
        '_myLovely-cat',
      ],
    ];

    testCases.forEach((testCase: any, index: number) => {
      it(`${index}: ${convertIdentifierStyle.name}('${testCase[0]}', ...) should be '${testCase[3]}'`, function() {
        assert.strictEqual(
          convertIdentifierStyle(testCase[0], testCase[1], testCase[2]),
          testCase[3]
        );
      });
    });
  });
});

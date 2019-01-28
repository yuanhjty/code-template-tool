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
    const wordsStrings = [
        'my lovely cat',
        'My Lovely Cat',
        'my_lovely_cat',
        'My_Lovely_Cat',
        'my-lovely-cat',
        'My-Lovely-Cat',
        'myLovelyCat',
        'MyLovelyCat',
    ];
    const wordStrings = ['cat', 'Cat'];
    const upperCaseWordsStrings = ['MY LOVELY CAT', 'MY_LOVELY_CAT', 'MY-LOVELY-CAT'];
    const upperCaseWordStrings = ['CAT'];
    const wordsStringTestCases = [
        ...wordsStrings,
        ...wordStrings,
        ...upperCaseWordsStrings,
        ...upperCaseWordStrings,
    ];

    function testCaseConverter(
        converter: typeof toCamelCase,
        testCases: string[],
        assertions: string[]
    ) {
        describe(converter.name, function() {
            testCases.forEach((identifier: string, index: number) => {
                it(`${converter.name}('${identifier}') should return '${
                    assertions[index]
                }'`, function() {
                    assert.strictEqual(converter(identifier), assertions[index]);
                });
            });
        });
    }

    testCaseConverter(toLowerCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'mylovelycat'),
        ...wordStrings.map(item => 'cat'),
        ...upperCaseWordsStrings.map(item => 'MYLOVELYCAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toUpperCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'MYLOVELYCAT'),
        ...wordStrings.map(item => 'CAT'),
        ...upperCaseWordsStrings.map(item => 'MYLOVELYCAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toPascalCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'MyLovelyCat'),
        ...wordStrings.map(item => 'Cat'),
        ...upperCaseWordsStrings.map(item => 'MYLOVELYCAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toCamelCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'myLovelyCat'),
        ...wordStrings.map(item => 'cat'),
        ...upperCaseWordsStrings.map(item => 'MYLOVELYCAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toSnakeCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'my_lovely_cat'),
        ...wordStrings.map(item => 'cat'),
        ...upperCaseWordsStrings.map(item => 'MY_LOVELY_CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toKebabCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'my-lovely-cat'),
        ...wordStrings.map(item => 'cat'),
        ...upperCaseWordsStrings.map(item => 'MY-LOVELY-CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toSnakeUpperCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'MY_LOVELY_CAT'),
        ...wordStrings.map(item => 'CAT'),
        ...upperCaseWordsStrings.map(item => 'MY_LOVELY_CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toSnakePascalCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'My_Lovely_Cat'),
        ...wordStrings.map(item => 'Cat'),
        ...upperCaseWordsStrings.map(item => 'MY_LOVELY_CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toKebabUpperCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'MY-LOVELY-CAT'),
        ...wordStrings.map(item => 'CAT'),
        ...upperCaseWordsStrings.map(item => 'MY-LOVELY-CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);
    testCaseConverter(toKebabPascalCase, wordsStringTestCases, [
        ...wordsStrings.map(item => 'My-Lovely-Cat'),
        ...wordStrings.map(item => 'Cat'),
        ...upperCaseWordsStrings.map(item => 'MY-LOVELY-CAT'),
        ...upperCaseWordStrings.map(item => 'CAT'),
    ]);

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
        const identifierTestCases = [
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

        identifierTestCases.forEach((testCase: string[]) => {
            it(`${checkIdentifierCase.name}('${testCase[0]}') should return ${testCase[2]} / ${
                testCase[2]
            }: '${testCase[1]}'`, function() {
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
            it(`${convertIdentifierCase.name}('my lovely cat', ${testCase[1]}) should return '${
                testCase[2]
            }' / ${testCase[1]}: '${testCase[0]}'`, function() {
                assert.strictEqual(
                    convertIdentifierCase('my lovely cat', testCase[0]),
                    testCase[2]
                );
            });
        });
    });

    describe(convertIdentifierStyle.name, function() {
        const testCases = [
            [
                'my_Lovely-CAT',
                {
                    rawInput: true,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
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
                    rawInput: false,
                    case: 'auto',
                    prefix: '_',
                    suffix: '',
                },
                'place-Holder',
                '_myLovely-cat',
            ],
        ];

        testCases.forEach((testCase: any, index: number) => {
            it(`${index}: ${convertIdentifierStyle.name}('${testCase[0]}', ...) should be '${
                testCase[3]
            }'`, function() {
                assert.strictEqual(
                    convertIdentifierStyle(testCase[0], testCase[1], testCase[2]),
                    testCase[3]
                );
            });
        });
    });
});

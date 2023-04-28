/* eslint-disable */
// Modules throwing error "Jest encountered an unexpected token"
const esModules = ['url-join'];
export default {
    displayName: 'shared-data-access',
    preset: '../../../jest.preset.js',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.(html|svg)$',
        },
    },
    coverageDirectory: '../../../coverage/libs/shared/data-access',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
    },
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!.*\\.mjs$|${esModules.join('|')})`,
      ],
      snapshotSerializers: [
        'jest-preset-angular/build/serializers/no-ng-attributes',
        'jest-preset-angular/build/serializers/ng-snapshot',
        'jest-preset-angular/build/serializers/html-comment',
    ],
};

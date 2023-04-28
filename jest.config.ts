import { getJestProjects } from '@nrwl/jest';

export default {
    projects: getJestProjects(),
    transform: { '^.+.(ts|mjs|js|html)$': 'jest-preset-angular' },
    transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};

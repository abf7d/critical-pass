/// <reference types="cypress" />
import { mount } from 'cypress/angular';
import 'cypress-real-events';
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable<Subject> {
            login(email: string, password: string): void;
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add('mount', mount);

//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
    console.log('Custom command example: Login', email, password);
});
Cypress.Commands.overwrite('log', message => cy.task('log', { message }));
// Cypress.Commands.add('log', (...args) => { console.log(args); });
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
addMatchImageSnapshotCommand({
    failureThreshold: 0.2,
    comparisonMethod: 'ssim',
    customDiffConfig: {
        ssim: 'fast',
    },
});

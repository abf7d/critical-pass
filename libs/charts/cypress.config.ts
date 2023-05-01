import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';

export default defineConfig({
    component: {
        ...nxComponentTestingPreset(__filename),
        setupNodeEvents(on, config) {
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
            });
        },
    },
});

import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';
import {addMatchImageSnapshotPlugin} from '@simonsmith/cypress-image-snapshot/plugin';

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
            addMatchImageSnapshotPlugin(on);    
        },
    },
});

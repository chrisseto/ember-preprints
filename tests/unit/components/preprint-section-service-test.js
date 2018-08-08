import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { makeList, setupFactoryGuy } from 'ember-data-factory-guy';
import hbs from 'htmlbars-inline-precompile';

module('Unit | Component | preprint-service-select', function(hooks) {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);


    test('open by default', async function(assert) {
        await render(hbs`
            {{#cp-panels accordion=true animate=false as |panels|}}
                {{preprint-section-service panels=panels}}
            {{/cp-panels}}
        `);

        assert.dom('[data-test-section-body="service"]').isVisible();
    });

    test('cannot be closed without being saved', async function(assert) {
        await render(hbs`
            {{#cp-panels accordion=true animate=false as |panels|}}
                {{preprint-section-service panels=panels}}
            {{/cp-panels}}
        `);

        await click('[data-test-section-toggle="service"]');
        assert.dom('[data-test-section-body="service"]').isVisible('Clicking the header doesn\'t change visibility');

        await click('[data-test-section-save="service"]');
        assert.dom('[data-test-section-body="service"]').isNotVisible('Submitting closes the panel');

        await click('[data-test-section-toggle="service"]');
        assert.dom('[data-test-section-body="service"]').isVisible('Can be re-opened');
    });

    test('discard button', async function(assert) {
        this.set('providers', makeList('preprint-provider', 10));

        await render(hbs`
            {{#cp-panels accordion=true animate=false as |panels|}}
                {{preprint-section-service provider=false panels=panels providers=providers}}
            {{/cp-panels}}
        `);

        assert.dom('[data-test-section-discard="service"]').isDisabled('Discard is disabled by default');

        // Save and re-open
        await click('[data-test-section-save="service"]');
        await click('[data-test-section-toggle="service"]');

        assert.dom('[data-test-section-discard="service"]').isDisabled('Discard is still disabled');

        await click(`[data-test-service-option-id="${this.providers[0].id}"]`);
        assert.dom(`[data-test-service-option-id="${this.providers[0].id}"][data-test-service-option-selected="true"]`).exists('Option 1 is now selected');
        assert.dom('[data-test-section-discard="service"]').isNotDisabled('Changing the selection enabled discard');

        // Clicking discard, discards pending changes
        await click('[data-test-section-discard="service"]');
        assert.dom('[data-test-service-option-id="1"][data-test-service-option-selected="true"]').doesNotExist('Changes have been discarded');
        assert.dom('[data-test-section-discard="service"]').isDisabled('Discard is disabled again');
    });

    // 'discard disabled is when no service selected'
    // 'arrows not shown when all services fit on page'
    // 'arrows shown when services overflow page'
    // 'selecting a service does not scroll to the first page'
});

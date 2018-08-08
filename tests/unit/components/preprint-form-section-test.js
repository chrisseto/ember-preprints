import { module } from 'qunit';
// import { module, test } from 'qunit';

import test from 'ember-sinon-qunit/test-support/test';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
// import { makeList, setupFactoryGuy } from 'ember-data-factory-guy';
import hbs from 'htmlbars-inline-precompile';

module('Unit | Component | preprint-form-section', function(hooks) {
    setupRenderingTest(hooks);

    test('Cannot close', async function(assert) {
        this.set('callback', this.stub());

        await render(hbs`
            {{#cp-panels accordion=true animate=false as |panels|}}
                {{preprint-form-section 'unittest' panels open=true onOpenFail=stub}}
            {{/cp-panels}}
        `);

        assert.dom('[data-test-section-body="unittest"]').isVisible('Body is shown when open=true');

        await click('[data-test-section-toggle="unittest"]');

        assert.dom('[data-test-section-body="unittest"]').isVisible('Body is still visible');

        assert.notOk(this.callback.called, 'onOpenFail not called on close failure');
    });

    test('Can expand', async function(assert) {
        this.set('callback', this.stub());

        await render(hbs`
            {{#cp-panels accordion=true animate=false as |panels|}}
                {{panels.panel open=true}}
                {{preprint-form-section 'unittest' panels open=false isValid=true onOpenFail=stub}}
            {{/cp-panels}}
        `);

        assert.dom('[data-test-section-body="unittest"]').isNotVisible('Body is not shown when open=false');

        await click('[data-test-section-toggle="unittest"]');
        await click('[data-test-section-toggle="unittest"]');

        assert.dom('[data-test-section-body="unittest"]').isVisible('Body is visible on click');

        assert.notOk(this.callback.called, 'onOpenFail not called on open');
    });
});


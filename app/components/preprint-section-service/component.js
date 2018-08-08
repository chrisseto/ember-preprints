import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';

export default class ServiceSection extends Component {
    @service panelActions

    providers = [];
    savedProvider = undefined;
    _selectedProvider = undefined;
    hasUpload = false;

    @computed('savedProvider', '_selectedProvider')
    get selectedProvider() {
        return this.get('_selectedProvider') || this.get('savedProvider');
    }

    @computed('savedProvider', '_selectedProvider')
    get selectedProvider() {
        return this.get('_selectedProvider') || this.get('savedProvider');
    }

    get isOpen() {
        return this.get('panelActions.state.section-provider.isOpen');
    }

    // constructor() {

    // }

    didReceiveAttrs() {
        // super.didReceiveAttrs(...arguments);

        if (!this.selectedProvider && this.providers && this.providers.length > 0) {
            this.set('_selectedProvider', this.providers[0]);
        }
    }

    @action
    toggle(toggleComponent) {
        if (this.isOpen && !this.savedProvider) {
            return;
        }

        if (!this.isOpen && this.hasUpload) {
            return;
        }

        toggleComponent.args.named['on-click'].inner();
    }

    @action
    selectProvider(provider) {
        this.set('_selectedProvider', provider);
    }

    @action
    save() {
        this.get('panelActions').toggle('section-provider');
        this.set('savedProvider', this.get('selectedProvider'));
    }

    @action
    discard() {
        this.set('_selectedProvider', undefined);
    }
}

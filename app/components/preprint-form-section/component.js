import Component from '@ember/component';
import { assert } from '@ember/debug';
import { service } from '@ember-decorators/service';
import { action, computed } from '@ember-decorators/object';

export default class PreprintFormSection extends Component {
    static positionalParams = ['name', 'panels'];

    @service panelActions

    // canOpen
    // isValid
    // body
    // preview
    // open
    // onOpenFail

    everOpened = false;

    @computed
    get isOpen() {
        return this.get(`panelActions.state.section-${this.get('name')}.isOpen`);
    }

    @computed
    get sectionName() {
        return `section-${this.get('name')}`;
    }

    @computed
    get showPreview() {
        return this.get('everOpened') || this.get('isValid');
    }

    onOpenFail() {
        assert(`Expected 'onOpenFail' closure action to be passed in to ${this.toString()}`);
    }

    @action
    toggle(toggleComponent) {
        if (this.get('isOpen')) {
            return;
        }

        if (!this.get('canOpen')) {
            return;
        }

        toggleComponent.args.named['on-click'].inner();
        // this.panelActions.toggle(`section-${this.name}`);
    }
}


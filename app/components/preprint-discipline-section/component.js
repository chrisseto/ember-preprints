import Component from '@ember/component';
// import { computed } from '@ember/object';
// import { inject as service } from '@ember/service';

export class DisciplineState {
    get isValid() {
        return this.disciplines.length > 0;
    }

    constructor() {
        this.disciplines = [];
    }
}

export default class DisciplineSection extends Component {
    constructor() {
        super(...arguments);
        this.name = 'discipline';
        this.internalState = new DisciplineState();
    }
}

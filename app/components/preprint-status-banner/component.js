import Ember from 'ember';
const {
    computed,
} = Ember;

const pendingStatusPreText = 'not publicly available or searchable until approved by a moderator'
const pendingStatusPostText ='publicly available and searchable but is subject to removal by a moderator';

const acceptedStatusText = 'publicly available and searchable'
const rejectedStatusText = 'not publicly available or searchable'

export default Ember.Component.extend({
    classNames: ['preprint-status-component'],
    classNameBindings: [
        'isPendingPre:preprint-status-pending-pre:preprint-status-pending-post',
        'isAccepted:preprint-status-accepted:',
        'isRejected:preprint-status-rejected:',
    ],
    attributeBindings: ['hidden'],

    hidden: computed('model.provider.reviewsWorkflow', function() {
        return this.get('model.provider.reviewsWorkflow') === 'none';
    }),

    init() {
        this._super(...arguments);
        this.set('model.reviewsState', 'accepted');
        this.set('model.provider.reviewsWorkflow', 'post-moderation');
    },

    bannerContent: computed('isPre', 'isPending', 'isRejected', 'isAccepted', function() {
        if (this.get('isPending')) {
            if (this.get('isPre')) {
                return pendingStatusPreText;
            }
            return pendingStatusPostText;
        } else if (this.get('isAccepted')) {
            return acceptedStatusText;
        } else if (this.get('isRejected')) {
            return rejectedStatusText;
        }
    }),

    isPre: computed('model.provider.reviewsWorkflow', function () {
        return this.get('model.provider.reviewsWorkflow').toLowerCase() === 'pre-moderation';
    }),

    isPendingPre: computed('isPending', 'isPre', function() {
        return this.get('isPending') && this.get('isPre') ;
    }),

    isPending: computed('model.reviewsState', function() {
        return this.get('model.reviewsState') === 'pending';
    }),
    isAccepted: computed('model.reviewsState', function() {
        return this.get('model.reviewsState') === 'accepted';
    }),
    isRejected: computed('model.reviewsState', function() {
        return this.get('model.reviewsState') === 'rejected';
    }),

});

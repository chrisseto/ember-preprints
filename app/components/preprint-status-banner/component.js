import Ember from 'ember';
const {
    computed,
} = Ember;

const messagePendingPre = 'components.preprint-status-banner.message.pending_pre';
const messagePendingPost ='components.preprint-status-banner.message.pending_post';
const messageAccepted = 'components.preprint-status-banner.message.accepted';
const messageRejected = 'components.preprint-status-banner.message.rejected';

const statusPending = 'components.preprint-status-banner.pending';
const statusAccepted = 'components.preprint-status-banner.accepted';
const statusRejected = 'components.preprint-status-banner.rejected';

const workflowPre = 'components.preprint-status-banner.pre_moderation';
const workflowPost = 'components.preprint-status-banner.post_moderation';

const iconPending = 'fa-hourglass-o';
const iconAccepted = 'fa-check-circle-o';
const iconRejected = 'fa-times-circle-o';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),

    // translations
    labelModeratorFeedback: 'components.preprint-status-banner.feedback.moderator_feedback',
    moderator: 'components.preprint-status-banner.feedback.moderator',
    feedbackBaseMessage: 'components.preprint-status-banner.feedback.base',
    baseMessage: 'components.preprint-status-banner.message.base',

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

    reviewerComment: '',
    moderatorName: '',

    init() {
        this._super(...arguments);

        let _this = this;
        this.get('model.reviewLogs').then(function(reviewLogs) {
            let firstLog = reviewLogs.toArray()[0];
            _this.set('reviewerComment', firstLog.get('comment'));

            firstLog.get('creator').then(function(user) {
                _this.set('moderatorName', user.get('fullName'));
            })
        })
    },

    bannerContent: computed('isPre', 'isPending', 'isRejected', 'isAccepted', function() {
        if (this.get('isPending')) {
            if (this.get('isPre')) {
                return messagePendingPre;
            }
            return messagePendingPost;
        } else if (this.get('isAccepted')) {
            return messageAccepted;
        } else if (this.get('isRejected')) {
            return messageRejected;
        }
    }),

    status: computed('isPending', 'isRejected', 'isAccepted', function() {
        if (this.get('isPending')) {
            return statusPending;
        } else if (this.get('isAccepted')) {
            return statusAccepted;
        } else if (this.get('isRejected')) {
            return statusRejected;
        }
    }),

    icon: computed('isPending', 'isRejected', 'isAccepted', function() {
        if (this.get('isPending')) {
            return iconPending;
        } else if (this.get('isAccepted')) {
            return iconAccepted;
        } else if (this.get('isRejected')) {
            return iconRejected;
        }
    }),

    workflow: computed('isPre', function () {
        if (this.get('isPre')) {
            return workflowPre;
        }
        return workflowPost;
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

import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import EmberRouter from '@ember/routing/router';

import config from 'ember-get-config';

const Router = EmberRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL,
    metrics: service(),
    theme: service(),
    session: service(),

    didTransition() {
        this._super(...arguments);
        this._trackPage();
    },

    _trackPage() {
        run.scheduleOnce('afterRender', this, () => {
            // Tracks page with custom parameters
            // authenticated => if the user is logged in or not
            // isPublic      => if the resource the user is viewing is public or private.
            //                  n/a is used for pages like discover and index
            // page          => the name of the current page
            // resource      => what resource the user is on. Ex node, preprint, registry.
            // title         => the current route name
            const {
                authenticated,
                isPublic,
                resource,
            } = config.metricsAdapters[0].dimensions;

            const page = document.location.pathname;
            const title = this.getWithDefault('currentRouteName', 'unknown');
            const isAuthenticated = this.get('session.isAuthenticated');
            const publicType = title.endsWith('content.index') ? 'public' : 'n/a';
            const modelType = title.endsWith('content.index') ? 'preprint' : 'n/a';

            this.get('metrics').trackPage({
                [authenticated]: isAuthenticated ? 'Logged in' : 'Logged out',
                [isPublic]: publicType,
                page,
                [resource]: modelType,
                title,
            });
            this.set('theme.currentLocation', window.location.href);
        });
    },
});

// eslint-disable-next-line array-callback-return
Router.map(function() {
    this.route('page-not-found', { path: '/*bad_url' });
    if (window.isProviderDomain) {
        this.route('index', { path: '/' });
        this.route('submit');
        this.route('submit2');
        this.route('discover');
        this.route('page-not-found');
        this.route('forbidden');
        this.route('resource-deleted');
    } else {
        this.route('index', { path: 'preprints' });
        this.route('submit', { path: 'preprints/submit' });
        this.route('submit2', { path: 'preprints/submit2' });
        this.route('discover', { path: 'preprints/discover' });
        this.route('provider', { path: 'preprints/:slug' }, function () {
            this.route('content', { path: '/:preprint_id' }, function() {
                this.route('edit');
            });
            this.route('discover');
            this.route('submit');
            this.route('submit2');
        });
        this.route('page-not-found', { path: 'preprints/page-not-found' });
        this.route('forbidden', { path: 'preprints/forbidden' });
        this.route('resource-deleted', { path: 'preprints/resource-deleted' });
    }

    this.route('content', { path: '/:preprint_id' }, function() {
        this.route('edit');
    });
});

export default Router;

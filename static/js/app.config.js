(function() {
  'use strict';

  angular.module('forum')
  .config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
    .state({
      name: 'main',
      url: '/',
      component: 'mainForum'
    })
    .state({
      name: 'singlepost',
      url: '/posts/:id',
      component: 'singlePost'
    })
    .state({
      name: 'editpost',
      url: '/posts/:editID/edit',
      component: 'editPost'
    })
  }

}());

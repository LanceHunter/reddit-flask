(function() {
  'use strict'


  angular.module('forum')
    .component('mainForum', {
      controller: controller,
      template:
      `
        <nav class="navbar navbar-default">
          <div class="container">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="/">Reddit Clone</a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            </div>
          </div>
        </nav>

        <main class="container">

          <div class="pull-right">
            <p><a class="btn btn-info" ng-click="$ctrl.newPostStart()">New Post</a></p>
          </div>

          <ul class="nav nav-pills">
            <li role="presentation" class="active">
              <input type="search" class="form-control input-sm search-form" placeholder="Filter" ng-model="$ctrl.theFilter">
            </li>
            <li class="dropdown" ng-init="sort='vote_count'; sortName='Votes'">
              <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Sort By {{sortName}}<span class="caret"></span></a>
                <ul class="dropdown-menu">
                  <li><a ng-click="sort='vote_count'; sortName='Votes';">Votes</a></li>
                  <li><a ng-click="sort='created_at'; sortName='Date';">Date</a></li>
                  <li><a ng-click="sort='title'; sortName='Title';">Title</a></li>
                </ul>
            </li>
          </ul>

          <div class="row" ng-if="$ctrl.newPostTime">

            <div class="col-md-8">
              <form name="$ctrl.newPostForm" ng-submit="$ctrl.newPostFunction()" novalidate>
                <div ng-class="{ 'has-error': $ctrl.newPostForm.title.$invalid && !$ctrl.newPostForm.title.$pristine }">
                  <label for="title">Title</label>
                  <input id="title" name="title" class="form-control" ng-model="$ctrl.newPost.title" required>
                  <span ng-show="$ctrl.newPostForm.title.$invalid && !$ctrl.newPostForm.title.$pristine">Title is required.</span>
                </div>
                <div ng-class="{ 'has-error': $ctrl.newPostForm.body.$invalid && !$ctrl.newPostForm.body.$pristine }">
                  <label for="body">Body</label>
                  <textarea id="body" name="body" class="form-control" ng-model="$ctrl.newPost.body" required></textarea>
                  <span ng-show="$ctrl.newPostForm.body.$invalid && !$ctrl.newPostForm.body.$pristine">Body is required.</span>
                </div>
                <div ng-class="{ 'has-error': $ctrl.newPostForm.author.$invalid && !$ctrl.newPostForm.author.$pristine }">
                  <label for="author">Author</label>
                  <input id="author" name="author" class="form-control" ng-model="$ctrl.newPost.author" required>
                  <span ng-show="$ctrl.newPostForm.author.$invalid && !$ctrl.newPostForm.author.$pristine">Author is required.</span>
                </div>
                <div ng-class="{ 'has-error': $ctrl.newPostForm.image_url.$invalid && !$ctrl.newPostForm.image_url.$pristine }">
                  <label for="image-url">Image URL</label>
                  <input type="url" id="image-url" name="image_url" class="form-control" ng-model="$ctrl.newPost.image_url" required>
                  <span ng-show="$ctrl.newPostForm.image_url.$invalid && !$ctrl.newPostForm.image_url.$pristine">Image URL is required and must be valid url.</span>
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-primary" ng-disabled="$ctrl.newPostForm.$invalid">
                    Create Post
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="row" ng-repeat="post in $ctrl.posts | filter: $ctrl.theFilter | orderBy:sort">
            <div class="col-md-12">

              <div class="well">
                <div class="media-left">
                  <img class="media-object" ng-src="{{post.image_url}}">
                  <a ui-sref="editpost({editID: post.id})">edit</a>
                </div>
                <div class="media-body">
                  <h4 class="media-heading">
                    <a ui-sref="singlepost({id: {{post.id}}})">{{post.title}}</a>
                    |
                    <a ng-click="$ctrl.upVote(post)"><i class="glyphicon glyphicon-arrow-up"></i></a>
                    <a ng-click="$ctrl.downVote(post)"><i class="glyphicon glyphicon-arrow-down"></i></a>
                    {{post.vote_count}}
                  </h4>
                  <div class="text-right">
                    {{post.author}}
                  </div>
                  <p>
                    {{post.body}}
                  </p>
                  <div>
                    <time am-time-ago="post.created_at"></time>
                    |
                    <i class="glyphicon glyphicon-comment"></i>
                    <a ng-click="$ctrl.seeCommentsToggle(event, post)">
                      <ng-pluralize count="post.comments.length"
                        when="{'one': '{{post.comments.length}} Comment',
                               'other' : '{{post.comments.length}} Comments'}">
                      </ng-pluralize>
                    </a>
                  </div>
                  <div class="row" ng-if="post.seeComments == true">
                    <div class="col-xs-offset-1 col-xs-10">
                      <hr>
                      <p ng-repeat="comment in post.comments">
                        {{comment.content}}
                      </p>
                      <form class="form-inline" ng-submit="$ctrl.postComment(post)">
                        <div class="form-group">
                          <input class="form-control" ng-model="post.newComment">
                        </div>
                        <div class="form-group">
                          <input type="submit" class="btn btn-primary">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </main>
    `
    })

    controller.$inject = ['$http'];

    function controller($http) {
      const vm = this

      vm.$onInit = function () {
        vm.newPostTime = false;
        $http.get('/api/posts')
        .then((data) => {
          console.log(data);
          vm.posts = data.data;
          vm.posts.forEach((post) => {
            post.seeComments = false;
          })
        })
        .catch((err) => {
          console.log('Error fetching data - ', err);
        })
      }
      vm.newPostStart = function newPostStart() {
        if (vm.newPostTime) {
          vm.newPostTime = false;
        } else {
          vm.newPostTime = true;
        }
      }

      vm.seeCommentsToggle = function seeCommentsToggle(e, post) {
        if (post.seeComments) {
          post.seeComments = false;
        } else {
          post.seeComments = true;
        }
      }

      vm.upVote = function upVote(post) {
        $http.post(`/api/posts/${post.id}/votes`)
        .then((data) => {
          post.vote_count = data.data.vote_count;
        })
        .catch((err) => {
          console.log('Error adding vote - ', err);
        })
      }

      vm.downVote = function downVote(post) {
        if (post.vote_count > 0) {
          $http.delete(`/api/posts/${post.id}/votes`)
          .then((data) => {
            post.vote_count = data.data.vote_count;
          })
          .catch((err) => {
            console.log('Error removing vote - ', err);
          })
        }
      }

      vm.newPostFunction = function newPostFunction() {
        vm.newPost.created_at = new Date();
        vm.newPost.vote_count = 0;
        vm.newPost.comments = [];
        $http.post('/api/posts', vm.newPost)
        .then((data) => {
          console.log(data);
          data.data.comments = [];
          vm.posts.push(data.data);
          delete vm.newPost;
          vm.newPostTime = false;
        })
        .catch((err) => {
          console.log('Error making post - ', err);
        })
      }

      vm.postComment = function postComment(post) {
        console.log(post.newComment);
        let newComment = {
          content : post.newComment,
          created_at : new Date()
        };
        $http.post(`/api/posts/${post.id}/comments`, newComment)
        .then((reply) => {
          console.log(reply);
          post.comments.push(reply.data);
          delete post.newComment;
        })
        .catch((err) => {
          console.log('Error adding commment - ', err);
        })
      }

    }


}());

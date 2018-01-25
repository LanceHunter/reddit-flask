(function() {
  'use strict'


  angular.module('forum')
    .component('singlePost', {
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
          <p><a class="btn btn-info" ui-sref="editpost({editID: $ctrl.post.id})">Edit Post</a></p>
        </div>


          <div class="row">
            <div class="col-md-12">

              <div class="well">
                <div class="media-left">
                  <img class="media-object" ng-src="{{$ctrl.post.image_url}}">
                  <a ui-sref="editpost({editID: $ctrl.post.id})">edit</a>
                </div>
                <div class="media-body">
                  <h4 class="media-heading">
                    <a ui-sref="singlepost({{$ctrl.post.id}})">{{$ctrl.post.title}}</a>
                    |
                    <a ng-click="$ctrl.upVote()"><i class="glyphicon glyphicon-arrow-up"></i></a>
                    <a ng-click="$ctrl.downVote()"><i class="glyphicon glyphicon-arrow-down"></i></a>
                    {{$ctrl.post.vote_count}}
                  </h4>
                  <div class="text-right">
                    {{$ctrl.post.author}}
                  </div>
                  <p>
                    {{$ctrl.post.body}}
                  </p>
                  <div>
                    <time am-time-ago="$ctrl.post.created_at"></time>
                    |
                    <i class="glyphicon glyphicon-comment"></i>
                    <a ng-click="$ctrl.seeCommentsToggle()">
                      <ng-pluralize count="$ctrl.post.comments.length"
                        when="{'one': '{{$ctrl.post.comments.length}} Comment',
                               'other' : '{{$ctrl.post.comments.length}} Comments'}">
                      </ng-pluralize>
                    </a>
                  </div>
                  <div class="row" ng-if="$ctrl.post.seeComments == true">
                    <div class="col-xs-offset-1 col-xs-10">
                      <hr>
                      <p ng-repeat="comment in $ctrl.post.comments">
                        {{comment.content}}
                      </p>
                      <form class="form-inline" ng-submit="$ctrl.postComment()">
                        <div class="form-group">
                          <input class="form-control" ng-model="$ctrl.post.newComment">
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

    controller.$inject = ['$http', '$stateParams'];

    function controller($http, $stateParams) {
      const vm = this

      vm.$onInit = function () {
        console.log('The $stateParams', $stateParams.id);
        $http.get(`/api/posts/${$stateParams.id}`)
        .then((reply) => {
          console.log(reply.data);
          vm.post = reply.data;
          vm.post.seeComments = false;
          return $http.get(`/api/posts/${$stateParams.id}/comments`);
        })
        .then((reply) => {
          vm.post.comments = reply.data;
        })
        .catch((err) => {
          console.log('Error fetching data - ', err);
        })
      }

      vm.seeCommentsToggle = function seeCommentsToggle() {
        if (vm.post.seeComments) {
          vm.post.seeComments = false;
        } else {
          vm.post.seeComments = true;
        }
      }

      vm.upVote = function upVote() {
        $http.post(`/api/posts/${vm.post.id}/votes`)
        .then((data) => {
          vm.post.vote_count = data.data.vote_count;
        })
        .catch((err) => {
          console.log('Error adding vote - ', err);
        })
      }

      vm.downVote = function downVote() {
        if (vm.post.vote_count > 0) {
          $http.delete(`/api/posts/${vm.post.id}/votes`)
          .then((data) => {
            vm.post.vote_count = data.data.vote_count;
          })
          .catch((err) => {
            console.log('Error removing vote - ', err);
          })
        }
      }

      vm.postComment = function postComment(post) {
        console.log(vm.post.newComment);
        let newComment = {
          content : vm.post.newComment,
          created_at : new Date()
        };
        $http.post(`/api/posts/${vm.post.id}/comments`, newComment)
        .then((reply) => {
          console.log(reply);
          vm.post.comments.push(reply.data);
          delete vm.post.newComment;
        })
        .catch((err) => {
          console.log('Error adding commment - ', err);
        })
      }


    }


}());

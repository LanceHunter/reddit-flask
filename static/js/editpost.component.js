(function() {
  'use strict'


  angular.module('forum')
    .component('editPost', {
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


        <div class="row">
          <h1>{{$ctrl.post.title}}</h1>
          <div class="col-md-8">
            <form name="$ctrl.editPostForm" ng-submit="$ctrl.editPostFunction()" novalidate>
              <div ng-class="{ 'has-error': $ctrl.editPostForm.title.$invalid && !$ctrl.newPostForm.title.$pristine }">
                <label for="title">Title</label>
                <input id="title" name="title" class="form-control" ng-model="$ctrl.editPost.title" required>
                <span ng-show="$ctrl.editPostForm.title.$invalid && !$ctrl.editPostForm.title.$pristine">Title is required.</span>
              </div>
              <div ng-class="{ 'has-error': $ctrl.editPostForm.body.$invalid && !$ctrl.editPostForm.body.$pristine }">
                <label for="body">Body</label>
                <textarea id="body" name="body" class="form-control" ng-model="$ctrl.editPost.body" required></textarea>
                <span ng-show="$ctrl.editPostForm.body.$invalid && !$ctrl.editPostForm.body.$pristine">Body is required.</span>
              </div>
              <div ng-class="{ 'has-error': $ctrl.editPostForm.author.$invalid && !$ctrl.editPostForm.author.$pristine }">
                <label for="author">Author</label>
                <input id="author" name="author" class="form-control" ng-model="$ctrl.editPost.author" required>
                <span ng-show="$ctrl.editPostForm.author.$invalid && !$ctrl.editPostForm.author.$pristine">Author is required.</span>
              </div>
              <div ng-class="{ 'has-error': $ctrl.editPostForm.image_url.$invalid && !$ctrl.editPostForm.image_url.$pristine }">
                <label for="image-url">Image URL</label>
                <input type="url" id="image-url" name="image_url" class="form-control" ng-model="$ctrl.editPost.image_url" required>
                <span ng-show="$ctrl.editPostForm.image_url.$invalid && !$ctrl.editPostForm.image_url.$pristine">Image URL is required and must be valid url.</span>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary" ng-disabled="$ctrl.editPostForm.$invalid">
                  Update Post
                </button>
                <button class="btn btn-danger" ng-click="$ctrl.deletePost()">
                  Delete Post
                </button>
              </div>
            </form>
          </div>
        </div>

        </main>



    `
    })

    controller.$inject = ['$http', '$stateParams', '$state'];


    function controller($http, $stateParams, $state) {
      const vm = this

      vm.$onInit = function () {
        console.log('I see you');
        $http.get(`/api/posts/${$stateParams.editID}`)
        .then((reply) => {
          console.log(`Here's the reply from the initial page load - `, reply.data);
          vm.post = reply.data;
          vm.editPost = reply.data;
        })
        .catch((err) => {
          console.log('Error fetching data - ', err);
        })
      }

      vm.deletePost = function deletePost() {
        $http.delete(`/api/posts/${vm.post.id}`)
        .then((reply) => {
          console.log('Post deleted - ', reply);
          $state.go('main');
        })
      }

      vm.editPostFunction = function editPostFunction() {
        console.log(`Here's the update data we're sending - `, vm.editPost);
        $http.patch(`/api/posts/${vm.post.id}`, vm.editPost)
        .then((reply) => {
          console.log('Post updated, reply was - ', reply);
          vm.post = reply.data;
          $state.go('main');
        })
        .catch((err) => {
          console.log('Error updating post - ', err);
        })
      }


    }


}());

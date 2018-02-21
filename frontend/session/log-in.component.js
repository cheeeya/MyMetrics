angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function($http) {

      this.sendUser = () => {
        console.log(this.user);
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(res => console.log(res));
      };
    }
  });


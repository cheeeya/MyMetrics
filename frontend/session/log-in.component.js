angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'session/log-in.template.html',
    controller: function(UserService, $scope, $http, $window) {
      this.loading = false;

      this.sendUser = () => {
        this.loading = true;        
        this.error = null;
        
        $http({
          method: 'POST',
          url: '/api/sessions',
          data: this.user
        }).then(
          res => {
          this.loading = false;    
          UserService.setStore(res.data);
          if (res.data.isDoctor) {
            $window.location.href = '#!/doctorview';
          } else {
            $window.location.href = '#!/patientview';
          }
        },
          err => {
            this.loading = false;            
            this.error = err.data.message;
          }
        );
      };

      this.user = {};

      this.handleDoctor = (e) => {
        e.preventDefault();
        this.demoLogin('email', "EddyShinMd@ucsf.edu", (
          () => this.demoLogin('password', 'password', (
            () => this.sendUser()
          ))
        ));
      };

      this.handlePatient = (e) => {
        e.preventDefault();
        this.demoLogin('email', "lawrenceguintu@gmail.com", (
          () => this.demoLogin('password', 'password', (
            () => this.sendUser()
          ))
        ));
      };

      this.demoLogin = (field, DemoUser, cb) => {
        let button = document.getElementById("login-button");
        let patientDemo = document.getElementById("demo-button1");
        let doctorDemo = document.getElementById("demo-button2");

        let emailInput = document.getElementById("email-input");
        let pwInput = document.getElementById("password-input");

        emailInput.setAttribute("disabled", "disabled");
        pwInput.setAttribute("disabled", "disabled");
        button.setAttribute("disabled", "disabled");
        patientDemo.setAttribute("disabled", "disabled");
        doctorDemo.setAttribute("disabled", "disabled");
        let textToType = "";
        const typing = () => {
          textToType = DemoUser.substring(0, textToType.length + 1);
          this.user[field] = textToType;
          if (textToType.length === DemoUser.length) {
            setTimeout(() => cb(), 65);
          } else {
            setTimeout(() => typing(), 65);
          }
          $scope.$applyAsync();
        };
        typing();
      };

    }
  });


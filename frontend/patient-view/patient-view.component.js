
angular.
  module('patientView').
  component('patientView', {
    templateUrl: 'patient-view/patient-view.template.html',
    controller: function ($routeParams, $http, UserService, $window) {

      this.$onInit = () => {
        this.patient = JSON.parse(UserService.getStore());
          
        $http({
          method: 'GET',
          url: `/api/users/${this.patient.id}`
        }).then((res) => {
          this.patient = res.data;
          if (new Date() < this.patient.nextAppt) {
            // MIGHT HAVE TO CONVERT FROM MILLISECONDS TO DATE
            this.nextAppt = this.patient.nextAppt;
          }
          this.patient.symptoms = [];

          createChart(this.patient);

          console.log(res.data.weightLog[0][0]);
          console.log(new Date(
            new Date().
            setHours(0, 0, 0, 0)).
            setFullYear(this.date.getFullYear(), 
            this.date.getMonth(), 
            this.date.getDate()
          ));

          let today = new Date(
            new Date().setHours(0, 0, 0, 0)).
            setFullYear(
              this.date.getFullYear(),
              this.date.getMonth(),
              this.date.getDate()
            );

          this.patient.weightLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.weight = values[1];
            }
          });

          this.patient.sodiumLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.sodium = values[1];
            }
          });

          this.patient.fluidLog.forEach((values, index) => {
            if (new Date(values[0]) === today) {
              this.fluid = values[1];
            }
          });
        });
      };

      this.date = new Date();
      this.nextAppt = undefined;

      this.updatePatient = () => {
        this.patient.date = new Date(
          new Date().setHours(0, 0, 0, 0)).
          setFullYear(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          );

        return ($http({
          method: "PUT",
          url: `/api/users/${this.patient.id}`,
          data: { userInfo: this.patient }
        }).then(
          r => {
            createChart(r.data);
          },
          e => console.log(e)
        ));
      };

      this.logout = () => {
        $http({
          method: 'DELETE',
          url: '/api/sessions'
        }).then((res) => {
          UserService.clear();
          $window.location.href = '#!/login';
        });
      };

      this.changeDate = () => {
        console.log(this.date);
        let dateMs = new Date(
          new Date().setHours(0, 0, 0, 0)).
          setFullYear(
            this.date.getFullYear(),
            this.date.getMonth(),
            this.date.getDate()
          );
        
        // HTTP REQUEST TO CHANGE LOGS
        // in the then()
        // this.patient.weight = res.data.weightEntry ? res.data.weightEntry[1] : undefined;
        // this.patient.sodium = res.data.sodiumEntry ? res.data.sodiumEntry[1] : undefined;
        // this.patient.fluid = res.data.fluidEntry ? res.data.fluidEntry[1] : undefined;
      };

      this.changeNextAppt = () => {
        this.patient.nextAppt = this.nextAppt;
      };

      this.symptoms = [
        "Trouble breathing",
        "Chest pain",
        "Swelling in legs"
      ];

      this.updateSymptoms = (event) => {
        let index = this.patient.symptoms.indexOf(event.target.value);

        if (index > -1) {
          this.patient.symptoms.splice(index, 1);
        } else {
          this.patient.symptoms.push(event.target.value);
        }
      };

      this.addMedication = (medication) => {
        let index = this.patient.medications.indexOf(medication);

        if (index < 0 && medication && medication.length > 0) {
          this.patient.medications.push(medication);
        }

        this.medication = "";
      };

      this.removeMedication = (medication) => {
        let index = this.patient.medications.indexOf(medication);

        if (index > -1) {
          this.patient.medications.splice(index, 1);
        }
      };

      const checkVitals = () => {
        // CALL THIS METHOD WHEN UPDATING PATIENT, CALL WHEN INIT
        let today = new Date().setHours(0, 0, 0, 0);

        let yday = new Date();
        yday.setDate(yday.getDate() - 1);
        yday = yday.setHours(0, 0, 0, 0);

        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo = weekAgo.setHours(0, 0, 0, 0);

        console.log(new Date(today));
        console.log(new Date(yday));
        console.log(new Date(weekAgo));

        // // fetch weight from previous day
        // // if weight of today - yday is >= 2 warn
        // if (this.patient.weight - ydayWeight >= 2) {
        //   this.warnings.push("You have gained 2 or more pounds since yesterday");
        // }

        // // fetch weight from a week ago
        // // if weight of today - week ago is >= 7 warn
        // if (this.patient.weight - weekAgoWeight >= 5) {
        //   this.warnings.push("You have gained 5 or more pounds in a week");
        // }

        // // look at todays fluids
        // // if more than 2 liters warn
        // if (this.patient.fluid >= 2) {
        //   this.warnings.push("Your fluids are over 2 Liters for the day");
        // }

        // // look at todays sodium
        // // if more than ... warn
        // if (this.patient.sodium >= ???) {
        //   this.warnings.push("Your sodium is over *** for the day");
        // }
      };

      checkVitals();

      const createChart = ({ weightLog, sodiumLog, fluidLog }) => {
        Highcharts.chart('graph', {

          title: {
            text: "My Metrics"
          },

          yAxis: {
            title: {
              text: 'mg'
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          xAxis: {
            type: 'datetime'
          },

          series: [{
            name: 'Weight',
            data: weightLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Sodium',
            data: sodiumLog,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Fluid',
            data: fluidLog,
            tooltip: {
              valueDecimals: 2
            }
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        });
      };
    }
  });

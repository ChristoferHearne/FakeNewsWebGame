/**
* Angular controller that manages the Statistics-view. Renders charts based on the Chart.js library. 
* @extends Angular
*/
angular.module('statisticsController', []) // Läs 1 nedan
    .controller('StatisticsController', function StatisticsController($scope, $http) {

        // Chart displaying the precentage of right and wrong answers
        $scope.setAnswersChartData = function(){
            $http.get('/api/statistics')
                .then(function successCallback(response){
                    var context = document.getElementById('answersChart').getContext('2d'); // Get the canvas-element to be rendered

                    // Create Chart.js chart
                    var answersChart = new Chart(context, {
                        type: 'bar',
                        data: {
                          labels: ["Answers"],
                          datasets: [
                            {
                                label: "Right",
                                backgroundColor: ["#00FF00"],
                                data: [(response.data[0].amountRight / response.data[0].roundsPlayed) * 100] // Data about the amount of right answers in %
                            },
                            {
                                label: "Wrong",
                                backgroundColor: ["#ff0001"],
                                data: [(response.data[0].amountWrong / response.data[0].roundsPlayed) * 100] // Data about the amount of wrong answers in %
                            }
                          ]
                            },
                        plugins: [ChartDataLabels], // Plugin that shows the value inside the bar
                        options: { // Visual configurations
                            responsive: true,
                            plugins: {
                                datalabels: {
                                    formatter: function (value) {
                                        return value.toFixed(1) + '%'; // Formatter that sets the value to one decimal and with a %-sign at the end
                                    },
                                    font: {
                                        family: "Barlow",
                                        size: 40
                                    }
                                },
                                legend: {
                                    labels: {
                                        // This more specific font property overrides the global property
                                        font: {
                                            family: "Barlow",
                                            size: 14
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'How our players have performed (percentage of Right/Wrong answers): ',
                                    font: {
                                        family: "Barlow",
                                        size: 20,
                                        weight: 'normal'
                                    }
                                }
                            },
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            scales: {
                                x: {
                                    stacked: true,
                                    ticks : {
                                        callback: function (value) {
                                            return Math.round(value) + '%';
                                        },
                                        font: {
                                            family: "Barlow",
                                            size: 15
                                        }
                                    }
                                },
                                y: {
                                    stacked: true,
                                    ticks : {
                                        font: {
                                            family: "Barlow",
                                            size: 15
                                        }
                                    }
                                },
                            },
                        }
                        
                    });
                },
                function errorCallBack(response){
                    console.log(`Could not get stats: ${response.data}` )
                })
        }
        
        // Chart displaying which and the amount a certain university has been picked by the players
        $scope.setUniversitiesChart = function(){
            var context = document.getElementById('universityChart').getContext('2d');
            var universityChart = new Chart(context, {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: "Amount Registered",
                      backgroundColor: ["#3e95cd"],
                      data: []
                    },
                  ]
                },
                plugins: [ChartDataLabels],
                options: {
                responsive: true,
                indexAxis: 'y',
                    plugins: {
                        datalabels: {
                            font: {
                                family: "Barlow",
                                size: 20
                            }
                        },
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                font: {
                                    family: "Barlow",
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Universities registered by our players:',
                            font: {
                                family: "Barlow",
                                size: 20,
                                weight: 'normal'
                            }
                        }
                    },
                    indexAxis: 'y',
                    scales: {
                        x: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            },
                        },
                        y: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            }
                        },
                    },
                }
            });
            $http.get('/api/universities')
                .then(function successCallback(response){

                    $scope.universities = response.data.sort((a, b) => (a.amountRegistered > b.amountRegistered) ? -1 : 1).filter((sortDescending) => {return sortDescending.amountRegistered}) // Sorts the list of universities in descending order based on the amountRegistered-field. Filters out 0-values

                    universityChart.options.scales.x.max = $scope.universities[0].amountRegistered + 2 // Sets the maximum-value the x-axis can have

                    // Adds the sorted list of universities to the bar-chart
                    $scope.universities.forEach(university => {
                        universityChart.data.labels.push(university.name) // Set the university name in the chart
                        universityChart.data.datasets[0].data.push(university.amountRegistered) // Set the data in the chart
                        universityChart.update() // Update the chart for each iteration, helps with rendering
                    })
                }, function errorCallBack(response){
                    console.log(`Error: ${response.data}`)
                })
        }

        // Chart displaying what political leanings the player has registered
        $scope.setPoliticalsChart = function(){
            var context = document.getElementById('politicalChart').getContext('2d');
            var politicalChart = new Chart(context, {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: "Amount Registered",
                      backgroundColor: ["#3e95cd"],
                      data: []
                    },
                  ]
                },
                plugins: [ChartDataLabels],
                options: {
                responsive: true,
                indexAxis: 'y',
                    plugins: {
                        datalabels: {
                            font: {
                                family: "Barlow",
                                size: 20
                            }
                        },
                        legend: {
                            labels: {
                                font: {
                                    family: "Barlow",
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'How our players identifiy politically: ',
                            font: {
                                family: "Barlow",
                                size: 20,
                                weight: 'normal'
                            }
                        }
                    },
                    indexAxis: 'y',
                    scales: {
                        x: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            }
                        },
                    },
                }
            });
            $http.get('/api/politicals')
                .then(function successCallback(response){
                    $scope.politicals = response.data.sort((a, b) => (a.amountRegistered > b.amountRegistered) ? -1 : 1).filter((sortDescending) => {return sortDescending.amountRegistered}) // Sorts the list of political leanings in descending order based on the amountRegistered-field. Filters out 0-values

                    politicalChart.options.scales.x.max = $scope.politicals[0].amountRegistered + 2 // Sets the maximum-value the x-axis can have. 

                    // Adds the sorted list of political leanings to the bar-chart
                    $scope.politicals.forEach(political => {
                        politicalChart.data.labels.push(political.name) // Add political name
                        politicalChart.data.datasets[0].data.push(political.amountRegistered) // Add data
                        politicalChart.update() // Update the chart
                    })
                }, function errorCallBack(response){
                    console.log(`Error: ${response.data}`)
                })
        }

        // Chart showing the employment-status stats for the players
        $scope.setEmploymentsChart = function(){
            var context = document.getElementById('employmentChart').getContext('2d');
            var employmentChart = new Chart(context, {
                type: 'bar',
                data: {
                  labels: [],
                  datasets: [
                    {
                      label: "Amount Registered",
                      backgroundColor: ["#3e95cd"],
                      data: []
                    },
                  ]
                },
                plugins: [ChartDataLabels],
            options: {
                    indexAxis: 'y',
                    plugins: {
                        datalabels: {
                            font: {
                                family: "Barlow",
                                size: 20
                            }
                        },
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                font: {
                                    family: "Barlow",
                                    size: 14
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'What our players current employment status are:',
                            font: {
                                family: "Barlow",
                                size: 20,
                                weight: 'normal'
                            }
                        }
                    },
                    indexAxis: 'y',
                    scales: {
                        x: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            }
                        },
                        y: {
                            stacked: true,
                            ticks : {
                                font: {
                                    family: "Barlow",
                                    size: 15
                                }
                            }
                        },
                    },
                }
            });
            $http.get('/api/employments')
                .then(function successCallback(response){
                    $scope.employments = response.data.sort((a, b) => (a.amountRegistered > b.amountRegistered) ? -1 : 1).filter((sortDescending) => {return sortDescending.amountRegistered}) // Sorts the list of employments in descending order based on the amountRegistered-field. Filters out 0-values

                    employmentChart.options.scales.x.max = $scope.employments[0].amountRegistered + 3 // Sets the maximum value the x-axis can have

                    $scope.employments.forEach(employment => {
                        employmentChart.data.labels.push(employment.name) // Add the name of the employment status
                        employmentChart.data.datasets[0].data.push(employment.amountRegistered) // Add data
                        employmentChart.update() // Update the chart
                    })
                }, function errorCallBack(response){
                    console.log(`Error: ${response.data}`)
                })
        }

        // Functions triggered on init
        $scope.setAnswersChartData()
        $scope.setUniversitiesChart()
        $scope.setPoliticalsChart()
        $scope.setEmploymentsChart()
    }
)
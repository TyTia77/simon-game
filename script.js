var app = angular.module('app', []);
    app.controller('ctrl', ['$scope', '$timeout', function($scope, $timeout){

        var pattern = [];
        $scope.display = '';
        var userRecord = [];
        var allowClick = true;
        var begin = false;
        var wav =[
            'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
        ];
        var test;



        // handle clicks
        $('.tab').on('click', function(){

            if (allowClick){
                var index = $(this).index();
                toggleClass(index);
            }

            if (begin){
                userRecord.push(index);
                checkUserClick();
            }
        })

        function checkUserClick(){
            if(test){
                $timeout.cancel(test);
            }

            test = $timeout(function(){
                checkPattern();
            },3000);

            if(begin && userRecord.length >= pattern.length){
                $timeout.cancel(test);
                checkPattern();
            }
        }

        $scope.buttonClick = function(){

            begin = !begin;
            $('.button-container').toggleClass('on');
            $('.fa').toggleClass('icon-green');
            var msg = begin ? 'click to stop' : 'click to start';
            $('.button-container').attr('data-msg', msg);
            play(begin);
        }

        function play(begin){
            if (begin){
                $scope.display = 1;
                allowClick = false;
                generatePattern();
                playPattern(0);
            } else {
                $scope.display = '';
                userRecord = [];
                pattern = [];
            }
        }

        // functions
        function checkPattern(){
            var match = true;

            pattern.forEach(function(item, index){
                if (item !== userRecord[index]){
                    console.log('error');
                    match = false;
                }
            })

            if (match){
                userRecord = [];
                $scope.display++;
                generatePattern();
                playPattern(0);
            } else {
                var display = $scope.display;
                $scope.display = ' er';
                $timeout(function(){
                    $scope.display = display;
                }, 1000);
                userRecord = [];
                allowClick = false;
                playPattern(0);
            }
        }


        function generatePattern(){
            var rand = Math.floor(Math.random() * 4);
            pattern.push(rand);
        }

        // accepts an array
        function playPattern(index){

            var timer = index === 0 ? 1500 : getTimerValue(index);

            if (index < pattern.length){
                $timeout(function(){
                    toggleClass(pattern[index]);
                    playPattern(index+1);
                }, timer);
            }

            allowClick = true;
        }

        function getTimerValue(){

            if (pattern.length < 3){
                return 1500;
            } else if (pattern.length < 6){
                // return 1000;
                return 1000;
            } else if (pattern.length < 9){
                // return 700;
                return 700;
            } else {
                return 400;
            }
        }

        function toggleClass(index){
            var dom = $('.tab').eq(index);
            var color = $('.tab').eq(index).attr('data-color');
            var audio = new Audio(wav[index]);
            var timer = getTimerValue() / 2;
            audio.play();
            dom.addClass(color);

            $timeout(function(){
                dom.removeClass(color);
            }, timer);
        }
    }]);

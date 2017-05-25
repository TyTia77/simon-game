var app = angular.module('app', []);
    app.controller('ctrl', ['$scope', '$timeout', function($scope, $timeout){

        var wav =[
            'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
            'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
        ];

        var gameState = {
            allowClick: false,
            onSwitch: false,
            strictMode: false,
            pattern: [],
            userRecord: [],
            timeout: {}
        }

        $scope.buttonTap = {
            strict: function(){
                if (gameState.onSwitch){
                    $('.strict-led').toggleClass('light-green');
                    gameState.strictMode = !gameState.strictMode;
                }
            },

            start: function(){
                if (gameState.onSwitch){
                    restartGame();
                    initPlay();
                }
            },

            on: function(){
                gameState.onSwitch = !gameState.onSwitch;
                $('.button-container').toggleClass('on');
                $('.fa').toggleClass('icon-green');

                $scope.display = gameState.onSwitch ? '--' : '';

                if (!gameState.onSwitch){
                    clearTimer();
                    $scope.display = '';
                    gameState.strictMode = false;
                    $('.strict-led').removeClass('light-green');
                }
            }
        }

        $('.tab').on('click', function(){
            var index;
            if (gameState.allowClick){

                if (gameState.timeout.playerTimelimit){
                    $timeout.cancel(gameState.timeout.playerTimelimit);
                    gameState.timeout.playerTimelimit = false;
                }

                index = $(this).index();
                toggleClass(index);
                gameState.userRecord.push(index);
                checkPattern();
            }
        })


        // initialize game, first time
        function initPlay(){
            generatePattern();
            playPattern(0);
        }

        function checkPattern(){
            var user = gameState.userRecord;
            var pattern = gameState.pattern;
            var userLen = user.length - 1;
            var patternLen = pattern.length - 1;

            // checks each individual key pressed
            if (user[userLen] === pattern[userLen] && userLen !== -1){

                // successfully entered
                // all correct values
                if (userLen === patternLen){

                    // player achieved 20 correct
                    if (userLen > 19){
                        $scope.display = '**';
                        $timeout(function(){
                            $scope.buttonTap.start();
                        }, 3000);
                    } else {

                        // continue to next sequence
                        gameState.userRecord = [];
                        $scope.display++;
                        generatePattern();
                        playPattern(0);
                    }

                // successfully entered however
                // not all keys
                } else {

                    // handle error when user takes too long
                    // to respond
                    if (gameState.timeout.playerTimelimit){
                        handleError();
                    } else {

                        // set timer if there isnt one active
                        setPlayerTimeout();
                    }
                }

            }  else {

                // incorrect input
                handleError();
            }

        }

        function handleError(){
            if (gameState.timeout.playerTimelimit){
                $timeout.cancel(gameState.timeout.playerTimelimit);
            }

            // store a copy then reapply after
            // displaying error
            var display = $scope.display;
            $scope.display = ' er';

            gameState.timeout.error = $timeout(function(){
                if (gameState.strictMode){
                    $scope.buttonTap.start();
                } else {
                    $scope.display = display;
                    gameState.userRecord = [];
                    playPattern(0);
                }
            }, 1000);
        }


        function setPlayerTimeout(){
            gameState.timeout.playerTimelimit = $timeout(function(){
                checkPattern();
            }, 3000);
        }

        function restartGame(){
            $scope.display = 1;
            gameState.pattern = [];
            gameState.userRecord = [];
        }


        function generatePattern(){
            var rand = Math.floor(Math.random() * 4);
            gameState.pattern.push(rand);
        }

        // accepts an array
        function playPattern(index){

            gameState.allowClick = false;

            var timer = index === 0 ? 1500 : getTimerValue(index);

            if (index < gameState.pattern.length){
                gameState.timeout.playPattern = $timeout(function(){
                    toggleClass(gameState.pattern[index]);
                    playPattern(index+1);

                    if (index === gameState.pattern.length - 1){
                        gameState.allowClick = true;
                        setPlayerTimeout();
                    }

                }, timer);
            }
        }

        function clearTimer(){
            angular.forEach(gameState.timeout, function(time){
                $timeout.cancel(time);
            })
        }

        function getTimerValue(){

            if (gameState.pattern.length < 3){
                return 1000;
            } else if (gameState.pattern.length < 6){
                return 800;
            } else if (gameState.pattern.length < 9){
                return 600;
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

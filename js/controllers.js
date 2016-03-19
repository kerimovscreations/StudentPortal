loginApp.controller('LoginController', function($scope){

    $scope.user_type='Student';

    $scope.submit=function(){
        console.log($scope.user_email);
        console.log($scope.user_password);
        console.log($scope.user_type);
    }
});

teacherDashboardApp.controller('MainMenuController', function ($scope, $timeout, $mdSidenav, ProfileService){

        $scope.toggleNavBar = buildDelayedToggler('left');
        $scope.user_name=ProfileService.user_name;
        $scope.user_surname=ProfileService.user_surname;
        $scope.user_type=ProfileService.user_type;

        var dropDownMenu=document.getElementById('dropDownProfile');

        $scope.toggleDropDownProfile=function(){
            if(dropDownMenu.style.display=='none'){
                dropDownMenu.style.display='block';
            }else{
                dropDownMenu.style.display='none';
            }
        };



        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        /**
         * Build handler to open/close a SideNav
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                if($mdSidenav(navID).isOpen()){
                    $mdSidenav(navID)
                        .close()
                }else{
                    $mdSidenav(navID)
                        .open()
                }
            }, 100);
        }

    })
    .controller('SectionList', function($scope,$location, $mdDialog) {
        $scope.sections = [
            { name: 'Announcement' },
            { name: 'Syllabus'},
            { name: 'Contacts'},
            { name: 'Materials'},
            { name: 'Assignments'},
            { name: 'Grading'}
        ];

        $scope.current_section=$scope.sections[0].name;

        $scope.selectSection=function(text){
            $scope.current_section=text;
            $location.path('/'+text.toLowerCase());
            console.log($scope.current_section);
        };

    })
    .controller('announcementController',function($scope, $mdDialog, ProfileService){
        $scope.user_name=ProfileService.user_name;
        $scope.user_surname=ProfileService.user_surname;
        $scope.announcement_post='';
        $scope.notify_checkbox=false;
        $scope.announcements=[];
        $scope.date;
        $scope.post=function (){
            if($scope.announcement_post){
                $scope.date = new Date();
                $scope.announcements.push($scope.announcement_post);
                $scope.announcement_post='';
            }
        };
        $scope.deletePost=function(index){
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete announcement?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $scope.announcements.splice(index,1);
            });
        }
    })
    .controller('syllabusController',function($scope, $mdDialog, $mdMedia,ProfileService){
        $scope.source=[];
        $scope.$watch('source',function(){
            $scope.source=ProfileService.syllabuses;
        });
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.addSyllabus=function(){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialogs/addSyllabusDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        $scope.deleteSyllabus=function(index){
            var warn = $mdDialog.confirm()
                .title('Are you sure to delete'+$scope.source[index].name+' file?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(warn).then(function() {
                $scope.source.splice(index,1);
            });
        }
    })
    .controller('contactsController',function($scope, ProfileService, $mdDialog){
        $scope.student_contacts=ProfileService.student_contacts;
        $scope.showContact=function(index){
            $mdDialog.show(
                $mdDialog.alert()
                    .title($scope.student_contacts[index].name)
                    .textContent('Email: '+$scope.student_contacts[index].email)
                    .ok('Got it')
            )};
        $scope.sendEmail=function(index){
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Send an email')
                    .textContent('Email: '+$scope.student_contacts[index].email)
                    .ok('Got it'));
        }
    })
    .controller('materialsController',function($scope, $mdDialog, $mdMedia,ProfileService){
        $scope.source=[];
        $scope.$watch('source',function(){
            $scope.source=ProfileService.materials;
        });
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.addMaterial=function(){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialogs/addMaterialDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        $scope.deleteMaterial=function(index){
            var warn = $mdDialog.confirm()
                .title('Are you sure to delete'+$scope.source[index].name+' file?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(warn).then(function() {
                $scope.source.splice(index,1);
            });
        }
    })
    .controller('assignmentsController',function(){})
    .controller('gradingController',function(){});

function DialogController($scope, $mdDialog) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.upload = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.fileUpload=function(){

    }
}

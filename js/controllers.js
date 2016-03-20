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
    .controller('SectionListController', function($scope, $location) {
        $scope.sections = [
            { name: 'Announcement' },
            { name: 'Conversation'},
            { name: 'Notification'},
            { name: 'People'},
            { name: 'Schedule'},
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
    .controller('AnnouncementController',function($scope, $mdDialog, $mdMedia, ProfileService, AnnouncementService){
        $scope.user_name=ProfileService.user_name;
        $scope.user_surname=ProfileService.user_surname;
        $scope.announcement_post='';
        $scope.notify_checkbox=false;
        $scope.announcements=AnnouncementService.announcements;
        $scope.groups = AnnouncementService.groups;
        $scope.selected = [];
        $scope.post=function (){
            if($scope.announcement_post){
                $scope.date = new Date();
                $scope.announcements.splice(0, 0,
                    {
                        user: $scope.user_name+" "+$scope.user_surname,
                        date: $scope.date,
                        text: $scope.announcement_post,
                        groups: $scope.selected
                    });
                $scope.announcement_post='';
                $scope.selected = [];
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
        };

        $scope.editPost=function(index){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: function EditPostDialogController($scope, $mdDialog, AnnouncementService,$mdToast){
                    $scope.tempAnnouncement=AnnouncementService.announcements[index];
                    $scope.selected=$scope.tempAnnouncement.groups.slice();
                    $scope.edited_post=$scope.tempAnnouncement.text;
                    $scope.groups=AnnouncementService.groups;
                    $scope.hide = function() {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                    $scope.update=function(){
                        var date = new Date();
                        AnnouncementService.announcements[index].date=date;
                        AnnouncementService.announcements[index].text=$scope.edited_post;
                        AnnouncementService.announcements[index].groups=$scope.selected;
                        $mdToast.show($mdToast.simple().textContent('Post edited'));
                        console.log(AnnouncementService.announcements[index]);
                        $mdDialog.hide();
                    };
                    $scope.toggle = function (item, list) {
                        var idx = list.indexOf(item);
                        if (idx > -1) list.splice(idx, 1);
                        else list.push(item);
                    };
                    $scope.exists = function (item, list) {
                        return list.indexOf(item) > -1;
                    };
                },
                templateUrl: 'dialogs/editPost.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
    })
    .controller('SyllabusController',function($scope, $mdDialog, $mdMedia, ProfileService){
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
    .controller('PeopleController',function($scope, ProfileService, $mdDialog){
        $scope.people=ProfileService.people;
        $scope.students=[];
        $scope.teachers=[];
        $scope.mentors=[];
        for(elem in $scope.people){
            if($scope.people[elem].type=='student'){
                $scope.students.push($scope.people[elem]);
            }else if($scope.people[elem].type=='teacher'){
                $scope.teachers.push($scope.people[elem]);
            }else if($scope.people[elem].type=='mentor'){
                $scope.mentors.push($scope.people[elem]);
            }
        };
        console.log($scope.students);
        $scope.selectedIndex=0;

        $scope.showContact=function(id){
            for(elem in $scope.people){
                if($scope.people[elem].id==id){
                    var index=id;
                }}
            index--;
            $mdDialog.show(
                $mdDialog.alert()
                    .title($scope.people[index].name)
                    .textContent('Email: '+$scope.people[index].email)
                    .ok('Got it')
            )};
        $scope.sendEmail=function(id){
            for(elem in $scope.people){
                if($scope.people[elem].id==id){
                    var index=id;
                }}
            index--;
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Send an email')
                    .textContent('Email: '+$scope.people[index].email)
                    .ok('Got it'));
        }
    })
    .controller('ScheduleController',function($scope, $mdDialog, $mdMedia, ProfileService,ScheduleService){
        $scope.events=ScheduleService.events;
        for(key in $scope.events){
            $scope.events[key].date=new Date($scope.events[key].date);
        }
        $scope.dt=new Date();
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };
        $scope.dateOptions = {
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2016, 1, 1)
        };

        $scope.$watch('dt',function(){
            $scope.temp1=new Date($scope.dt);
            $scope.temp1.setDate($scope.dt.getDate() + 1);
            $scope.temp2=new Date($scope.dt);
            $scope.temp2.setDate($scope.dt.getDate() + 2);
            $scope.temp3=new Date($scope.dt);
            $scope.temp3.setDate($scope.dt.getDate() + 3);
            $scope.temp4=new Date($scope.dt);
            $scope.temp4.setDate($scope.dt.getDate() + 4);
            $scope.temp5=new Date($scope.dt);
            $scope.temp5.setDate($scope.dt.getDate() + 5);
            $scope.temp6=new Date($scope.dt);
            $scope.temp6.setDate($scope.dt.getDate() + 6);
        });

        $scope.isOpen = false;
        $scope.demo = {
            isOpen: false,
            count: 0
        };

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
    .controller('AssignmentsController',function(){})
    .controller('GradingController',function(){})
    .controller('ConversationController',function(){})
    .controller('NotificationController',function(){})

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

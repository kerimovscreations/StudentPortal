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
    .controller('AnnouncementController',function($scope, $mdDialog, $mdMedia, ProfileService, AnnouncementService, Data){
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
            Data.PostId=index;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: EditPostDialogController,
                templateUrl: 'dialogs/editPostDialog.html',
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
    .controller('ScheduleController',function($scope, $mdDialog, $mdMedia, ScheduleService, Data){
        $scope.events=ScheduleService.events;

        $scope.dt=new Date();

        console.log($scope.dt);
        $scope.today = function() {
            $scope.dt = new Date();
        };

        $scope.$watch('dt',function(){
            $scope.temp1=moment($scope.dt).add(1, 'd');
            $scope.temp2=moment($scope.dt).add(2, 'd');
            $scope.temp3=moment($scope.dt).add(3, 'd');
            $scope.temp4=moment($scope.dt).add(4, 'd');
            $scope.temp5=moment($scope.dt).add(5, 'd');
            $scope.temp6=moment($scope.dt).add(6, 'd');
        });

        $scope.isOpen = false;
        $scope.demo = {
            isOpen: false,
            count: 0
        };

        $scope.displayDate=function(elem){
            return moment(elem).format("dddd, MMMM DD YYYY");
        };

        $scope.display=function(elem){
            return elem.format("dddd, MMMM DD YYYY");
        };

        $scope.parseDateEvent=function(date,type){
            return moment(date,type).format('MM-DD-YYYY');
        };

        $scope.parseDate=function(date){
            return moment(date).format('MM-DD-YYYY');
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.Data=Data;
        $scope.eventSelect=function(id){
            $scope.Data.EventId=id;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: eventSelectDialogController,
                    templateUrl: 'dialogs/eventSelectDialog.html',
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

    })
    .controller('AssignmentsController',function(){})
    .controller('GradingController',function(){})
    .controller('ConversationController',function(){})
    .controller('NotificationController',function(){})

function EditPostDialogController($scope, $mdDialog, AnnouncementService,$mdToast,Data){
    var index=Data.PostId;
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
}

function eventSelectDialogController($scope, $mdDialog,$mdMedia, Data, ScheduleService){
    var id=Data.EventId;
    for(key in ScheduleService.events)
        if(id==ScheduleService.events[key].id)
            $scope.event=ScheduleService.events[key];

    $scope.dateExtended=moment(new Date($scope.event.date)).format("dddd, MMMM DD YYYY");
    $scope.edit=function(){
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
                controller: eventEditDialogController,
                templateUrl: 'dialogs/eventEditDialog.html',
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
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}
function eventEditDialogController($scope, $mdDialog,$timeout, $q, Data, ScheduleService,ProfileService){
    var id=Data.EventId;
    for(key in ScheduleService.events)
        if(id==ScheduleService.events[key].id)
            $scope.event=ScheduleService.events[key];

    var startTime=$scope.event.startTime.split(':');
    var endTime=$scope.event.endTime.split(':');

    $scope.startHour=startTime[0];
    $scope.startMinute=startTime[1];
    $scope.endHour=endTime[0];
    $scope.endMinute=endTime[1];

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) { return { selectedHour: hour }; });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) { return { selectedMinute: minute }; });
    $scope.places=['HTP','BBF'].map(function (place) { return { selectedPlace: place }; });
    $scope.groups=['16101','16102','16103'].map(function (group) { return { selectedGroup: group }; });

    $scope.people = loadAll();
    $scope.querySearch = querySearch;
    $scope.selectedItem='Orxan Farmanli';

    function querySearch (query) {
        var results = query ? $scope.people.filter( createFilterFor(query) ) : $scope.people,
            deferred;
        if (true) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll() {
        $scope.tempPeople=ProfileService.people;
        var stuffName=[];
        var stuffId=[];
        for(key in $scope.tempPeople){
            if($scope.tempPeople[key].type=='mentor'||$scope.tempPeople[key].type=='teacher'){
                stuffName.push($scope.tempPeople[key].name);
                stuffId.push($scope.tempPeople[key].id);
            }
        }
        return stuffName.map( function (name) {
            return {
                value: name.toLowerCase(),
                display: name
            };
        });
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

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

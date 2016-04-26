registerApp.controller('RegisterController',function($scope){
    $scope.user = {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordConfirm: '',
        number: '',
        birthDate: ''
    };
});

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
        $scope.user_email=ProfileService.user_email;
        $scope.user_type=ProfileService.user_type;

        var dropDownMenu=document.getElementById('dropDownProfile');

        $scope.toggleDropDownProfile=function(){
            if(dropDownMenu.style.display=='none'){
                dropDownMenu.style.display='block';
            }else{
                dropDownMenu.style.display='none';
            }
        };

        /**
         * Show the image change pop-up menu
         */
        $scope.changeProfileImage= function () {

        };

        /**
         * Redirect to the edit profile page
         */
        $scope.editProfile=function(){

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
    .controller('SectionListController', function($scope, $location, $http) {
        $http.get('/getSections').success(function(data) {
            $scope.sections = data;
        });

        $scope.current_section='';

        $scope.selectSection=function(text){
            $scope.current_section=text;
            $location.path('/'+text.toLowerCase());
        };

    })
    .controller('AnnouncementController',function($scope, $mdDialog, $mdMedia,$mdToast, $http, $cookies, $route, Data){

        $http.get('/getAnnouncements').success(function(data) {
            $scope.announcements = data[0];
            for(var i=0;i<$scope.announcements.length;i++){
                $scope.announcements[i].groups=data[1][i];
                $scope.announcements[i].owner=data[2][i];
            }
        });

        $http.get('/getGroups').success(function(data) {
            $scope.groups = data;
        });

        $scope.announcement_post='';
        $scope.selected = [];

        $scope.user_type=$cookies.get('userType');

        $scope.post=function (){
            $scope.user_id=$cookies.get('userId');
            $http({
                method: 'POST',
                url: '/postAnnouncement',
                data: {
                    body: $scope.announcement_post,
                    owner_id: $scope.user_id,
                    group_list: $scope.selected
                }
            }).success(function () {
                $scope.announcement_post='';
                $scope.selected = [];
                $mdToast.show($mdToast.simple().textContent('Posted'));
                $route.reload();
            })
        };

        $scope.deletePost=function(index){
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete announcement?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'POST',
                    url: '/deleteAnnouncement',
                    data: {id: $scope.announcements[index].id}
                }).success(function () {
                    $mdToast.show($mdToast.simple().textContent('Deleted'));
                    $route.reload();
                })
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
    .controller('PeopleController',function($http, $scope, $mdDialog){
        $scope.students=[];
        $scope.teachers=[];
        $scope.mentors=[];

        $http.get('/getStudents').success(function(data){
            $scope.students=data;
        });
        $http.get('/getTeachers').success(function(data){
            $scope.teachers=data;
        });
        $http.get('/getMentors').success(function(data){
            $scope.mentors=data;
        });

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
    .controller('ScheduleController',function($scope, $http, $cookies, $mdDialog, $mdMedia, Data){
        $scope.Data=Data;
        $scope.user_type=$cookies.get('userType');
        $scope.events=[];

        $http.get('/getEvents').success(function(data){
            $scope.events=data;
        });

        $scope.dt=new Date();

        $scope.today = function() {
            $scope.dt = new Date();
        };

        //To add next 6 days to week schedule
        $scope.$watch('dt',function(){
            $scope.temp1=moment($scope.dt).add(1, 'd');
            $scope.temp2=moment($scope.dt).add(2, 'd');
            $scope.temp3=moment($scope.dt).add(3, 'd');
            $scope.temp4=moment($scope.dt).add(4, 'd');
            $scope.temp5=moment($scope.dt).add(5, 'd');
            $scope.temp6=moment($scope.dt).add(6, 'd');
        });

        //FAB button to add new event
        $scope.isOpen = false;
        $scope.demo = {
            isOpen: false,
            count: 0
        };

        $scope.displayDate=function(elem){
            return moment(elem).format("dddd, MMMM DD YYYY");
        };

        $scope.displayMoment=function(elem){
            return elem.format("dddd, MMMM DD YYYY");
        };

        $scope.parseDateFormatted=function(date, type){
            return moment(date,type).format('MM-DD-YYYY');
        };

        $scope.parseDate=function(date){
            return moment(date).format('MM-DD-YYYY');
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $scope.eventSelect=function(id){
            Data.EventId=id;

            $mdDialog.show({
                controller: eventSelectDialogController,
                templateUrl: 'dialogs/eventSelectDialog.html',
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

        $scope.eventAdd=function(type){
            $scope.Data.AddEventType=type;

            $mdDialog.show({
                controller: eventAddDialogController,
                templateUrl: 'dialogs/eventAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

    })
    .controller('AssignmentsController',function($scope, $mdDialog, $mdMedia, AssignmentService, Data){
        $scope.assignments=AssignmentService.assignments;
        $scope.status=false;

        $scope.showDeadlineFromNow= function (date) {
            return moment(date,"MM-DD-YYYY, HH:mm").fromNow()
        };
        $scope.showDeadline=function(date){
            return moment(date,"MM-DD-YYYY, HH:mm").format("dddd, MMMM Do YYYY, HH:MM");
        };
        $scope.showStatus=function(bool){
            if(bool)
                return "Done";
            else
                return "Now Done";
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $scope.addAssignment=function(){
            $mdDialog.show({
                controller: assignmentAddDialogController,
                templateUrl: 'dialogs/assignmentAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    })
    .controller('GradingController',function(){})
    .controller('ConversationController',function(){})
    .controller('NotificationController',function($scope, $http,$cookies, $mdDialog, $mdMedia, Data){
        $scope.notifications=[];

        var user_type=$cookies.get('userType');

        if(user_type=='student') {
            var user_group_id=$cookies.get('userGroupId');
            $http.get('/getNotifications/groups/' + user_group_id).success(function (data) {
                $scope.notifications = data;
            });
        }

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $scope.selectNotification=function(index){
            $http.get('/getDataNotification/'+
                $scope.notifications[index].source_table+'/'+
                $scope.notifications[index].source_id).success(function(data){
                Data.NotificationData=data;
                Data.NotificationData.source_table=$scope.notifications[index].source_table;
            });
            $mdDialog.show({
                controller: notificationSelectDialogController,
                templateUrl: 'dialogs/notificationSelectDialog.html',
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

        $scope.showDateFromNow= function (date) {
            return moment(date,"YYYY-MM-DD HH:mm:ss").fromNow()
        };
    })

// Announcement edit dialog controller

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

// Schedule dialog controllers

function eventSelectDialogController($scope,$http,$cookies, $mdDialog,$mdMedia,$mdToast, Data){
    var id=Data.EventId;
    $scope.user_name=$cookies.get('userName');
    $scope.user_type=$cookies.get('userType');
    var tempKey='';

    $scope.event=[];

    $http.get('/getEvent/'+id).success(function(data){
        $scope.event=data;
    });

    $scope.showStatus=function(status){
        switch (status){
            case 0: return 'Not Done'; break;
            case 1: return 'Done'; break;
            default: return 'Not Done'; break;
        }
    };

    $scope.dateExtended=function(date){
        return moment(new Date(date)).format("dddd, MMMM DD YYYY");
    };
    $scope.edit=function(){
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
            controller: eventEditDialogController,
            templateUrl: 'dialogs/eventEditDialog.html',
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
    $scope.delete=function(){
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete event?')
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            ScheduleService.events.splice(tempKey,1);
            $mdToast.show($mdToast.simple().textContent('Event deleted'));
        });
    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

function eventEditDialogController($scope, $mdDialog, $timeout, $q, $mdToast, Data, ScheduleService, PeopleService){
    var id=Data.EventId;
    var tempKey=null;
    $scope.event=null;

    for(key in ScheduleService.events)
        if(id==ScheduleService.events[key].id){
            $scope.event=ScheduleService.events[key];
            tempKey=key;
        }
    $scope.editedEvent=clone($scope.event);
    $scope.eventTitle=$scope.editedEvent.title;
    $scope.eventContent=$scope.editedEvent.description;
    $scope.eventPlace=$scope.editedEvent.place;
    $scope.eventGroup=$scope.editedEvent.group;
    $scope.eventResponsible=$scope.editedEvent.responsible;
    $scope.eventType=$scope.editedEvent.type;

    var startTime=$scope.event.startTime.split(':');
    var endTime=$scope.event.endTime.split(':');

    $scope.startHour=startTime[0];
    $scope.startMinute=startTime[1];
    $scope.endHour=endTime[0];
    $scope.endMinute=endTime[1];

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) { return { selectedHour: hour }; });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) { return { selectedMinute: minute }; });
    $scope.types=['lesson','meeting','extra'].map(function (type) { return { selectedType: type }; });
    $scope.places=['HTP','BBF'].map(function (place) { return { selectedPlace: place }; });
    $scope.groups=['16101','16102','16103'].map(function (group) { return { selectedGroup: group }; });

    $scope.people = loadAll();
    $scope.querySearch = querySearch;
    $scope.selectedItem=$scope.eventResponsible;

    function querySearch (query) {
        var results = query ? $scope.people.filter( createFilterFor(query) ) : $scope.people, deferred;
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
    }
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll() {
        $scope.tempPeople=PeopleService.people;
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
    $scope.submit=function(){
        var startTime=moment($scope.startHour+':'+$scope.startMinute,'HH:mm');
        var endTime=moment($scope.endHour+':'+$scope.endMinute,'HH:mm');

        if(startTime.isBefore(endTime)){
            $scope.editedEvent.startTime=startTime.format('HH:mm');
            $scope.editedEvent.endTime=endTime.format('HH:mm');
            $scope.editedEvent.title=$scope.eventTitle;
            $scope.editedEvent.description=$scope.eventContent;
            $scope.editedEvent.place=$scope.eventPlace;
            $scope.editedEvent.type=$scope.eventType;
            $scope.editedEvent.group=$scope.eventType=='extra' ? '' : $scope.eventGroup ;
            if($scope.selectedItem != undefined ){
                $scope.editedEvent.responsible=$scope.selectedItem.display;
            }
            else{
                $scope.editedEvent.responsible='No one';
            }

            ScheduleService.events[tempKey]=$scope.editedEvent;

            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Event updated'));
        }else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }

    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

function eventAddDialogController($scope,$http, $mdDialog, $timeout, $q, $mdToast, Data, ProfileService, ScheduleService, NotificationService, PeopleService){
    var type=Data.AddEventType;

    $scope.minDate=new Date();
    $scope.minDate.setDate((new Date()).getDate()-1);

    $scope.eventTitle='';
    $scope.eventContent='';
    $scope.eventPlace='';
    $scope.eventGroup='';
    $scope.eventResponsible='';
    $scope.eventType=type;
    $scope.eventDate=new Date();

    $scope.startHour='';
    $scope.startMinute='';
    $scope.endHour='';
    $scope.endMinute='';

    $scope.places=[];
    $http.get('/getPlaces').success(function(data){
        $scope.places=data;
    });

    $scope.groups=[];
    $http.get('/getGroups').success(function(data){
        $scope.groups=data;
    });

    $scope.people=[];
    $http.get('/getTeachers').success(function(data){
        $scope.people = loadAll(data);
    });
    $scope.querySearch = querySearch;
    $scope.selectedPerson=$scope.eventResponsible;

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) { return { selectedHour: hour }; });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) { return { selectedMinute: minute }; });
    $scope.types=['lesson','meeting'].map(function (type) { return { selectedType: type }; });



    function querySearch (query) {
        var results = query ? $scope.people.filter( createFilterFor(query) ) : $scope.people, deferred;
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
    }
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll(people) {
        var stuffName=[];
        var stuffId=[];
        for(var key in people){
            stuffName.push(people[key].name);
            stuffId.push(people[key].id);
        }
        return stuffName.map( function (name) {
            return {
                value: name.toLowerCase(),
                display: name
            };
        });
    }
    $scope.submit=function(){
        $scope.editedEvent={};

        var startTime=moment($scope.startHour+':'+$scope.startMinute,'HH:mm');
        var endTime=moment($scope.endHour+':'+$scope.endMinute,'HH:mm');

        if(startTime.isBefore(endTime)){
            $scope.editedEvent.startTime=startTime.format('HH:mm');
            $scope.editedEvent.endTime=endTime.format('HH:mm');
            $scope.editedEvent.title=$scope.eventTitle;
            $scope.editedEvent.description=$scope.eventContent;
            $scope.editedEvent.place=$scope.eventPlace;
            $scope.editedEvent.group=$scope.eventGroup;
            $scope.editedEvent.type=$scope.eventType;
            $scope.editedEvent.date=moment($scope.eventDate).format("MM-DD-YYYY");
            $scope.editedEvent.owner=ProfileService.user_name;
            $scope.editedEvent.status= type == 'extra' ? 'requested':'not done';
            $scope.editedEvent.id=15;
            if($scope.selectedItem != undefined ){
                $scope.editedEvent.responsible=$scope.selectedItem.display;
            }
            else{
                $scope.editedEvent.responsible='No one';
            }

            ScheduleService.events.push($scope.editedEvent);

            NotificationService.notifications.splice(0, 0, {
                text: 'New request from '+ProfileService.user_name,
                source: 15,
                type: 'extra',
                date: moment().format('MM-DD-YYYY, HH:mm')
            });

            console.log(ScheduleService.events);

            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Event Added'));
        }else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }

    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

// Notification dialog controllers

function notificationSelectDialogController($scope, $mdDialog, $mdToast, Data){
    var tempKey='';

    $scope.data=Data.NotificationData;
    console.log($scope.data);

    $scope.editMode=false;

    if($scope.data.source_table == 'announcements') {
        $scope.notificationDate = $scope.data.updated_at;
        $scope.notificationTitle = 'Announcement';
        $scope.notificationContent = $scope.data.body;
        $scope.notificationOwner = $scope.data.owner.name;
    }
    else {
        $scope.notificationDate = $scope.notification.date;
        $scope.notificationTitle = 'Extra lesson';
        $scope.notificationContent = $scope.notification.description;
        $scope.notificationOwner = $scope.notification.owner;
        $scope.notificationStatus = $scope.notification.status;
    }



    $scope.showStatus=function(check){
        if(check=='requested')
            return 'Not answered yet';
        else if(check=='accepted')
            return 'Accepted';
        else
            return 'Rejected';
    };

    $scope.eventAccept=function(bool){
        if(bool){
            ScheduleService.events[tempKey].status='accepted';
            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Extra lesson request accepted'));
        }else{
            ScheduleService.events[tempKey].status='rejected';
            $mdDialog.hide();
            var toast = $mdToast.simple()
                .textContent('Extra lesson request rejected')
                .action('UNDO')
                .highlightAction(true);
            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {
                    ScheduleService.events[tempKey].status='requested';
                }
            });
        }
    };

    $scope.edit=function(){
        $scope.editMode=true;
    };
    //var startTime = $scope.notification.startTime.split(':');
    //var endTime = $scope.notification.endTime.split(':');

    $scope.startHour = '10';
    $scope.startMinute = '00';
    $scope.endHour = '12';
    $scope.endMinute = '15';


    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {return {selectedHour: hour};});
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {return {selectedMinute: minute};});


    $scope.update=function(){
        var startTime=moment($scope.startHour+':'+$scope.startMinute,'HH:mm');
        var endTime=moment($scope.endHour+':'+$scope.endMinute,'HH:mm');

        if(startTime.isBefore(endTime)){
            $scope.notification.startTime=startTime.format('HH:mm');
            $scope.notification.endTime=endTime.format('HH:mm');

            ScheduleService.events[tempKey]=$scope.notification;

            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Request updated'));
        }else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

// Assignment add dialog controller

function assignmentAddDialogController($scope, $mdDialog, $mdToast, ProfileService, AssignmentService, ScheduleService, NotificationService){


    $scope.minDate=new Date();
    $scope.minDate.setDate((new Date()).getDate()-1);

    $scope.assignmentTitle='';
    $scope.assignmentRule='';
    $scope.assignmentGroup='';


    $scope.assignmentStartDate='';
    $scope.assignmentEndDate='';

    $scope.startHour='';
    $scope.startMinute='';
    $scope.endHour='';
    $scope.endMinute='';

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) { return { selectedHour: hour }; });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) { return { selectedMinute: minute }; });


    $scope.submit=function(){
        $scope.addedAssignment={};

        var startDate=moment(moment($scope.assignmentStartDate).format('MM-DD-YYYY')+','+$scope.startHour+':'+$scope.startMinute,'MM-DD-YYYY,HH:mm');
        var endDate=moment(moment($scope.assignmentEndDate).format('MM-DD-YYYY')+','+$scope.endHour+':'+$scope.endMinute,'MM-DD-YYYY,HH:mm');

        if(startDate.isBefore(endDate)){
            $scope.addedAssignment.title=$scope.assignmentTitle;
            $scope.addedAssignment.rule=$scope.assignmentRule;
            $scope.addedAssignment.date=moment(new Date).format("MM-DD-YYYY, HH:mm");
            $scope.addedAssignment.startDate=startDate.format('MM-DD-YYYY, HH:mm');
            $scope.addedAssignment.endDate=endDate.format('MM-DD-YYYY, HH:mm');
            $scope.addedAssignment.owner=ProfileService.user_name;
            $scope.addedAssignment.doneCount=0;

            AssignmentService.assignments.push($scope.addedAssignment);

            console.log(AssignmentService.assignments);

            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Assignment Added'));
        }else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }

    };
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}
//useful functions
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}
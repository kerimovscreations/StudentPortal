registerApp.controller('RegisterController', function ($scope) {
    $scope.user = {};
    var today = new Date();
    var today1 = moment(today);
    $scope.maxDate = today1.format('YYYY-MM-DD');

    $scope.birthDateFormatted = function () {
        return moment($scope.user.birthDate).format('MM-DD-YYYY')
    };
});

loginApp.controller('LoginController', function () {
});

portalApp.controller('MainMenuController', function ($scope, $rootScope, $cookies, $mdDialog, $mdMedia, $timeout, $mdSidenav, $http, $location, Data) {
    $scope.toggleNavBar = buildDelayedToggler('left');

    $scope.user_name = '';
    $scope.user_email = '';
    $scope.user_type = '';
    $scope.user_id = '';

    $rootScope.notification_count = 0;

    $http.get('/getUser').success(function (result) {
        $cookies.put('userId', result['id']);
        $cookies.put('userName', result['name']);
        $cookies.put('userEmail', result['email']);
        $cookies.put('userType', result['type']);
        $scope.$emit('setUserType', result['type']);
        $cookies.put('userProfileImage', result['profile_image_path']);
        if (result['type'] == 'student') {
            $cookies.put('userGroupId', result['group_id']);
        }

        $scope.user_name = $cookies.get('userName');
        $scope.user_email = $cookies.get('userEmail');
        $scope.user_type = $cookies.get('userType');
        $scope.user_id = $cookies.get('userId');
        $scope.user_profile_pic = $cookies.get('userProfileImage');

        if ($scope.user_type == 'student') {
            var user_group_id = $cookies.get('userGroupId');
            $http.get('/getNotificationsCount/groups/' + user_group_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            });
            $http.get('/getNotificationsCount/students/' + $scope.user_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            }).error(function (data) {
                console.log(data);
            });
        }
        else if ($scope.user_type == 'mentor') {
            $http.get('/getNotificationsCount/mentors/' + $scope.user_id).success(function (data) {
                $rootScope.notification_count += parseInt(data);
            });
        }
    });

    //get the css property of element
    function getStyle(elementId, property) {
        return document.defaultView.getComputedStyle(document.getElementById(elementId), '').getPropertyValue(property);
    }

    //hide drop down profile menu when lost focus
    $scope.hideDropDown = function () {
        setTimeout(function () {
            $('#dropDown').hide()
        }, 500);
    };

    //toggle drop down profile menu when profile image pressed
    $('#toggleDropDown').click(function () {
        var temp = $('#dropDown');
        temp.toggle();
        if (getStyle('dropDown', 'display') == 'block')
            temp.focus();
    });

    //initializing the display to show dialog in full screen mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    /**
     * Show the image change pop-up menu
     */
    $scope.changeProfileImage = function () {
        Data.ChangeProfilePersonId = $scope.user_id;
        Data.ChangeProfilePersonTable = $scope.user_type + 's';

        $mdDialog.show({
            controller: changeProfilePictureController,
            templateUrl: 'dialogs/changeProfilePictureDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    /**
     * Open the edit profile dialog
     */
    $scope.editProfile = function () {
        Data.PersonTable = $scope.user_type + 's';
        Data.PersonId = $scope.user_id;

        $mdDialog.show({
            controller: personEditDialogController,
            templateUrl: 'dialogs/personEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            if ($mdSidenav(navID).isOpen()) {
                $mdSidenav(navID)
                    .close()
            } else {
                $mdSidenav(navID)
                    .open()
            }
        }, 100);
    }

    $scope.openNotification = function () {
        $location.path('/notification');
    }
})
    .controller('SectionListController', function ($scope, $location, $http, $cookies, $rootScope, Data, SectionService) {
        /*
         $http.get('/getSections').success(function (data) {
         $scope.sections = data;
         });
         */
        $scope.sections = SectionService.sections;

        $scope.$on('setUserType', function(event, args) {
            $scope.user_type = args;
        });

        $scope.user_access_level = function () {
            if ($scope.user_type === 'student')
                return 1;
            else if ($scope.user_type === 'mentor')
                return 2;
            else if ($scope.user_type === 'teacher')
                return 3;
        };

        $scope.selectSection = function (text) {
            $rootScope.current_section = text;
            $location.path('/' + text.toLowerCase());
        };

    })
    .controller('AnnouncementController', function ($scope, $rootScope, $mdDialog, $mdMedia, $mdToast, $http, $cookies, $route, Data) {
        $rootScope.current_section = 'Announcement';
        $scope.announcement_post = '';
        $scope.selected = [];
        $scope.user_type = $cookies.get('userType');
        $scope.user_id = $cookies.get('userId');

        //initialize loading
        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getAnnouncements').success(function (data) {
            $scope.announcements = data[0];
            for (var i = 0; i < $scope.announcements.length; i++) {
                $scope.announcements[i].groups = data[1][i];
                $scope.announcements[i].owner = data[2][i];
            }
            $scope.loader.loading = false;
        });

        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
        });

        $scope.post = function () {
            $scope.user_id = $cookies.get('userId');
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/postAnnouncement',
                data: {
                    body: $scope.announcement_post,
                    owner_id: $scope.user_id,
                    group_list: $scope.selected
                }
            }).success(function () {
                $scope.announcement_post = '';
                $scope.selected = [];
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Posted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deletePost = function (index) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete announcement?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $http({
                    method: 'POST',
                    url: '/deleteAnnouncement',
                    data: {id: $scope.announcements[index].id}
                }).success(function () {
                    $route.reload();
                    $mdToast.show($mdToast.simple().textContent('Deleted'));
                }).error(function (data) {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                })
            });
        };

        $scope.editPost = function (index) {
            Data.PostId = $scope.announcements[index].id;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: postEditDialogController,
                templateUrl: 'dialogs/editPostDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
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
    .controller('AttendanceController', function ($scope, $rootScope, $mdDialog, $mdMedia, $mdToast, $http, $cookies, $route, Data) {
        $rootScope.current_section = 'Attendance';

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.students = [];
        $scope.groups = [];
        var date = new Date();
        $scope.momentDate = moment(date);
        $scope.show_list = [];
        $scope.attendances = [];

        $scope.showFormattedDate = function () {
            return $scope.momentDate.format('dddd, MMMM DD YYYY');
        };

        $scope.addDayToDate = function () {
            $scope.momentDate.add(1, 'd');
            updateDate();
        };

        $scope.subtractDayFromDate = function () {
            $scope.momentDate.subtract(1, 'd');
            updateDate();
        };

        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
            for (var i = 0; i < $scope.groups.length; i++) {
                $scope.show_list[i] = false;
            }
        });

        updateDate();

        function updateDate() {
            $scope.loader.loading = true;
            $http.get('/getStudentsWithAttendances/' + $scope.momentDate.format('YYYYMMDD')).success(function (data) {
                $scope.students = data;
                $scope.loader.loading = false;
            });
        }

        $scope.toggleList = function (index) {
            $scope.show_list[index] = !$scope.show_list[index];
        };

        $scope.searchEvent = function ($event) {
            $event.stopPropagation();
        };

        $scope.postAttendance = function () {
            $scope.loader.posting = true;

            for (var i = 0; i < $scope.students.length; i++) {
                $scope.attendances[i] = $scope.students[i].attendance;
                $scope.attendances[i].student_id = $scope.students[i].id;
                $scope.attendances[i].note = $scope.students[i].attendance.note;
                $scope.attendances[i].status = parseInt($scope.students[i].attendance.status);
            }

            $http({
                method: 'POST',
                url: '/postAttendance',
                data: {
                    date: $scope.momentDate.format('YYYYMMDD'),
                    attendances: $scope.attendances
                }
            }).success(function () {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('User type changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        }
    })
    .controller('PeopleController', function ($http, $scope, $rootScope, $cookies, $route, $mdDialog, $mdMedia, $mdToast, Data) {
        $rootScope.current_section = 'People';
        $scope.user_type = $cookies.get('userType');
        $scope.students = [];
        $scope.teachers = [];
        $scope.mentors = [];
        $scope.pending = [];
        $scope.groups = [];
        $scope.show_list = [];

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.selected_group_id = null;

        if ($scope.user_type == 'teacher')
            $http.get('/getPending').success(function (data) {
                $scope.pending = data;
                $scope.loader.loading = false;
            });

        if ($scope.user_type != 'student') {
            $http.get('/getGroups').success(function (data) {
                $scope.groups = data;
                for (var i = 0; i < $scope.groups.length; i++) {
                    $scope.show_list[i] = true;
                }
            });
            $http.get('/getStudents').success(function (data) {
                $scope.students = data;
            });
        }

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
        });

        $http.get('/getTeachers').success(function (data) {
            $scope.teachers = data;
            $scope.loader.loading = false;
        });

        $scope.selectedIndex = 0;

        $scope.toggleList = function (index) {
            $scope.show_list[index] = !$scope.show_list[index];
        };

        $scope.searchEvent = function ($event) {
            $event.stopPropagation();
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.showContact = function (id, table) {
            Data.PersonId = id;
            Data.PersonTable = table;

            $mdDialog.show({
                controller: personSelectDialogController,
                templateUrl: 'dialogs/personSelectDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.changeType = function (id, type, selected_group_id) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/changeUserType',
                data: {
                    id: id,
                    type: type,
                    group_id: selected_group_id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('User type changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deleteUser = function (id) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/deleteUser',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('User deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.sendEmail = function (id) {

        }
    })
    .controller('ScheduleController', function ($scope, $rootScope, $http, $location, $cookies, $mdDialog, $timeout, $mdMedia, Data) {
        $rootScope.current_section = 'Schedule';
        $scope.Data = Data;
        $scope.user_type = $cookies.get('userType');
        $scope.events = [];

        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.dt = new Date();

        $scope.isOpen = false;

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
        });

        $scope.today = function () {
            $scope.dt = new Date();
        };
        //Watch the selected date variable and fill out the remaining 6 days' events
        $scope.$watch('dt', function () {
            $scope.loader.loading = true;
            $http.get('/getWeekEvents/' + moment($scope.dt).format('YYYYMMDD') + '-'
                + moment($scope.dt).add(6, 'd').format('YYYYMMDD')).success(function (data) {
                $scope.events = [];

                angular.forEach(data, function (value1, key) {
                    angular.forEach(value1[0], function (value, key) {
                        var temp = value;
                        temp['type'] = value1['type'];
                        $scope.events.push(temp);
                    });
                });
                $scope.loader.loading = false;
            });

            $scope.temp1 = moment($scope.dt).add(1, 'd');
            $scope.temp2 = moment($scope.dt).add(2, 'd');
            $scope.temp3 = moment($scope.dt).add(3, 'd');
            $scope.temp4 = moment($scope.dt).add(4, 'd');
            $scope.temp5 = moment($scope.dt).add(5, 'd');
            $scope.temp6 = moment($scope.dt).add(6, 'd');
        });

        $scope.displayDate = function (elem) {
            return moment(elem).format("dddd, MMMM DD YYYY");
        };

        $scope.displayMoment = function (elem) {
            return elem.format("dddd, MMMM DD YYYY");
        };

        $scope.parseDateFormatted = function (date, type) {
            return moment(date, type).format('MM-DD-YYYY');
        };

        $scope.parseDate = function (date) {
            return moment(date).format('MM-DD-YYYY');
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.eventSelect = function (type, id) {
            if (type == 'lesson')
                $location.path('/lesson/' + id);
            else if (type == 'reservation') {
                Data.SelectedReservationId = id;

                $mdDialog.show({
                    controller: reservationSelectDialogController,
                    templateUrl: 'dialogs/reservationSelectDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });

                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        };

        $scope.eventAdd = function (type) {
            if (type == 'lesson')
                $location.path('/add-lesson');
            else if (type == 'reservation') {
                Data.SelectedMentor = [];
                $mdDialog.show({
                    controller: reservationAddDialogController,
                    templateUrl: 'dialogs/reservationAddDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        }
    })
    .controller('AssignmentsController', function ($scope, $rootScope, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Assignment';
        $scope.assignments = [];
        $scope.status = false;

        $scope.showDeadlineFromNow = function (date) {
            return moment(date, "MM-DD-YYYY, HH:mm").fromNow()
        };
        $scope.showDeadline = function (date) {
            return moment(date, "MM-DD-YYYY, HH:mm").format("dddd, MMMM Do YYYY, HH:MM");
        };
        $scope.showStatus = function (bool) {
            if (bool)
                return "Done";
            else
                return "Now Done";
        };

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.addAssignment = function () {
            $mdDialog.show({
                controller: assignmentAddDialogController,
                templateUrl: 'dialogs/assignmentAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    })
    .controller('GradingController', function ($rootScope) {
        $rootScope.current_section = 'Grading';
    })
    .controller('ConversationController', function ($rootScope) {
        $rootScope.current_section = 'Conversation';
    })
    .controller('NotificationController', function ($scope, $rootScope, $http, $cookies, $route, $mdDialog, $mdMedia, $mdToast, Data) {
        $rootScope.current_section = 'Notification';
        $scope.notifications = [[], []];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $scope.user_type = $cookies.get('userType');
        var user_id = $cookies.get('userId');

        if ($scope.user_type == 'student') {
            var user_group_id = $cookies.get('userGroupId');
            $http.get('/getNotifications/groups/' + user_group_id).success(function (data) {
                $scope.notifications[0] = data;
            });
            $http.get('/getNotifications/students/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }
        else if ($scope.user_type == 'mentor') {
            $scope.notifications[0] = [];
            $http.get('/getNotifications/mentors/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }
        else {
            $scope.notifications[0] = [];
            $http.get('/getNotifications/teachers/' + 0).success(function (data) {
                $scope.notifications[1] = data;
                $scope.loader.loading = false;
            });
        }

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.selectNotification = function (id, index, type) {
            if ($scope.notifications[type][index].status == 0)
                $http({
                    method: 'POST',
                    url: '/changeStatusNotification',
                    data: {id: id}
                }).success(function () {
                    $rootScope.notification_count -= 1;
                    if ($rootScope < 0) {
                        $rootScope = 0;
                    }
                    $scope.notifications[type][index].status = 1;
                    showSelectNotificationDialog(id);
                }).error(function (data) {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                });
            else
                showSelectNotificationDialog(id);
        };

        function showSelectNotificationDialog(id) {
            Data.SelectedNotificationId = id;

            $mdDialog.show({
                controller: notificationSelectDialogController,
                templateUrl: 'dialogs/notificationSelectDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        $scope.showDateFromNow = function (date) {
            return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow()
        };

        $scope.delete = function () {
            $scope.loader.posting = true;

            var list = [];

            $scope.notifications.forEach(function (notification_group) {
                notification_group.forEach(function (notification_elem) {
                    if (notification_elem.selected == true) {
                        list.push(notification_elem.id);
                    }
                })
            });

            $http({
                method: 'POST',
                url: '/deleteNotifications',
                data: {
                    list: list
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Notifications are deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        }
    })
    .controller('MentorScheduleController', function ($scope, $rootScope, $http, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Mentor Schedule';

        $scope.metors = [];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
            $scope.loader.loading = false;
        });

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

        $scope.eventAdd = function (index) {
            Data.AddEventType = 'extra';
            Data.SelectedMentor = $scope.mentors[index];

            $mdDialog.show({
                controller: reservationAddDialogController,
                templateUrl: 'dialogs/reservationAddDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    })
    .controller('SettingsController', function ($scope, $rootScope, $http, $route, $mdToast) {
        $rootScope.current_section = 'Settings';

        $scope.loader = {
            loading: true,
            posting: false
        };

        $scope.groups = [];
        $scope.places = [];

        $scope.button_disable = {
            group: false,
            place: false
        };

        $scope.addItem = {
            group: false,
            place: false
        };

        $scope.new_group = [];
        $scope.new_place = [];

        $http.get('/getPlaces').success(function (data) {
            $scope.places = data;

            $http.get('/getGroups').success(function (data) {
                $scope.groups = data;
                $scope.loader = false;
            });
        });

        $scope.toggleGroupItem = function () {
            $scope.addItem.group = !$scope.addItem.group;
            $scope.button_disable.group = !$scope.button_disable.group;
        };

        $scope.togglePlaceItem = function () {
            $scope.addItem.place = !$scope.addItem.place;
            $scope.button_disable.place = !$scope.button_disable.place;
        };

        $scope.createGroup = function () {
            $http({
                method: 'POST',
                url: '/createGroup',
                data: {
                    name: $scope.new_group.name,
                    email: $scope.new_group.email,
                    place_id: $scope.new_group.place_id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('New group created'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.createPlace = function () {
            $http({
                method: 'POST',
                url: '/createPlace',
                data: {
                    name: $scope.new_place.name
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('New place created'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deleteGroup = function (id) {
            $http({
                method: 'POST',
                url: '/deleteGroup',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Group deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.deletePlace = function (id) {
            $http({
                method: 'POST',
                url: '/deletePlace',
                data: {
                    id: id
                }
            }).success(function () {
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Place deleted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        };

        $scope.editPlace = function () {
            $mdToast.show($mdToast.simple().textContent('In the next update'));
        };

        $scope.editGroup = function () {
            $mdToast.show($mdToast.simple().textContent('In the next update'));
        }

    })
    .controller('LessonController', function ($scope, $routeParams, $http, $sce) {
        var lesson_id = $routeParams.lessonId;
        $scope.lesson = [];

        $scope.loader = {
            loading: true,
            posting: false
        };

        $http.get('/getLesson/' + lesson_id).success(function (data) {
            $scope.lesson = data;
            $scope.loader.loading = false;
        });

        $scope.deliberatelyTrustDangerousSnippet = function () {
            return $sce.trustAsHtml($scope.lesson.body);
        };

        $scope.parsedDate = function () {
            return moment($scope.lesson.date, 'YYYYMMDD').format("dddd, MMMM DD YYYY")
        }
    })
    .controller('LessonEditorController', function ($scope, $rootScope, $cookies, $http, $location, Data, $mdDialog, $mdToast, $timeout, Upload) {
        $rootScope.current_section = "Lesson Editor";

        //progress circular initialization
        $scope.loader = {
            loading: false,
            posting: false
        };

        $scope.lesson = {};
        $scope.lesson.date = new Date();

        $scope.minDate = new Date();
        $scope.minDate.setDate((new Date()).getDate());

        $scope.startHour = '';
        $scope.startMinute = '';
        $scope.endHour = '';
        $scope.endMinute = '';

        //options to selectors
        $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
            return {selectedHour: hour};
        });
        $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
            return {selectedMinute: minute};
        });

        $scope.places = [];
        $http.get('/getPlaces').success(function (data) {
            $scope.places = data;
        });

        $scope.groups = [];
        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
        });

        //get the type of user to access some actions
        $scope.user_type = $cookies.get('userType');
        var user_id = $cookies.get('userId');

        $scope.addLesson = function () {
            $scope.loader.posting = true;

            var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
            var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

            checkTime();

            function checkTime() {
                if (startTime.isBefore(endTime)) {
                    postData();
                } else {
                    $mdToast.show($mdToast.simple().textContent('Invalid time input'));
                }
            }

            //data posting function
            function postData() {
                $http({
                    method: 'POST',
                    url: '/postLesson',
                    data: {
                        title: $scope.lesson.title,
                        body: $scope.lesson.body,
                        date: moment($scope.lesson.date).format("YYYYMMDD"),
                        start_time: startTime.format('HH:mm'),
                        end_time: endTime.format('HH:mm'),
                        group_id: $scope.lesson.group,
                        place_id: $scope.lesson.place,
                        status: 0,
                        teacher_id: user_id
                    }
                }).success(function () {
                    $location.path('/schedule');
                    $mdToast.show($mdToast.simple().textContent('Lesson added'));
                }).error(function (data) {
                    $scope.loader.posting = false;
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                    console.log(data);
                })
            }
        };

        $scope.trixAttachmentAdd = function (e) {
            var attachment;
            attachment = e.attachment;
            if (attachment.file) {
                return upload(attachment);
            }
        };

        function upload(attachment) {
            Upload.upload({
                url: '/uploadFile',
                data: {
                    file: attachment.file
                }
            }).then(function (resp) {
                if (resp.status == 200) {
                    attachment.setAttributes({
                        url: resp.data.href,
                        href: resp.data.href
                    });
                    $mdToast.show($mdToast.simple().textContent('File uploaded'));
                }
                else {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                }
            }, null, function (evt) {
                var progress;
                progress = parseInt(100.0 * evt.loaded / evt.total);
                return attachment.setUploadProgress(progress);
            });
        }
    });
// Announcement edit dialog controller

function postEditDialogController($scope, $mdDialog, $http, $mdToast, Data, $route) {
    var announcement_id = Data.PostId;
    $scope.loader = {
        loading: true,
        posting: false
    };

    $scope.selected = [];

    $http.get('/getAnnouncement/' + announcement_id).success(function (data) {
        $scope.tempAnnouncement = data;
        $scope.tempAnnouncement.groups.forEach(function (group) {
            $scope.selected.push(group.id);
        });
        $scope.edited_post = $scope.tempAnnouncement.body;
        $scope.loader.loading = false;
    });

    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.update = function () {
        $scope.loader.posting = true;
        $http({
            method: 'POST',
            url: '/updateAnnouncement',
            data: {
                id: announcement_id,
                body: $scope.edited_post,
                group_list: $scope.selected
            }
        }).success(function () {
            $mdDialog.hide();
            $route.reload();
            $mdToast.show($mdToast.simple().textContent('Post edited'));
        }).error(function (data) {
            $scope.loader.posting = false;
            $mdToast.show($mdToast.simple().textContent('Error occurred'));
            console.log(data);
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
}

// Schedule dialog controllers

function reservationSelectDialogController($scope, $http, $route, $cookies, $mdDialog, $mdMedia, $mdToast, Data) {
    //initialize loading
    $scope.loader = {
        loading: true,
        posting: false
    };
    var id = Data.SelectedReservationId;
    $scope.user_name = $cookies.get('userName');
    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.select_reservation = [];
    $scope.select_reservation_status = false;

    $scope.statusChangeCheck = function () {
        return false
    };
    $scope.checkOwner = function () {
        return false
    };

    $http.get('/getReservation/' + id).success(function (data) {
        $scope.loader.loading = false;
        $scope.select_reservation = data;
        $scope.select_reservation_status = $scope.select_reservation.status == 1;

        // to enable the switch to mark as 'done' if it's decided and user is the first responsible person
        $scope.statusChangeCheck = function () {
            return ($scope.select_reservation.status == 0
            && $scope.user_id == $scope.select_reservation.student_id
            && $scope.user_type == 'student');
        };

        // to display the delete and edit icon if user has an access to do actions
        $scope.checkOwner = function () {
            return ($scope.select_reservation.student_id == $scope.user_id && $scope.user_type == 'student') || $scope.user_type == 'teacher';
        };

    });

    $scope.onChange = function (cbState) {
        if (cbState)
            $scope.select_reservation.status = 1;
        else
            $scope.select_reservation.status = 0;
        $http({
            method: 'POST',
            url: '/changeStatusReservation',
            data: {
                id: id,
                status: $scope.select_reservation_status,
                from: $scope.user_type
            }
        }).success(function () {
            $mdToast.show($mdToast.simple().textContent('Event marked as ' + $scope.showStatus($scope.select_reservation.status)));
        }).error(function (data) {
            $mdToast.show($mdToast.simple().textContent('Error occurred'));
            console.log(data);
        });
    };

    $scope.showStatus = function (status) {
        switch (status) {
            case null:
                return 'Not decided';
                break;
            case '0':
                return 'Not Done';
                break;
            case 0:
                return 'Not Done';
                break;
            case '1':
                return 'Done';
                break;
            case 1:
                return 'Done';
                break;
            case 2:
                return 'Rejected';
                break;
            case '2':
                return 'Rejected';
                break;
            default:
                return 'Not Done';
                break;
        }
    };

    $scope.dateExtended = function (date) {
        return moment(date, 'YYYYMMDD').format("dddd, MMMM DD YYYY");
    };

    $scope.edit = function () {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: reservationEditDialogController,
            templateUrl: 'dialogs/reservationEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };
    $scope.delete = function () {
        var confirm = $mdDialog.confirm()
            .title('Are you sure to delete event?')
            .ok('Delete')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function () {
            $http({
                method: 'POST',
                url: '/deleteReservation',
                data: {
                    id: id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation deleted'));
            }).error(function (data) {
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        });
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function reservationEditDialogController($scope, $http, $route, $cookies, $mdDialog, $timeout, $q, $mdToast, Data) {
    //initializing progress loading
    $scope.loader = {
        loading: true,
        posting: false
    };
    var id = Data.SelectedReservationId;
    var user_type = $cookies.get('userType');
    $scope.edit_reservation = null;

    var startTime = [];
    var endTime = [];

    $scope.checkStudent = function () {
        return user_type == 'student';
    };

    $http.get('/getReservation/' + id).success(function (data) {
        $scope.edit_reservation = data;
        $scope.edit_reservation.date = new Date(moment($scope.edit_reservation.date, 'YYYYMMDD'));

        startTime = $scope.edit_reservation.start_time.split(':');
        endTime = $scope.edit_reservation.end_time.split(':');

        $scope.startHour = startTime[0];
        $scope.startMinute = startTime[1];
        $scope.endHour = endTime[0];
        $scope.endMinute = endTime[1];

        $scope.selectedResponsible1 = null;
        $scope.selectedResponsible2 = null;

        $http.get('/getMentors').success(function (data) {
            $scope.searchResponsiblePeople2 = loadAll(data);
            for (key in $scope.searchResponsiblePeople2) {
                if ($scope.searchResponsiblePeople2[key].id == $scope.edit_reservation.mentor_id) {
                    $scope.selectedResponsible2 = $scope.searchResponsiblePeople2[key];
                }
            }
        });
        $scope.loader.loading = false;
    });

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    $scope.querySearch = querySearch;

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    function querySearch(query, people) {
        var results = query ? people.filter(createFilterFor(query)) : people, deferred;
        deferred = $q.defer();
        $timeout(function () {
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll(people) {
        for (key in people) {
            people[key].value = (people[key].name).toLowerCase();
        }
        return people;
    }

    $scope.submit = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if (user_type == 'student') {
            $scope.edit_reservation.status = null;
        }

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/updateReservation',
                data: {
                    id: $scope.edit_reservation.id,
                    title: $scope.edit_reservation.title,
                    description: $scope.edit_reservation.description,
                    date: moment($scope.edit_reservation.date).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    place_id: $scope.edit_reservation.place_id,
                    status: $scope.edit_reservation.status,
                    mentor_id: $scope.selectedResponsible2.id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation updated'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function reservationAddDialogController($scope, $http, $cookies, $route, $mdDialog, $timeout, $q, $mdToast, Data) {
    $scope.loader = {
        posting: false
    };
    var user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.minDate = new Date();
    $scope.minDate.setDate((new Date()).getDate());

    $scope.eventDescription = '';
    $scope.eventPlace = '';
    $scope.eventStatus = null;
    $scope.eventResponsible1 = [];
    $scope.eventResponsible2 = Data.SelectedMentor;
    $scope.eventDate = new Date();

    $scope.startHour = '';
    $scope.startMinute = '';
    $scope.endHour = '';
    $scope.endMinute = '';

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    if ($scope.user_type != 'student')
        $http.get('/getStudents').success(function (data) {
            $scope.searchResponsiblePeople1 = loadAll(data);
        });

    $http.get('/getMentors').success(function (data) {
        $scope.searchResponsiblePeople2 = loadAll(data);
    });

    $scope.querySearch = querySearch;
    $scope.selectedResponsible1 = $scope.eventResponsible1;
    $scope.selectedResponsible2 = $scope.eventResponsible2;

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    function querySearch(query, people) {
        var results = query ? people.filter(createFilterFor(query)) : people, deferred;
        deferred = $q.defer();
        $timeout(function () {
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(person) {
            return (person.value.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadAll(people) {
        for (var key in people) {
            people[key].value = (people[key].name).toLowerCase();
        }
        return people;
    }

    $scope.submit = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        console.log($scope.selectedResponsible1);
        if ($scope.user_type == 'teacher')
            $scope.eventStatus = 0;
        else if ($scope.user_type == 'student') {
            $scope.selectedResponsible1.id = user_id;
        }

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/addReservation',
                data: {
                    description: $scope.eventDescription,
                    date: moment($scope.eventDate).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    place_id: $scope.eventPlace,
                    status: $scope.eventStatus,
                    student_id: $scope.selectedResponsible1.id,
                    mentor_id: $scope.selectedResponsible2.id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation added'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

// Notification dialog controllers

function notificationSelectDialogController($scope, $route, $http, $cookies, $mdDialog, $mdToast, Data) {
    $scope.loader = {
        loading: true,
        posting: false
    };

    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');
    $scope.notification_data = [];
    $scope.notification_data.status = null;

    $scope.editMode = false;

    var notification_id = Data.SelectedNotificationId;

    $http.get('/getNotification/' + notification_id).success(function (data) {
        $scope.loader.loading = false;

        $scope.notification_data = data;

        if ($scope.notification_data.type == 'announcement') {
            $scope.notificationDate = $scope.notification_data.updated_at;
            $scope.notificationTitle = 'Announcement';
            $scope.notificationContent = $scope.notification_data.body;
            $scope.notificationOwner = $scope.notification_data.owner.name;
            $scope.notificationOwnerId = $scope.notification_data.owner.id;
        }
        else if ($scope.notification_data.type == 'reservation') {
            $scope.notificationTitle = 'Mentor reservation';

            $scope.notificationDate = $scope.notification_data.date;
            $scope.notificationContent = $scope.notification_data.description;
            //for teacher case
            if ($scope.notification_data.receiver.length == 0)
                $scope.notificationReceiverId = 0;
            else
                $scope.notificationReceiverId = $scope.notification_data.receiver.id;
            $scope.notificationReceiverType = $scope.notification_data.receiver_type;

            var startTime = $scope.notification_data.start_time.split(':');
            var endTime = $scope.notification_data.end_time.split(':');

            $scope.startHour = startTime[0];
            $scope.startMinute = startTime[1];
            $scope.endHour = endTime[0];
            $scope.endMinute = endTime[1];
        }

        //edit icon checker
        $scope.edit_check = (
        !$scope.editMode
        && $scope.notification_data.status == null
        && $scope.notificationReceiverType == $scope.user_type
        && $scope.notificationReceiverId == $scope.user_id);

    }).error(function (data) {
        $mdToast.show($mdToast.simple().textContent('Error loading notification data'));
        $mdDialog.hide();
        $route.reload();
        console.log(data);
    });

    $scope.reservationRespondCheck = function () {
        return !$scope.editMode
            && $scope.notification_data.status == null
            && $scope.notification_data.type == 'reservation'
            && $scope.user_type != 'teacher'
    };

    $scope.showStatus = function (check) {
        if (check == null)
            return 'Not decided yet';
        else if (check == 0)
            return 'Decided';
        else if (check == 2)
            return 'Rejected';
        else if (check == 1)
            return 'Done';
    };

    $scope.reservationAccept = function (bool) {
        $scope.loader.posting = true;
        if (bool) {
            $http({
                method: 'POST',
                url: '/changeStatusReservation',
                data: {
                    id: $scope.notification_data.id,
                    status: 0,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Extra lesson request accepted'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        } else {
            $http({
                method: 'POST',
                url: '/changeStatusReservation',
                data: {
                    id: $scope.notification_data.id,
                    status: 2,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation rejected'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        }
    };

    $scope.edit = function () {
        $scope.editMode = true;
    };

    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    $scope.dateExtended = function (date) {
        return moment(date, 'YYYYMMDD').format("dddd, MMMM DD YYYY");
    };

    $scope.update = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if (startTime.isBefore(endTime)) {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/changeTimeReservation',
                data: {
                    id: $scope.notification_data.id,
                    startTime: startTime.format('HH:mm'),
                    endTime: endTime.format('HH:mm'),
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Reservation time changed changed'));
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            });
        } else {
            $mdToast.show($mdToast.simple().textContent('Invalid time input'));
        }
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

//Person select dialog controller

function personSelectDialogController($scope, $http, $cookies, $mdDialog, $mdMedia, Data) {
    //initializing variables
    $scope.person_data = [];
    $scope.loader = {
        loading: true
    };
    //get the selected person data from factory
    $scope.person_table = Data.PersonTable;
    $scope.person_id = Data.PersonId;
    //get the user's data from cookie
    var user_type = $cookies.get('userType');
    var user_id = $cookies.get('userId');

    //get the data of selected person from server
    $http.get('/getDataUser/' + $scope.person_table + '/' + $scope.person_id).success(function (data) {
        $scope.person_data = data;
        $scope.loader.loading = false;
    });

    //check the user has access to edit personal data
    $scope.checkOwner = function () {
        return (user_type == 'teacher' || (user_id == $scope.person_id && (user_type + 's') == $scope.person_table)) && $scope.person_table != 'users';
    };

    //convert the birth date to readable format
    $scope.displayBirthDate = function () {
        return moment($scope.person_data.birthDate, 'MM-DD-YYYY').format('D MMMM YYYY')
    };

    //initializing the display to show dialog in full screnn mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    //call the edit personal data dialog
    $scope.edit = function () {
        $mdDialog.show({
            controller: personEditDialogController,
            templateUrl: 'dialogs/personEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function personEditDialogController($scope, $http, $cookies, $mdMedia, $mdDialog, $mdToast, $route, Data) {
    //progress circular initialization
    $scope.loader = {
        loading: true,
        posting: false
    };
    //get the type of user to access some actions
    $scope.user_type = $cookies.get('userType');
    $scope.user_id = $cookies.get('userId');

    //get the edited person data from factory
    $scope.edited_person_id = Data.PersonId;
    $scope.edited_person_table = Data.PersonTable;

    //get the type of user to access some actions
    $scope.user_type = $cookies.get('userType');

    //get the work days and hours for teachers and mentors
    $scope.selected_days = [];
    $scope.startHour = null;
    $scope.startMinute = null;
    $scope.endHour = null;
    $scope.endMinute = null;
    $scope.old_password = '';
    $scope.new_password = '';
    $scope.new_password_confirm = '';

    //model for week days list
    $scope.week_days = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

    //options to selectors
    $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
        return {selectedHour: hour};
    });
    $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
        return {selectedMinute: minute};
    });

    //get the list of groups
    $scope.groups = [];
    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
    });

    //get the edited person's data from server
    $http.get('/getDataUser/' + $scope.edited_person_table + '/' + $scope.edited_person_id).success(function (data) {
        $scope.edited_person_data = data;
        if ($scope.edited_person_data.work_days) {
            $scope.selected_days = $scope.edited_person_data.work_days.split(',');

            var startTime = $scope.edited_person_data.work_start_time.split(':');
            var endTime = $scope.edited_person_data.work_end_time.split(':');

            $scope.startHour = startTime[0];
            $scope.startMinute = startTime[1];
            $scope.endHour = endTime[0];
            $scope.endMinute = endTime[1];
        }
        $scope.loader.loading = false;
    });

    //convert the birth date to readable format
    $scope.displayBirthDate = function (date) {
        return moment(date, 'MM-DD-YYYY').format('D MMMM YYYY')
    };

    //initializing the display to show dialog in full screen mode
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

    //change profile picture
    $scope.changeProfileImage = function () {
        if ($scope.checkOwner()) {
            $mdDialog.show({
                controller: changeProfilePictureController,
                templateUrl: 'dialogs/changeProfilePictureDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    };

    //check the owner of data
    $scope.checkOwner = function () {
        return $scope.user_id == $scope.edited_person_id &&
            $scope.user_type + 's' == $scope.edited_person_table;
    };

    //update the personal info
    $scope.update = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if ($scope.old_password.length != 0) {
            if ($scope.new_password == $scope.new_password_confirm) {
                if ($scope.new_password.length <= 8)
                    $mdToast.show($mdToast.simple().textContent('Password should be at least 8 character!'));
                else
                    checkTime();
            } else {
                $mdToast.show($mdToast.simple().textContent('Passwords don\'t match'));
            }
        } else
            checkTime();

        function checkTime() {
            if ($scope.edited_person_table != 'students' && $scope.edited_person_table != 'users') {
                if (startTime.isBefore(endTime)) {
                    postData();
                } else {
                    $mdToast.show($mdToast.simple().textContent('Invalid time input'));
                }
            } else
                postData();
        }

        //data posting function
        function postData() {
            $scope.loader.posting = true;
            $http({
                method: 'POST',
                url: '/updateUser',
                data: {
                    table: $scope.edited_person_table,
                    id: $scope.edited_person_id,
                    name: $scope.edited_person_data.name,
                    email: $scope.edited_person_data.email,
                    old_pass: $scope.old_password,
                    new_pass: $scope.new_password,
                    phone: $scope.edited_person_data.phone,
                    birthDate: $scope.edited_person_data.birthDate,
                    group_id: $scope.edited_person_data.group_id,
                    work_days: $scope.selected_days.join(','),
                    work_start_time: startTime.format('HH:mm'),
                    work_end_time: endTime.format('HH:mm'),
                    bio: $scope.edited_person_data.bio
                }
            }).success(function (data) {
                if (data == 2) {
                    $scope.loader.posting = false;
                    $mdToast.show($mdToast.simple().textContent('Old password doesn\'t match!'));
                } else {
                    $mdDialog.hide();
                    $route.reload();
                    $mdToast.show($mdToast.simple().textContent('Personal data updated'));
                }
            }).error(function (data) {
                $scope.loader.posting = false;
                $mdToast.show($mdToast.simple().textContent('Error occurred'));
                console.log(data);
            })
        }
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

}

//Profile picture edit controller

function changeProfilePictureController($scope, $cookies, $mdDialog, $mdToast, $timeout, Upload) {
    //progress circular initialization
    $scope.loader = {
        loading: false,
        posting: false
    };

    //get the type of user to access some actions
    var user_type = $cookies.get('userType');
    var user_id = $cookies.get('userId');

    //upload the cropped image to server
    $scope.upload = function (dataUrl, name) {
        $scope.loader.posting = true;
        Upload.upload({
            url: '/uploadImage',
            data: {
                user_type: user_type,
                user_id: user_id,
                file: Upload.dataUrltoBlob(dataUrl, name)
            }
        }).then(function (resp) {
            $timeout(function () {
                $scope.loader.posting = false;
                if (resp.status == 200) {
                    $mdDialog.hide();
                    location.reload();
                    $mdToast.show($mdToast.simple().textContent('Picture uploaded'));
                }
                else {
                    $mdToast.show($mdToast.simple().textContent('Error occurred'));
                }
            });
        }, null, null);
    };

    //help functions
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

// Assignment add dialog controller

function assignmentAddDialogController($scope, $mdDialog, $mdToast) {
    /*
     $scope.minDate = new Date();
     $scope.minDate.setDate((new Date()).getDate());

     $scope.assignmentTitle = '';
     $scope.assignmentRule = '';
     $scope.assignmentGroup = '';


     $scope.assignmentStartDate = '';
     $scope.assignmentEndDate = '';

     $scope.startHour = '';
     $scope.startMinute = '';
     $scope.endHour = '';
     $scope.endMinute = '';

     //options to selectors
     $scope.hours = ('08 09 10 11 12 13 14 15 16 17 18 19 20 21 22').split(' ').map(function (hour) {
     return {selectedHour: hour};
     });
     $scope.minutes = ('00 15 30 45').split(' ').map(function (minute) {
     return {selectedMinute: minute};
     });


     $scope.submit = function () {
     $scope.addedAssignment = {};

     var startDate = moment(moment($scope.assignmentStartDate).format('MM-DD-YYYY') + ',' + $scope.startHour + ':' + $scope.startMinute, 'MM-DD-YYYY,HH:mm');
     var endDate = moment(moment($scope.assignmentEndDate).format('MM-DD-YYYY') + ',' + $scope.endHour + ':' + $scope.endMinute, 'MM-DD-YYYY,HH:mm');

     if (startDate.isBefore(endDate)) {
     $scope.addedAssignment.title = $scope.assignmentTitle;
     $scope.addedAssignment.rule = $scope.assignmentRule;
     $scope.addedAssignment.date = moment(new Date).format("MM-DD-YYYY, HH:mm");
     $scope.addedAssignment.startDate = startDate.format('MM-DD-YYYY, HH:mm');
     $scope.addedAssignment.endDate = endDate.format('MM-DD-YYYY, HH:mm');
     $scope.addedAssignment.owner = ProfileService.user_name;
     $scope.addedAssignment.doneCount = 0;

     $mdDialog.hide();
     $mdToast.show($mdToast.simple().textContent('Assignment Added'));
     } else {
     $mdToast.show($mdToast.simple().textContent('Invalid time input'));
     }

     };
     $scope.hide = function () {
     $mdDialog.hide();
     };
     $scope.cancel = function () {
     $mdDialog.cancel();
     };
     */
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
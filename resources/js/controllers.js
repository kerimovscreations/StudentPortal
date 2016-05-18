registerApp.controller('RegisterController', function ($scope) {
    $scope.select_user_type = 'student';
});

loginApp.controller('LoginController', function ($scope) {
    $scope.select_user_type = 'student';
});

portalApp.controller('MainMenuController', function ($scope, $rootScope, $cookies, $mdDialog, $mdMedia, $timeout, $mdSidenav, $http, $location, Data) {

    $scope.toggleNavBar = buildDelayedToggler('left');

    $http.get('/getUser').success(function (result) {
        $cookies.put('userId', result['id']);
        $cookies.put('userName', result['name']);
        $cookies.put('userEmail', result['email']);
        $cookies.put('userType', result['type']);
        if (result['type'] == 'student') {
            $cookies.put('userGroupId', result['group_id']);
        }

        $scope.user_name = $cookies.get('userName');
        $scope.user_email = $cookies.get('userEmail');
        $scope.user_type = $cookies.get('userType');
        $scope.user_id = $cookies.get('userId');
    });

    $rootScope.notification_count = 0;

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

    var dropDownMenu = document.getElementById('dropDownProfile');

    $scope.toggleDropDownProfile = function () {
        if (dropDownMenu.style.display == 'none') {
            dropDownMenu.style.display = 'block';
        } else {
            dropDownMenu.style.display = 'none';
        }
    };

    /**
     * Show the image change pop-up menu
     */
    $scope.changeProfileImage = function () {
    };

    /**
     * Open the edit profile dialog
     */

    $scope.editProfile = function () {
        Data.PersonTable = $scope.user_type + 's';
        Data.PersonId = $scope.user_id;

        //initializing the display to show dialog in full screnn mode
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
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
    .controller('SectionListController', function ($scope, $location, $http, $rootScope, Data, SectionService) {
        /*
         $http.get('/getSections').success(function (data) {
         $scope.sections = data;
         });
         */
        $scope.sections = SectionService.sections;

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

        $http.get('/getAnnouncements').success(function (data) {
            $scope.announcements = data[0];
            for (var i = 0; i < $scope.announcements.length; i++) {
                $scope.announcements[i].groups = data[1][i];
                $scope.announcements[i].owner = data[2][i];
            }
        });

        $http.get('/getGroups').success(function (data) {
            $scope.groups = data;
        });

        $scope.post = function () {
            $scope.user_id = $cookies.get('userId');
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
                })
            });
        };

        $scope.editPost = function (index) {
            Data.PostId = index;
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
    .controller('PeopleController', function ($http, $scope, $rootScope, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'People';
        $scope.students = [];
        $scope.teachers = [];
        $scope.mentors = [];

        $http.get('/getStudents').success(function (data) {
            $scope.students = data;
        });
        $http.get('/getTeachers').success(function (data) {
            $scope.teachers = data;
        });
        $http.get('/getMentors').success(function (data) {
            $scope.mentors = data;
        });

        $scope.selectedIndex = 0;

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


        $scope.sendEmail = function (id) {

        }
    })
    .controller('ScheduleController', function ($scope, $rootScope, $http, $cookies, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Schedule';
        $scope.Data = Data;
        $scope.user_type = $cookies.get('userType');
        $scope.events = [];

        $scope.dt = new Date();

        $scope.today = function () {
            $scope.dt = new Date();
        };

        //Watch the selected date variable and fill out the remaining 6 days' events
        $scope.$watch('dt', function () {
            $http.get('/getWeekEvents/' + moment($scope.dt).format('YYYYMMDD')).success(function (data) {
                $scope.events = data;
            });
            $scope.temp1 = moment($scope.dt).add(1, 'd');
            $scope.temp2 = moment($scope.dt).add(2, 'd');
            $scope.temp3 = moment($scope.dt).add(3, 'd');
            $scope.temp4 = moment($scope.dt).add(4, 'd');
            $scope.temp5 = moment($scope.dt).add(5, 'd');
            $scope.temp6 = moment($scope.dt).add(6, 'd');
        });

        //FAB button to add new event
        $scope.isOpen = false;
        $scope.fab_btn = {
            isOpen: false,
            count: 0
        };

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

        $scope.eventSelect = function (id) {
            Data.EventId = id;

            $mdDialog.show({
                controller: eventSelectDialogController,
                templateUrl: 'dialogs/eventSelectDialog.html',
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

        $scope.eventAdd = function (type) {
            $scope.Data.AddEventType = type;

            $mdDialog.show({
                controller: eventAddDialogController,
                templateUrl: 'dialogs/eventAddDialog.html',
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
    .controller('NotificationController', function ($scope, $rootScope, $http, $cookies, $route, $mdDialog, $mdMedia, Data) {
        $rootScope.current_section = 'Notification';
        $scope.notifications = [[], []];

        $scope.user_type = $cookies.get('userType');
        var user_id = $cookies.get('userId');

        if ($scope.user_type == 'student') {
            var user_group_id = $cookies.get('userGroupId');
            $http.get('/getNotifications/groups/' + user_group_id).success(function (data) {
                $scope.notifications[0] = data;
            });
            $http.get('/getNotifications/students/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
            });
        }
        else {
            $scope.notifications[0] = [];
            $http.get('/getNotifications/mentors/' + user_id).success(function (data) {
                $scope.notifications[1] = data;
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
                    $scope.notifications[type][index].status = 1;
                    showSelectNotificationDialog(id);
                });
            else
                showSelectNotificationDialog(id);
        };

        function showSelectNotificationDialog(id) {
            $http.get('/getNotification/' + id).success(function (data) {
                Data.NotificationData = data;

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
            });
        }

        $scope.showDateFromNow = function (date) {
            return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow()
        };

    })

// Announcement edit dialog controller

function postEditDialogController($scope, $mdDialog, AnnouncementService, $mdToast, Data) {
    var index = Data.PostId;
    $scope.tempAnnouncement = AnnouncementService.announcements[index];
    $scope.selected = $scope.tempAnnouncement.groups.slice();
    $scope.edited_post = $scope.tempAnnouncement.text;
    $scope.groups = AnnouncementService.groups;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.update = function () {
        var date = new Date();
        AnnouncementService.announcements[index].date = date;
        AnnouncementService.announcements[index].text = $scope.edited_post;
        AnnouncementService.announcements[index].groups = $scope.selected;
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

function eventSelectDialogController($scope, $http, $route, $cookies, $mdDialog, $mdMedia, $mdToast, Data) {
    var id = Data.EventId;
    $scope.user_name = $cookies.get('userName');
    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.temp_event = [];
    $scope.temp_event_status = false;

    $scope.statusChangeCheck = function () {
        return false
    };
    $scope.checkOwner = function () {
        return false
    };

    $http.get('/getEvent/' + id).success(function (data) {
        $scope.temp_event = data;
        $scope.temp_event_status = $scope.temp_event.status == 1;

        // to enable the switch to mark as 'done' if it's decided and user is the first responsible person
        if ($scope.temp_event.type == 'lesson') {
            $scope.statusChangeCheck = function () {
                return $scope.temp_event.status != 1
                    && $scope.user_id == $scope.temp_event.owner_id
                    && ($scope.user_type + 's') == $scope.temp_event.owner_table
            };
            $scope.checkOwner = function () {
                return $scope.user_type == 'teacher'
            };
        }
        else if ($scope.temp_event.type == 'extra') {
            $scope.statusChangeCheck = function () {
                if ($scope.temp_event.type == 'lesson')
                    return ($scope.temp_event.status == 0
                    && $scope.user_type == 'teacher');
                else
                    return ($scope.temp_event.status == 0
                    && $scope.user_id == $scope.temp_event.responsible_first_id
                    && ($scope.user_type + 's') == $scope.temp_event.responsible_first_table);
            };
            // to display the delete and edit icon if user has an access to do actions
            $scope.checkOwner = function () {
                return ($scope.temp_event.status != 1
                && $scope.temp_event.owner_table == ($scope.user_type + 's')
                && $scope.temp_event.owner_id == $scope.user_id);
            };
        }
    });

    $scope.onChange = function (cbState) {
        if (cbState)
            $scope.temp_event.status = 1;
        else
            $scope.temp_event.status = 0;
        $http({
            method: 'POST',
            url: '/changeStatusEvent',
            data: {
                id: id,
                status: $scope.temp_event.status,
                responsible_first_id: $scope.user_id,
                responsible_first_table: $scope.user_type + 's'
            }
        }).success(function () {
            $mdToast.show($mdToast.simple().textContent('Event marked as ' + $scope.showStatus($scope.temp_event.status)));
        });
    };

    $scope.showStatus = function (status) {
        switch (status) {
            case null:
                return 'Not decided';
                break;
            case 0:
                return 'Not Done';
                break;
            case 1:
                return 'Done';
                break;
            case 2:
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
            controller: eventEditDialogController,
            templateUrl: 'dialogs/eventEditDialog.html',
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
                url: '/deleteEvent',
                data: {
                    id: id
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Event deleted'));
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

function eventEditDialogController($scope, $http, $route, $cookies, $mdDialog, $timeout, $q, $mdToast, Data) {
    var id = Data.EventId;
    var user_id = $cookies.get('userId');
    var user_type = $cookies.get('userType');
    $scope.edit_event = null;

    var startTime = [];
    var endTime = [];

    $scope.checkStudent = function () {
        return user_type == 'student';
    };

    $http.get('/getEvent/' + id).success(function (data) {
        $scope.edit_event = data;
        $scope.event_id = $scope.edit_event.id;
        $scope.event_title = $scope.edit_event.title;
        $scope.event_description = $scope.edit_event.description;
        $scope.event_type = $scope.edit_event.type;
        $scope.event_date = new Date(moment($scope.edit_event.date, 'YYYYMMDD'));
        $scope.event_start_time = $scope.edit_event.start_time;
        $scope.event_end_time = $scope.edit_event.end_time;
        $scope.event_group_id = $scope.edit_event.group_id;
        $scope.event_place_id = $scope.edit_event.place_id;
        $scope.event_status = $scope.edit_event.status;
        $scope.event_owner_id = $scope.edit_event.owner_id;
        $scope.event_owner_table = $scope.edit_event.owner_table;
        $scope.event_responsible_first_id = $scope.edit_event.responsible_first_id;
        $scope.event_responsible_first_table = $scope.edit_event.responsible_first_table;
        $scope.event_responsible_second_id = $scope.edit_event.responsible_second_id;
        $scope.event_responsible_second_table = $scope.edit_event.responsible_second_table;

        startTime = $scope.event_start_time.split(':');
        endTime = $scope.event_end_time.split(':');

        $scope.startHour = startTime[0];
        $scope.startMinute = startTime[1];
        $scope.endHour = endTime[0];
        $scope.endMinute = endTime[1];

        $scope.selectedResponsible1 = null;
        $scope.selectedResponsible2 = null;

        if ($scope.event_type == 'lesson') {
            $scope.eventResponsible1Table = 'teachers';
            $http.get('/getTeachers').success(function (data) {
                $scope.searchResponsiblePeople1 = loadAll(data);
                for (key in $scope.searchResponsiblePeople1) {
                    if ($scope.searchResponsiblePeople1[key].id == $scope.event_responsible_first_id) {
                        $scope.selectedResponsible1 = $scope.searchResponsiblePeople1[key];
                    }
                }
            });
        }
        else {
            $scope.eventResponsible1Table = 'students';
            $scope.eventResponsible2Table = 'mentors';

            $http.get('/getStudents').success(function (data) {
                $scope.searchResponsiblePeople1 = loadAll(data);
                for (key in $scope.searchResponsiblePeople1) {
                    if ($scope.searchResponsiblePeople1[key].id == $scope.event_responsible_first_id) {
                        $scope.selectedResponsible1 = $scope.searchResponsiblePeople1[key];
                    }
                }
            });
            $http.get('/getMentors').success(function (data) {
                $scope.searchResponsiblePeople2 = loadAll(data);
                for (key in $scope.searchResponsiblePeople2) {
                    if ($scope.searchResponsiblePeople2[key].id == $scope.event_responsible_second_id) {
                        $scope.selectedResponsible2 = $scope.searchResponsiblePeople2[key];
                    }
                }
            });
        }
    });

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    $scope.groups = [];
    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
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

        if ($scope.selectedResponsible1 != null)
            $scope.event_responsible_first_id = $scope.selectedResponsible1.id;
        if ($scope.selectedResponsible2 != null)
            $scope.event_responsible_second_id = $scope.selectedResponsible2.id;

        if ($scope.event_type == 'extra' && user_type != 'teacher') {
            $scope.event_status = null;
        }

        if (startTime.isBefore(endTime)) {
            $http({
                method: 'POST',
                url: '/updateEvent',
                data: {
                    id: $scope.event_id,
                    title: $scope.event_title,
                    description: $scope.event_description,
                    type: $scope.event_type,
                    date: moment($scope.event_date).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    group_id: $scope.event_group_id,
                    place_id: $scope.event_place_id,
                    status: $scope.event_status,
                    owner_id: user_id,
                    owner_table: user_type + 's',
                    responsible_first_id: $scope.event_responsible_first_id,
                    responsible_first_table: $scope.event_responsible_first_table,
                    responsible_second_id: $scope.event_responsible_second_id,
                    responsible_second_table: $scope.event_responsible_second_table
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Event updated'));
            }).error(function (data) {
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

function eventAddDialogController($scope, $http, $cookies, $route, $mdDialog, $timeout, $q, $mdToast, Data) {
    var type = Data.AddEventType;
    var user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.minDate = new Date();
    $scope.minDate.setDate((new Date()).getDate());

    $scope.eventTitle = null;
    $scope.eventDescription = '';
    $scope.eventPlace = '';
    $scope.eventGroup = null;
    $scope.eventStatus = null;
    $scope.eventResponsible1 = [];
    $scope.eventResponsible1Table = null;
    $scope.eventResponsible2 = [];
    $scope.eventResponsible2Table = null;
    $scope.eventType = type;
    $scope.eventDate = new Date();

    $scope.startHour = '';
    $scope.startMinute = '';
    $scope.endHour = '';
    $scope.endMinute = '';

    $scope.places = [];
    $http.get('/getPlaces').success(function (data) {
        $scope.places = data;
    });

    $scope.groups = [];
    $http.get('/getGroups').success(function (data) {
        $scope.groups = data;
    });

    if (type == 'extra') {
        $scope.eventResponsible1Table = 'students';
        $scope.eventResponsible2Table = 'mentors';

        $http.get('/getStudents').success(function (data) {
            $scope.searchResponsiblePeople1 = loadAll(data);
        });
        $http.get('/getMentors').success(function (data) {
            $scope.searchResponsiblePeople2 = loadAll(data);
        });
    }

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
        for (key in people) {
            people[key].value = (people[key].name).toLowerCase();
        }
        return people;
    }

    $scope.submit = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if ($scope.user_type == 'teacher')
            $scope.eventStatus = 0;
        else if ($scope.user_type == 'student') {
            $scope.selectedResponsible1.id = user_id;
        }

        if (startTime.isBefore(endTime)) {
            $http({
                method: 'POST',
                url: '/postEvent',
                data: {
                    title: $scope.eventTitle,
                    description: $scope.eventDescription,
                    type: $scope.eventType,
                    date: moment($scope.eventDate).format("YYYYMMDD"),
                    start_time: startTime.format('HH:mm'),
                    end_time: endTime.format('HH:mm'),
                    group_id: $scope.eventGroup,
                    place_id: $scope.eventPlace,
                    status: $scope.eventStatus,
                    owner_id: user_id,
                    owner_table: $scope.user_type + 's',
                    responsible_first_id: $scope.selectedResponsible1.id,
                    responsible_first_table: $scope.eventResponsible1Table,
                    responsible_second_id: $scope.selectedResponsible2.id,
                    responsible_second_table: $scope.eventResponsible2Table,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Event Added'));
            }).error(function (data) {
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
    $scope.notification_data = Data.NotificationData;

    $scope.notificationType = $scope.notification_data.notification_type;
    $scope.notificationEventType = null;

    $scope.user_id = $cookies.get('userId');
    $scope.user_type = $cookies.get('userType');

    $scope.editMode = false;

    if ($scope.notificationType == 'announcements') {
        $scope.notificationDate = $scope.notification_data.updated_at;
        $scope.notificationTitle = 'Announcement';
        $scope.notificationContent = $scope.notification_data.body;
        $scope.notificationOwner = $scope.notification_data.owner.name;
        $scope.notificationOwnerId = $scope.notification_data.owner.id;
        $scope.notificationOwnerType = $scope.notification_data.owner_type;
    }
    else {
        $scope.notificationDate = $scope.notification_data.date;
        $scope.notificationTitle = 'Extra lesson';
        $scope.notificationContent = $scope.notification_data.description;
        $scope.notificationOwner = $scope.notification_data.owner[0].name;
        $scope.notificationAnotherResponsible = $scope.notification_data.responsible_another;
        $scope.notificationReceiverId = $scope.notification_data.receiver[0].id;
        $scope.notificationReceiverType = $scope.notification_data.receiver_type;
        $scope.notificationOwnerType = $scope.notification_data.owner_type;
        $scope.notificationStatus = $scope.notification_data.status;
        $scope.notificationEventType = $scope.notification_data.type;
        $scope.notificationStartTime = $scope.notification_data.start_time;
        $scope.notificationEndTime = $scope.notification_data.end_time;

        var startTime = $scope.notificationStartTime.split(':');
        var endTime = $scope.notificationEndTime.split(':');

        $scope.startHour = startTime[0];
        $scope.startMinute = startTime[1];
        $scope.endHour = endTime[0];
        $scope.endMinute = endTime[1];
    }

    //edit icon checker
    $scope.edit_check = (
    !$scope.editMode
    && $scope.notificationStatus == null
    && $scope.notificationOwnerType != 'teacher'
    && $scope.notificationReceiverType == $scope.user_type
    && $scope.notificationReceiverId == $scope.user_id);

    $scope.extra_respond_check = function () {
        return !$scope.editMode && $scope.notificationStatus == null && $scope.notificationOwnerType != 'teacher'
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

    $scope.eventAccept = function (bool) {
        if (bool) {
            $http({
                method: 'POST',
                url: '/changeStatusEvent',
                data: {
                    id: $scope.notification_data.id,
                    status: 0,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Extra lesson request accepted'));
            });
        } else {
            $http({
                method: 'POST',
                url: '/changeStatusEvent',
                data: {
                    id: $scope.notification_data.id,
                    status: 2,
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                var toast = $mdToast.simple()
                    .textContent('Extra lesson request rejected')
                    .action('UNDO')
                    .highlightAction(true);
                $mdToast.show(toast).then(function (response) {
                    if (response == 'ok') {
                        $http({
                            method: 'POST',
                            url: '/changeStatusEvent',
                            data: {
                                id: $scope.notification_data.id,
                                status: null,
                                from: $scope.user_type
                            }
                        }).success(function () {
                            $mdDialog.hide();
                            $route.reload();
                            $mdToast.show($mdToast.simple().textContent('Your response rolled back'));
                        });
                    }
                });
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

            $http({
                method: 'POST',
                url: '/changeTimeEvent',
                data: {
                    id: $scope.notification_data.id,
                    startTime: startTime.format('HH:mm'),
                    endTime: endTime.format('HH:mm'),
                    from: $scope.user_type
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Extra lesson time changed changed'));
            }).error(function (data) {
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
    //get the selected person data from factory
    $scope.person_table = Data.PersonTable;
    $scope.person_id = Data.PersonId;
    //get the user's data from cookie
    var user_type = $cookies.get('userType');
    var user_id = $cookies.get('userId');

    //get the data of selected person from server
    $http.get('/getDataUser/' + $scope.person_table + '/' + $scope.person_id).success(function (data) {
        $scope.person_data = data;
    });

    //check the user has access to edit personal data
    $scope.checkOwner = function () {
        return ($scope.person_table == 'students' && user_type == 'teacher') || (user_id == $scope.person_id && (user_type + 's') == $scope.person_table)
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

function personEditDialogController($scope, $http, $cookies, $mdDialog, $mdToast, $route, Data) {
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
    });

    //convert the birth date to readable format
    $scope.displayBirthDate = function (date) {
        return moment(date, 'MM-DD-YYYY').format('D MMMM YYYY')
    };

    //update the personal info
    $scope.update = function () {
        var startTime = moment($scope.startHour + ':' + $scope.startMinute, 'HH:mm');
        var endTime = moment($scope.endHour + ':' + $scope.endMinute, 'HH:mm');

        if ($scope.edited_person_table != 'students') {
            if (startTime.isBefore(endTime)) {
                postData();
            } else {
                $mdToast.show($mdToast.simple().textContent('Invalid time input'));
            }
        } else
            postData();

        //data posting function
        function postData() {
            console.log(
                $scope.edited_person_table + ' ' +
                $scope.edited_person_id + ' ' +
                $scope.edited_person_data.name + ' ' +
                $scope.edited_person_data.email + ' ' +
                $scope.edited_person_data.phone + ' ' +
                $scope.edited_person_data.birthDate + ' ' +
                $scope.edited_person_data.group_id + ' ' +
                $scope.selected_days.join(',') + ' ' +
                startTime.format('HH:mm') + ' ' +
                endTime.format('HH:mm') + ' ' +
                $scope.edited_person_data.bio
            );
            $http({
                method: 'POST',
                url: '/updateUser',
                data: {
                    table: $scope.edited_person_table,
                    id: $scope.edited_person_id,
                    name: $scope.edited_person_data.name,
                    email: $scope.edited_person_data.email,
                    phone: $scope.edited_person_data.phone,
                    birthDate: $scope.edited_person_data.birthDate,
                    group_id: $scope.edited_person_data.group_id,
                    work_days: $scope.selected_days.join(','),
                    work_start_time: startTime.format('HH:mm'),
                    work_end_time: endTime.format('HH:mm'),
                    bio: $scope.edited_person_data.bio
                }
            }).success(function () {
                $mdDialog.hide();
                $route.reload();
                $mdToast.show($mdToast.simple().textContent('Personal data updated'));
            }).error(function (data) {
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
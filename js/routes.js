teacherDashboardApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: "sections/Announcement.html",
            controller: 'announcementController'
        })
        .when('/announcement',{
            templateUrl: "sections/Announcement.html",
            controller: 'announcementController'
        })
        .when('/conversation',{
            templateUrl: "sections/Conversation.html",
            controller: 'conversationController'
        })
        .when('/notification',{
            templateUrl: "sections/Notification.html",
            controller: 'notificationController'
        })
        .when('/people',{
            templateUrl: "sections/People.html",
            controller: 'peopleController'
        })
        .when('/schedule',{
            templateUrl: "sections/Schedule.html",
            controller: 'scheduleController'
        })
        .when('/assignments',{
            templateUrl: "sections/Assignments.html",
            controller: 'assignmentsController'
        })
        .when('/grading',{
            templateUrl: "sections/Grading.html",
            controller: 'gradingController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

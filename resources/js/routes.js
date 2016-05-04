teacherDashboardApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/announcement',{
            templateUrl: "sections/Announcement.html",
            controller: 'AnnouncementController'
        })
        .when('/conversation',{
            templateUrl: "sections/Conversation.html",
            controller: 'ConversationController'
        })
        .when('/notification',{
            templateUrl: "sections/Notification.html",
            controller: 'NotificationController'
        })
        .when('/people',{
            templateUrl: "sections/People.html",
            controller: 'PeopleController'
        })
        .when('/schedule',{
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/assignment',{
            templateUrl: "sections/Assignments.html",
            controller: 'AssignmentsController'
        })
        .when('/grading',{
            templateUrl: "sections/Grading.html",
            controller: 'GradingController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

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
        .when('/syllabus',{
            templateUrl: "sections/Syllabus.html",
            controller: 'syllabusController'
        })
        .when('/contacts',{
            templateUrl: "sections/Contacts.html",
            controller: 'contactsController'
        })
        .when('/materials',{
            templateUrl: "sections/Materials.html",
            controller: 'materialsController'
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

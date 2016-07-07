portalApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/announcement', {
            templateUrl: "sections/Announcement.html",
            controller: 'AnnouncementController'
        })
        .when('/conversation', {
            templateUrl: "sections/Conversation.html",
            controller: 'ConversationController'
        })
        .when('/notification', {
            templateUrl: "sections/Notification.html",
            controller: 'NotificationController'
        })
        .when('/people', {
            templateUrl: "sections/People.html",
            controller: 'PeopleController'
        })
        .when('/schedule', {
            templateUrl: "sections/Schedule.html",
            controller: 'ScheduleController'
        })
        .when('/mentor-schedule', {
            templateUrl: "sections/MentorSchedule.html",
            controller: 'MentorScheduleController'
        })
        .when('/assignment', {
            templateUrl: "sections/Assignments.html",
            controller: 'AssignmentsController'
        })
        .when('/grading', {
            templateUrl: "sections/Grading.html",
            controller: 'GradingController'
        })
        .when('/add-lesson', {
            templateUrl: "sections/Lesson-Editor.html",
            controller: 'LessonEditorController'
        })
        .when('/lesson-editor/:lessonId', {
            templateUrl: "sections/Lesson-Editor.html",
            controller: 'LessonEditorController'
        })
        .when('/lesson/:lessonId', {
            templateUrl: "sections/Lesson.html",
            controller: 'LessonController'
        })
        .when('/attendance',{
            templateUrl: "sections/Attendance.html",
            controller: 'AttendanceController'
        })
        .when('/settings', {
            templateUrl: "sections/Settings.html",
            controller: 'SettingsController'
        })
        .when('/grading', {
            templateUrl: "sections/Grading.html",
            controller: 'GradingController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

teacherDashboardApp.service('ProfileService', function ($cookies,$http) {
        $http.get('/getUser').success(function(result) {
            $cookies.put('userId', result['id']);
            $cookies.put('userName', result['name']);
            $cookies.put('userEmail', result['email']);
            $cookies.put('userType', result['type']);
            if(result['type']=='student'){
                $cookies.put('userGroupId', result['group_id']);
            }
        });

    })
    .service('PeopleService', function ($http) {
        this.groups = ['16101', '16102', '16103'];
        this.places = ['HTP', 'BBF'];

        var getPeople = function() {
            return $http({method:"GET", url:"php/getUsers.php"}).then(function(result){
                return result.data;
            });
        };

        return { getPeople: getPeople };

    })
    .service('SectionsService', function ($http) {
        /*
         this.sections = [
         {name: 'Announcement'},
         {name: 'Conversation'},
         {name: 'Notification'},
         {name: 'People'},
         {name: 'Schedule'},
         {name: 'Assignments'},
         {name: 'Grading'}
         ];
         */
    })
    .service('AnnouncementService', function () {
        this.announcements = [{
            user: 'Karim Karimov',
            date: '03-23-2016, 12:15',
            text: 'Something',
            groups: '16101',
            id: 15
        }
        ];
        this.groups = ['16102', '16101', '16201', '16202'];
    })
    .service('ScheduleService', function () {
        this.eventTypes = ['lesson', 'extra', 'meeting'];
    })
    .service('NotificationService', function ($http,Data) {

    })
    .service('AssignmentService', function () {
        this.assignments = [
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-20-2016, 23:59', endDate: '04-27-2016, 23:59', owner: 'Samir Karimov', doneCount: 20},
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-21-2016, 23:59', endDate: '04-28-2016, 23:59', owner: 'Karim Karimov', doneCount: 0},
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-22-2016, 23:59', endDate: '04-29-2016, 23:59', owner: 'Eldar Alaskarov', doneCount: 12}
        ];
    })
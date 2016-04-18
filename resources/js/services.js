teacherDashboardApp.service('ProfileService', function () {
        this.user_name = 'Karim Karimov';
        this.user_email = 'kerimovscreations@gmail.com';
        this.user_type = 'teacher';
        this.user_id = 1;

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
        this.events = [
            {
                title: 'PHP Lesson 4',
                type: 'lesson',
                description: "1.Classes, 2.methods",
                date: '03-28-2016',
                startTime: '18:30',
                endTime: '21:30',
                group: '16102',
                place: 'HTP',
                status: 'done',
                owner: 'Karim Karimov',
                responsible: "Samir Karimov",
                id: 1
            },
            {
                title: 'Extra',
                type: 'extra',
                description: "Extra",
                date: '03-28-2016',
                startTime: '09:00',
                endTime: '10:30',
                group: '',
                place: 'HTP',
                status: 'accepted',
                owner: 'Ulvi Aslanov',
                responsible: "Orxan Farmanli",
                id: 2
            },
            {
                title: 'PHP Lesson 5',
                type: 'lesson',
                description: "1.Classes, 2.methods",
                date: '03-26-2016',
                startTime: '12:00',
                endTime: '14:30',
                group: '16102',
                place: 'HTP',
                status: 'not done',
                owner: 'Karim Karimov',
                responsible: "Farid Osmanli",
                id: 3
            }
        ];
        console.log(this.events);
        this.eventTypes = ['lesson', 'extra', 'meeting'];
    })
    .service('NotificationService', function () {
        this.notifications = [
            {text: 'New announcement from Karim Karimov', source: 15, type: 'announcement', date: '03-24-2016, 11:45'},
            {text: 'New request from Rahim Rahimli', source: 8, type: 'extra', date: '03-24-2016, 10:00'}
        ]
    })
    .service('AssignmentService', function () {
        this.assignments = [
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-20-2016, 23:59', endDate: '04-27-2016, 23:59', owner: 'Samir Karimov', doneCount: 20},
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-21-2016, 23:59', endDate: '04-28-2016, 23:59', owner: 'Karim Karimov', doneCount: 0},
            {title: 'Test Assignment', rule: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', date: '04-18-2016, 14:20', startDate: '04-22-2016, 23:59', endDate: '04-29-2016, 23:59', owner: 'Eldar Alaskarov', doneCount: 12}
        ];
    })
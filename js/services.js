teacherDashboardApp.service('ProfileService',function(){
        this.user_name='Karim Karimov';
        this.user_email='kerimovscreations@gmail.com';
        this.user_type='teacher';
        this.user_id=1;

    })
    .service('PeopleService',function(){
        this.people=[
            {name: 'Karim Karimov', email:'kerimovscreations@gmail.com', type: 'student', group:'16101', id: 1},
            {name: 'Farida Samedzadeh', email:'farida.s@code.edu.az', type: 'student', group:'16101', id: 2},
            {name: 'Rahim Rahimli', email:'rahim.r@code.edu.az', type: 'student', group:'16101', id: 3},
            {name: 'Vahab Valiyev', email:'vahab.v@code.edu.az', type: 'student', group:'16101', id: 4},
            {name: 'Orxan Farmanli', email:'orxan.f@code.edu.az', type: 'mentor', group:'', id: 5},
            {name: 'Jeyhun Aliyev', email:'jeyhun.a@code.edu.az', type: 'student', group:'16101', id: 6},
            {name: 'Samir Karimov', email:'samir@code.edu.az', type: 'teacher', group:'', id: 7},
            {name: 'Eldar Alaskarov', email:'eldar@code.edu.az', type: 'teacher', group:'', id: 8},
            {name: 'Samra Osmanova', email:'samra.o@code.edu.az', type: 'student', group:'16101', id: 9},
            {name: 'Ideal Nasirzade', email:'ideal.n@code.edu.az', type: 'student', group:'16101', id: 10},
            {name: 'Ulvi Aslanov', email:'ulvi@code.edu.az', type: 'teacher', group:'', id: 11},
            {name: 'Aysel Akhundova', email:'aysel.a@code.edu.az', type: 'student', group:'16101', id: 12},
            {name: 'Farid Osmanli', email:'farid.o@code.edu.az', type: 'mentor', group:'', id: 13}
        ];
        this.groups=['16101','16102','16103'];
        this.places=['HTP','BBF'];

    })
    .service('SectionsService',function(){
        this.sections=[
            { name: 'Announcement' },
            { name: 'Conversation'},
            { name: 'Notification'},
            { name: 'People'},
            { name: 'Schedule'},
            { name: 'Assignments'},
            { name: 'Grading'}
        ];
    })
    .service('AnnouncementService',function(){
        this.announcements=[{user: 'Karim Karimov', date: '03-23-2016, 12:15', text: 'Something', groups: '16101', id: 15}
        ];
        this.groups=['16102','16101','16201','16202'];
    })
    .service('ScheduleService',function(){
        this.events=[
            {title: 'PHP Lesson 4', type: 'lesson', description: "1.Classes, 2.methods", date:'03-28-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: 'done', owner: 'Karim Karimov', responsible: "Samir Karimov", id: 1},
            {title: 'Extra', type: 'extra', description: "Extra", date:'03-28-2016', startTime: '09:00', endTime: '10:30', group: '', place:'HTP', status: 'accepted', owner: 'Ulvi Aslanov', responsible: "Orxan Farmanli", id: 2},
            {title: 'PHP Lesson 5', type: 'lesson', description: "1.Classes, 2.methods", date:'03-26-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: 'not done', owner: 'Karim Karimov', responsible: "Farid Osmanli", id: 3},
            {title: 'PHP Meeting', type: 'meeting', description: "Meeting", date:'03-29-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: 'done', owner: 'Samir Karimov', responsible: "Karim Karimov", id: 4},
            {title: 'Extra Meeting', type: 'extra', description: "Extra", date:'03-23-2016', startTime: '09:00', endTime: '10:30', group: '', place:'HTP', status: 'rejected', owner: 'Ulvi Aslanov', responsible: "Eldar Alaskarov", id: 5},
            {title: 'PHP Lesson 5', type: 'lesson', description: "1.Classes, 2.methods", date:'03-24-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: 'not done', owner: 'Rahim Rahimli', responsible: "Orxan Farmanli", id: 6},
            {title: 'PHP OOP', type: 'meeting', description: "Meeting", date:'03-25-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: 'done', owner: 'Samir Karimov', responsible: "Rahim Rahimli", id: 7},
            {title: 'Extra Meeting', type: 'extra', description: "Extra", date:'03-26-2016', startTime: '09:00', endTime: '10:30', group: '', place:'HTP', status: 'requested', owner: 'Ulvi Aslanov', responsible: "Farid Osmanli", id: 8},
            {title: 'PHP Lesson 6', type: 'lesson', description: "1.Classes, 2.methods", date:'03-27-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: 'notdone', owner: 'Rahim Rahimli', responsible: "Eldar Alaskarov", id: 9},
            {title: 'PHP OOP', type: 'meeting', description: "Meeting", date:'03-25-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: 'done', owner: 'Samir Karimov', responsible: "Karim Karimov", id: 10},
            {title: 'Extra Meeting', type: 'extra', description: "Extra", date:'03-26-2016', startTime: '09:00', endTime: '10:30', group: '', place:'HTP', status: 'requested', owner: 'Ulvi Aslanov', responsible: "Orxan Farmanli", id: 11}

        ];
        this.eventTypes=['lesson','extra','meeting'];
    })
    .service('NotificationService',function(){
        this.notifications=[
            {text: 'New announcement from Karim Karimov', source: 15, type: 'announcement', date: '03-24-2016, 11:45'},
            {text: 'New request from Rahim Rahimli', source: 8, type: 'extra', date: '03-24-2016, 10:00'}
        ]
    })
    .service('AssignmentService',function(){
        this.assignments=[
            {text: 'Complete 3rd, 5th and 8th sections from MySQL Udemy course', deadline: '04-12-2016, 23:59'}
        ]
    })
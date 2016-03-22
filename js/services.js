teacherDashboardApp.service('ProfileService',function(){
        this.people=[
            {name: 'Karim Karimov', email:'kerimovscreations@gmail.com', type: 'student', id: 1},
            {name: 'Farida Samedzadeh', email:'farida.s@code.edu.az', type: 'student', id: 2},
            {name: 'Rahim Rahimli', email:'rahim.r@code.edu.az', type: 'student', id: 3},
            {name: 'Vahab Valiyev', email:'vahab.v@code.edu.az', type: 'student', id: 4},
            {name: 'Orxan Farmanli', email:'orxan.f@code.edu.az', type: 'mentor', id: 5},
            {name: 'Jeyhun Aliyev', email:'jeyhun.a@code.edu.az', type: 'student', id: 6},
            {name: 'Samir Karimov', email:'samir@code.edu.az', type: 'teacher', id: 7},
            {name: 'Eldar Alaskarov', email:'eldar@code.edu.az', type: 'teacher', id: 8},
            {name: 'Samra Osmanova', email:'samra.o@code.edu.az', type: 'student', id: 9},
            {name: 'Ideal Nasirzade', email:'ideal.n@code.edu.az', type: 'student', id: 10},
            {name: 'Ulvi Aslanov', email:'ulvi@code.edu.az', type: 'teacher', id: 11},
            {name: 'Aysel Akhundova', email:'aysel.a@code.edu.az', type: 'student', id: 12},
            {name: 'Farid Osmanli', email:'farid.o@code.edu.az', type: 'mentor', id: 13}
        ];

        this.user_name=this.people[0].name;
        this.user_email=this.people[0].email;
        this.user_type=this.people[0].type;

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
        this.announcements=[];
        this.groups=['HTP16102','HTP16101','BBF16201','BBF16202'];
    })
    .service('ScheduleService',function(){
        this.events=[
            {title: 'PHP Lesson 4', type: 'lesson', description: "1.Classes, 2.methods", date:'03-21-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: false, owner: 'Karim Karimov', responsible: "Samir Karimov",id: 1},
            {title: 'Extra', type: 'extra', description: "Extra", date:'03-21-2016', startTime: '09:00', endTime: '10:30', group: 'HTP16102', place:'HTP', status: false, owner: 'Ulvi Aslanov', responsible: "Orxan Farmanli",id: 2},
            {title: 'PHP Lesson 5', type: 'lesson', description: "1.Classes, 2.methods", date:'03-22-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: false, owner: 'Rahim Rahimli', responsible: "Farid Osmanli",id: 3},
            {title: 'PHP Meeting', type: 'meeting', description: "Meeting", date:'03-21-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: false, owner: 'Samir Karimov', responsible: "Karim Karimov",id: 4},
            {title: 'Extra Meeting', type: 'extra', description: "Extra", date:'03-23-2016', startTime: '09:00', endTime: '10:30', group: '16102', place:'HTP', status: false, owner: 'Ulvi Aslanov', responsible: "Eldar Alaskarov",id: 5},
            {title: 'PHP Lesson 5', type: 'lesson', description: "1.Classes, 2.methods", date:'03-24-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: false, owner: 'Rahim Rahimli', responsible: "Orxan Farmanli",id: 6},
            {title: 'PHP OOP', type: 'meeting', description: "Meeting", date:'03-25-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: false, owner: 'Samir Karimov', responsible: "Rahim Rahimli",id: 7},
            {title: 'Extra Meeting', type: 'extra', description: "Extra", date:'03-26-2016', startTime: '09:00', endTime: '10:30', group: '16102', place:'HTP', status: false, owner: 'Ulvi Aslanov', responsible: "Samir Karimov",id: 8},
            {title: 'PHP Lesson 6', type: 'lesson', description: "1.Classes, 2.methods", date:'03-22-2016', startTime: '12:00', endTime: '14:30', group: '16102', place:'HTP', status: false, owner: 'Rahim Rahimli', responsible: "Eldar Alaskarov",id: 9},
            {title: 'PHP OOP', type: 'meeting', description: "Meeting", date:'03-25-2016', startTime: '18:30', endTime: '21:30', group: '16102', place:'HTP', status: false, owner: 'Samir Karimov', responsible: "Karim Karimov",id: 10}
        ];
    })
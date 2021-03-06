portalApp.service('ProfileService', function ($cookies, $http) {
        

    })
    .service('SectionService', function(){
        this.sections=[
            {name:'Announcement', url: 'svg/ic_announcement_white_48px.svg', access_level:'123'},
            {name:'Notification', url: 'svg/ic_notifications_white_48px.svg', access_level:'123'},
            {name:'Schedule', url: 'svg/ic_event_white_48px.svg', access_level:'123'},
            {name:'People', url: 'svg/ic_people_white_48px.svg', access_level:'123'},
            {name:'Mentor-schedule', url: 'svg/ic_event_note_white_48px.svg', access_level:'123'},
            {name:'Attendance', url: 'svg/ic_assessment_white_48px.svg', access_level:'3'},
            {name:'Settings', url: 'svg/ic_settings_white_48px.svg', access_level:'3'}
        ];
    })
    .service('PeopleService', function ($http) {
        var getPeople = function() {
            return $http({method:"GET", url:"php/getUsers.php"}).then(function(result){
                return result.data;
            });
        };
        return { getPeople: getPeople };
    })
portalApp.service('ProfileService', function ($cookies, $http) {
        

    })
    .service('SectionService', function(){
        this.sections=[
            {name:'Announcement', url: 'svg/ic_announcement_white_48px.svg'},
            {name:'Notification', url: 'svg/ic_notifications_white_48px.svg'},
            {name:'Schedule', url: 'svg/ic_event_white_48px.svg'},
            {name:'People', url: 'svg/ic_people_white_48px.svg'}
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
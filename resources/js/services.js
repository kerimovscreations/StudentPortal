portalApp.service('ProfileService', function ($cookies, $http) {
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
    .service('SectionService', function(){
        this.sections=[
            {name:'Announcement', url: 'svg/ic_announcement_white_48px.svg'},
            {name:'Notification', url: 'svg/ic_notifications_white_48px.svg'},
            {name:'Notification', url: 'svg/ic_event_white_48px.svg'},
            {name:'Notification', url: 'svg/ic_people_white_48px.svg'}
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
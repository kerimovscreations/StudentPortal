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
        var getPeople = function() {
            return $http({method:"GET", url:"php/getUsers.php"}).then(function(result){
                return result.data;
            });
        };

        return { getPeople: getPeople };

    })
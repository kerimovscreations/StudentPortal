teacherDashboardApp.service('ProfileService',function(){
    this.user_name='Karim';
    this.user_surname='Karimov';
    this.user_type='Teacher';
    this.user_courses=[
        {name:'Math'},
        {name:'Numerical Methods'},
        {name:'Matlab'},
        {name:'Signal Processing'}
    ];
    this.current_course=this.user_courses[0].name;
    this.student_contacts=[
        {name: 'Karim Karimov', email:'kerimovscreations@gmail.com'},
        {name: 'Shamil Omarov', email:'omarov95@gmail.com'},
        {name: 'Rahim Rahimli', email:'rahim95@gmail.com'},
        {name: 'Karim Karimov', email:'kerimovscreations@gmail.com'},
        {name: 'Shamil Omarov', email:'omarov95@gmail.com'},
        {name: 'Rahim Rahimli', email:'rahim95@gmail.com'},
        {name: 'Karim Karimov', email:'kerimovscreations@gmail.com'},
        {name: 'Shamil Omarov', email:'omarov95@gmail.com'},
        {name: 'Rahim Rahimli', email:'rahim95@gmail.com'},
        {name: 'Karim Karimov', email:'kerimovscreations@gmail.com'},
        {name: 'Shamil Omarov', email:'omarov95@gmail.com'},
        {name: 'Rahim Rahimli', email:'rahim95@gmail.com'}
    ];

    this.syllabuses=[];
    this.materials=[];

});
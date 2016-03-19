teacherDashboardApp.service('ProfileService',function(){
    this.user_name='Karim';
    this.user_surname='Karimov';
    this.user_type='Teacher';

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

})
.service('AnnouncementService',function(){
    this.announcements=[];
    this.groups=['HTP16102','HTP16101','BBF16201','BBF16202'];
});
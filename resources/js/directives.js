teacherDashboardApp.directive("dropzoneSyllabus", function(ProfileService) {
        return {
            restrict : "A",
            link: function (scope, elem) {
                elem.bind('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                elem.bind('dragenter', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = 'on-drag-enter';
                    });
                });
                elem.bind('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = '';
                    });
                });
                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(f);

                        reader.onload = (function(theFile) {
                            return function(e) {
                                var newFile = { name : theFile.name,
                                    type : theFile.type,
                                    size : theFile.size,
                                    lastModifiedDate : theFile.lastModifiedDate
                                };
                                ProfileService.syllabuses.push(newFile);
                            };
                        })(f);
                    }
                });
            }
        }
    })
    .directive("dropzoneMaterial", function(ProfileService) {
        return {
            restrict : "A",
            link: function (scope, elem) {
                elem.bind('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                elem.bind('dragenter', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = 'on-drag-enter';
                    });
                });
                elem.bind('dragleave', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    scope.$apply(function () {
                        scope.divClass = '';
                    });
                });
                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    for (var i = 0, f; f = files[i]; i++) {
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(f);

                        reader.onload = (function(theFile) {
                            return function(e) {
                                var newFile = { name : theFile.name,
                                    type : theFile.type,
                                    size : theFile.size,
                                    lastModifiedDate : theFile.lastModifiedDate
                                };
                                ProfileService.materials.push(newFile);
                            };
                        })(f);
                    }
                });
            }
        }
    });

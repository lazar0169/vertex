let machines = (function () {

    on('machines/activated', function () {
        setTimeout(function () {
            trigger('preloader/hide');
        }, 2000);
    });

    on('machines/display-machine-info/', function(e){
    });

    on('machines/display-machine-info/error',function(e){
        data = e.data;
        alert('An error occurred.');
    });

})();
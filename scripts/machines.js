let machines = (function () {
    

    on('machines/display-machine-info/', function(e){
        //data = e.data;
        //alert(data);
    });

    on('machines/display-machine-info/error',function(e){
        data = e.data;
        alert('An error occurred.');
    });

})();
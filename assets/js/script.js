jQuery(document).ready(function () {
    const apiKey = "2c3d63eb764dc73a9dbd4e6dc6e4d756";
    var url;
    btnMainBuscar = $("#btnMainBuscar");
    btnMainPronostico = $("#btnPronostico");
    btnMainUbi = $("#btnMainUbi");
    btnMainPronosticoUbi = $("#btnPronosticoUbi");
    menu = $("#offcanvasNavbar");
    
    inicio = $("#inicio");
    buscar = $("#buscar");
    ubi = $("#ubi");
    pronostico = $("#pronostico");
    pronosticoUbi = $("#pronosticoUbi");
    
    btnMenuInicio = $("#btnMenuInicio");
    btnMenuBuscar = $("#btnMenuBuscar");
    btnMenuUbi = $("#btnMenuUbi");

    imgClaro = "./assets/img/claro.png";
    imgNuboso = "./assets/img/nuboso.png";
    imgLluvia = "./assets/img/lluvia.png";
    imgTormenta = "./assets/img/tormenta.png";
    imgNieve = "./assets/img/nieve.png";

    buscar.hide();
    ubi.hide();
    pronostico.hide();
    pronosticoUbi.hide();

    //Botón para ir a menú Inicio
    btnMenuInicio.on("click", function () {
        inicio.show();
        buscar.hide();
        ubi.hide();
        pronostico.hide();
        pronosticoUbi.hide();
        $("#cardContainer").empty();
        $("#tuTiempo").empty();
        $("#btnClose").click();
    });
    
    //Botón para ir a menú Buscar
    btnMenuBuscar.on("click", function () {
        inicio.hide();
        buscar.show();
        ubi.hide();
        pronostico.hide();
        pronosticoUbi.hide();
        $("#cardContainer").empty();
        $("#tuTiempo").empty();
        $("#btnClose").click();
    });
    
    //Botón para ir a menú Ubi
    btnMenuUbi.on("click", function () {
        inicio.hide();
        buscar.hide();
        pronosticoUbi.hide(); 
        ubi.show();  
        $("#cardContainer").empty();  
        $("#tuTiempo").empty(); 
        $("#pronosticoUbiContainer").empty();
        $("#btnClose").click();
    }); 

    btnMainUbi.on("click", function () {
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+apiKey+"&units=metric";

                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "json",
                    success: function (ciudad) {
                        var img;
                        if(ciudad.weather[0].main === "Clear"){
                            img = imgClaro;                    
                        }
                        else if(ciudad.weather[0].main === "Clouds"){
                            img = imgNuboso;                    
                        }
                        else if(ciudad.weather[0].main === "Rain"){
                            img = imgLluvia;
                        }
                        else if(ciudad.weather[0].main === "Thunderstorm"){
                            img = imgTormenta;
                        }
                        else if(ciudad.weather[0].main === "Snow"){
                            img = imgNieve;
                        }else{
                            img = imgClaro;
                        }
        
                        var card = '<div class="col-lg-3 col-md-4 col-sm-6 mt-4 mb-4"><div class="card h-100 pt-3 pb-3"><h4 class="card-text text-center">'+ciudad.name+'</h4><div class="card-body d-flex justify-content-center"><img class="img-fluid" src="'+img+'"alt="Card image cap"></div><p class="card-text text-center">'+ciudad.main.temp+'ºC</p></div>';
        
                        $("#tuTiempo").append(card);
                        pronosticoUbi.show();
                    }
                });
            });
        }
        
    });

    //Botón para pronosticar los 5 días siguientes en tu ubicación
    btnMainPronosticoUbi.on("click", function () {
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            url = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+apiKey+"&units=metric";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function (pronosticos) {
                    console.log(pronosticos);
                    console.log(pronosticos.name);
                    //Para cada array pronosticos.list busca aquellos cuyo atributo dt_text contenga el texto "12:00:00"
                    var pronosticos12 = pronosticos.list.filter(function (pronostico){
                        return pronostico.dt_txt.includes("12:00:00");
                    });
                    console.log(pronosticos12)
    
                    //A cada uno de los 5 array que almacena el array pronosticos12, se le aplicarán las siguientes condiciones
                    pronosticos12.forEach(pronostico12 => {
                        var img;
                        if(pronostico12.weather[0].main === "Clear"){
                            img = imgClaro;                    
                        }
                        else if(pronostico12.weather[0].main === "Clouds"){
                            img = imgNuboso;                    
                        }
                        else if(pronostico12.weather[0].main === "Rain"){
                            img = imgLluvia;
                        }
                        else if(pronostico12.weather[0].main === "Thunderstorm"){
                            img = imgTormenta;
                        }
                        else if(pronostico12.weather[0].main === "Snow"){
                            img = imgNieve;
                        }else{
                            img = imgClaro;
                        }
                        var card = '<div class="col-lg-3 col-md-4 col-sm-6 mb-4"><div class="card h-100 pt-3 pb-3"><h4 class="card-title text-center">'+pronostico12.dt_txt+'</h4><div class="card-body d-flex justify-content-center"><img class="imgfluid" src="'+img+'"alt="Card image cap"></div><p class="card-text text-center">'+pronostico12.main.temp+'ºC</p></div></div>';
    
                        $("#pronosticoUbiContainer").append(card);
                    });
                }
            });
        });
    });   

    //Botón para buscar el tiempo en la ciudad introducida en el formulario "ciudad"
    btnMainBuscar.on("click", function () {
        pronostico.show();
        $("#cardContainer").empty();
        $("#pronosticoContainer").empty();
        var ciudad = $("#ciudad").val();
        url = "https://api.openweathermap.org/data/2.5/weather?q="+ciudad+"&appid="+apiKey+"&units=metric";
        
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (ciudad) {
                console.log(ciudad);
                console.log(ciudad.weather);
                var img;
                if(ciudad.weather[0].main === "Clear"){
                    img = imgClaro;                    
                }
                else if(ciudad.weather[0].main === "Clouds"){
                    img = imgNuboso;                    
                }
                else if(ciudad.weather[0].main === "Rain"){
                    img = imgLluvia;
                }
                else if(ciudad.weather[0].main === "Thunderstorm"){
                    img = imgTormenta;
                }
                else if(ciudad.weather[0].main === "Snow"){
                    img = imgNieve;
                }else{
                    img = imgClaro;
                }

                var card = '<div class="col-lg-3 col-md-4 col-sm-6 mb-4"><div class="card h-100 pt-3 pb-3"><h4 class="card-text text-center">'+ciudad.name+'</h4><div class="card-body d-flex justify-content-center"><img class="img-fluid" src="'+img+'"alt="Card image cap"></div><p class="card-text text-center">'+ciudad.main.temp+'ºC</p></div>';

                $("#cardContainer").append(card);
                
            }
        });
    });

    //Botón para pronosticar los 5 días siguientes en la ciudad que hayas buscado
    btnMainPronostico.on("click", function () {
        $("#pronosticoContainer").empty()
        var ciudad = $("#ciudad").val();
        url = "https://api.openweathermap.org/data/2.5/forecast?q="+ciudad+"&appid="+apiKey+"&units=metric";
        

        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function (pronosticos) {
                
                //Para cada array pronosticos.list busca aquellos cuyo atributo dt_text contenga el texto "12:00:00"
                var pronosticos12 = pronosticos.list.filter(function (pronostico){
                    return pronostico.dt_txt.includes("12:00:00");
                });
                console.log(pronosticos12)

                //A cada uno de los 5 array que almacena el array pronosticos12, se le aplicarán las siguientes condiciones
                pronosticos12.forEach(pronostico12 => {
                    var img;
                    if(pronostico12.weather[0].main === "Clear"){
                        img = imgClaro;                    
                    }
                    else if(pronostico12.weather[0].main === "Clouds"){
                        img = imgNuboso;                    
                    }
                    else if(pronostico12.weather[0].main === "Rain"){
                        img = imgLluvia;
                    }
                    else if(pronostico12.weather[0].main === "Thunderstorm"){
                        img = imgTormenta;
                    }
                    else if(pronostico12.weather[0].main === "Snow"){
                        img = imgNieve;
                    }else{
                        img = imgClaro;
                    }

                    var card = '<div class="col-lg-3 col-md-4 col-sm-6 mb-4"><div class="card h-100 pt-3 pb-3"><h4 class="card-title text-center">'+pronostico12.dt_txt+'</h4><div class="card-body d-flex justify-content-center"><img class="imgfluid" src="'+img+'"alt="Card image cap"></div><p class="card-text text-center">'+pronostico12.main.temp+'ºC</p></div></div>';

                    $("#pronosticoContainer").append(card);
                });
            }
        });
    });   

});
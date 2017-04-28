//Routing - Enrutamiento de la aplicación.
var app = angular.module('groceryListApp', ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/", {
            templateUrl: "views/groceryList.html",
            controller: "HomeController"
        })
        .when("/addItem", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemController"
        })
        //Pasando parámetros a un View
        .when("/addItem/edit/:id/", {
            templateUrl: "views/addItem.html",
            controller: "GroceryListItemController"
        })
        .otherwise({
            redirectTo: "/"
        })
});

//Todos los servicios proporcionados al Objeto GroceryService
app.service("GroceryService", function ($http) {
    var groceryService = {};
    groceryService.groceryItems = [];

    /* ARRAY DE PRUEBA
    groceryService.groceryItems = [
    {id: 1, completed: false, itemName: "Milk", date: new Date ("October 1, 2014 11:13:00")},
    {id: 2, completed: false, itemName: "Cookies", date: new Date ("October 1, 2014 11:13:00")},
    {id: 3, completed: false, itemName: "Ice Cream", date: new Date ("October 1, 2014 11:13:00")},
    {id: 4, completed: false, itemName: "Potatoes", date: new Date ("October 2, 2014 11:13:00")}
    ];
    console.log(groceryService.groceryItems); 
    */

    /* Para obtener datos de un servidor es necesario 
    proporcionar la direcccion (URL) en la que se ubican los datos 
    Ej. $http.get("http://www.welcome.com/file.htm")
            .then(function(response) {
            $scope.myWelcome = response.data;
        });
    */

    $http.get("data/server-data.json")
        .then(function (data){
            //Debido a que data viene en forma de objeto, es necesario incluir el data.array en GroceryItems
            groceryService.groceryItems = data.data;
            //Convertir date en un objeto tipo Date
            for (var item in groceryService.groceryItems){
                groceryService.groceryItems[item].date = new Date (groceryService.groceryItems[item].date);
            }
            console.log(groceryService.groceryItems);
            }, 
            //En caso de no funcionar el then muestra el error
            function(data){
                alert ("Error!!");
                console.log(data);
            }
        ); 

    //Función para buscar por ID
    groceryService.findById = function (id) {
    	for (var item in groceryService.groceryItems) {
    		if (groceryService.groceryItems[item].id === id) {
    			console.log(groceryService.groceryItems[item]);
    			return groceryService.groceryItems[item];
    		}
    	}
    };

    //Función para asignar el próximo ID a un elemento nuevo
    groceryService.getNewId = function () {
        if (groceryService.newId) {
            groceryService.newId++;
            return groceryService.newId;
        } else {
            var maxId = _.max(groceryService.groceryItems, function (entry) {
                return entry.id;
            })
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }
    }

    //Función para cambiar el elemento Check de la lista 
    groceryService.markCompleted = function(entry){
        entry.completed = !entry.completed;
    };

    //Función para Eliminar un elemento de la lista.
    groceryService.removeItem = function(entry) {

        $http.post("data/delete-item.json", {id: entry.id})
            .then(function(data){
                    if (data.data.status == 1)
                    {
                        if (data.data.status){
                            //indexOf Devuelve el index o lugar de un item en un array
                            var index = groceryService.groceryItems.indexOf(entry);
                            //splice elimina la cantidad de elementos definidos en la posición intex
                            groceryService.groceryItems.splice(index, 1);
                        }
                    } 
                },
                function(data, status){

                });   
    }

    //Función para guardar el elemento en el Array
    groceryService.save = function (entry) {
        var updatedItem = groceryService.findById(entry.id);
        if (updatedItem) {
            $http.post("data/updated-item.json", entry)
                .then(function(data){
                    if (data.data.status == 1)
                    {
                        console.log(data);
                        updatedItem.completed = entry.completed;
                        updatedItem.itemName = entry.itemName;
                        updatedItem.date = entry.date;

                    } 
                },
                function(data){

                });
            
        }
        else
        {
            $http.post("data/added-item.json", entry)
                .then(function(data){
                    entry.id = data.data.newId;
                },
                function(data){

                });
            //entry.id = groceryService.getNewId();
            //push guarda el elemento en el Array
            groceryService.groceryItems.push(entry);
        } 
    };
    return groceryService;
});

//Controladores definidos en el Home del sitio
app.controller("HomeController", ["$scope", "GroceryService", function ($scope, GroceryService) {
    $scope.appTitle = "Grocery List";

    $scope.groceryItems = GroceryService.groceryItems;

    $scope.removeItem = function(entry) {
        GroceryService.removeItem(entry);
    };

    $scope.markCompleted = function (entry){
        GroceryService.markCompleted(entry);
    };

    //watch inicializa el Array groceryItems al Scope al momento de cambiar la información.
    $scope.$watch (function() { return GroceryService.groceryItems; }, function(groceryItems) {
        $scope.groceryItems = groceryItems;
    });
}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams", "$location", "GroceryService", function ($scope, $routeParams, $location, GroceryService) {

	if(!$routeParams.id){
		$scope.groceryItem = {
       		id: 0,
        	completed: false,
        	itemName: "",
        	date: new Date()
   		}
	   }
    else
    {
        //SnakeCase
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
        }
    
    $scope.save = function () {
        GroceryService.save($scope.groceryItem);
        $location.path("/");
    }

    console.log($scope.groceryItems);
}]);

app.directive("tbGroceryItem", function(){
    return{
        restrict: "E",
        templateUrl: "views/groceryItem.html"
    }
})


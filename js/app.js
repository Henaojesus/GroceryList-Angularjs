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

app.service("GroceryService", function () {
    var groceryService = {};
    groceryService.groceryItems = [
        {
            id: 1,
            completed: true,
            itemName: 'Milk',
            date: new Date("October 1, 2014 11:13:00")
        },
        {
            id: 2,
            completed: true,
            itemName: 'Cookies',
            date: new Date("October 1, 2014 11:13:00")
        },
        {
            id: 3,
            completed: true,
            itemName: 'Ice Cream',
            date: new Date("October 1, 2014 11:13:00")
        },
        {
            id: 4,
            completed: true,
            itemName: 'Potatoes',
            date: new Date("October 2, 2014 11:13:00")
        },
        {
            id: 5,
            completed: true,
            itemName: 'Cereal',
            date: new Date("October 3, 2014 11:13:00")
        },
        {
            id: 6,
            completed: true,
            itemName: 'Bread',
            date: new Date("October 3, 2014 11:13:00")
        },
        {
            id: 7,
            completed: true,
            itemName: 'Eggs',
            date: new Date("October 4, 2014 11:13:00")
        },
        {
            id: 8,
            completed: true,
            itemName: 'Tortillas',
            date: new Date("October 5, 2014 11:13:00")
        }
	];

    groceryService.findById = function (id) {
    	for (var item in groceryService.groceryItems) {
    		if (groceryService.groceryItems[item].id === id) {
    			console.log(groceryService.groceryItems[item]);
    			return groceryService.groceryItems[item];
    		}
    	}
    };

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

    groceryService.removeItem = function(entry) {
        //indexOf Devuelve el index o lugar de un item en un array
        var index = groceryService.groceryItems.indexOf(entry);
        //splice elimina la cantidad de elementos definidos en la posición intex
        groceryService.groceryItems.splice(index, 1);
    }

    groceryService.save = function (entry) {
        var updatedItem = groceryService.findById(entry.id);
        if (updatedItem) {
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;
        }
        else
        {
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
        } 
    };
    return groceryService;
});

app.controller("HomeController", ["$scope", "GroceryService", function ($scope, GroceryService) {
    $scope.appTitle = "Grocery List";
    $scope.groceryItems = GroceryService.groceryItems;
    $scope.removeItem = function(entry) {
        GroceryService.removeItem(entry);
    }
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
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));;
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


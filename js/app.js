(function(){
    angular.module('MyApp',[])
    .controller('MyController',MyController)
    .service('MyService', MyService);

    MyController.$inject = ['$scope','MyService','$http'];

    function MyController($scope,MyService,$http){
        var somaTotal = 0;
        $scope.despesas = MyService.getDespesas();        
            
        $scope.despesa = {
            data:'',
            descricao: '',
            valor:''
        }
        

        $scope.addDespesa = function(){
           MyService.addDespesa($scope.despesa.data, $scope.despesa.descricao,$scope.despesa.valor);
        };

        $scope.removeDespesa = function (index){
           MyService.deleteDespesas(index);
        };

        $scope.calculaDespesasPeriodo = function(dataInicio,dataFinal){
                     
            var perido = { 
                dataInicio : dataInicio ,
                dataFinal : dataFinal
            }

            var req = {
                method: 'POST',
                url: 'http://localhost:8089/api/calcPeriodo',
                data: perido                
            }
            
            $http(req).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
               $scope.despesa.valorPeriodo = response.data[0].total;
                console.log(""+ somaTotal);
               
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        
        };

    }

    function MyService($http){
        var service = this;

        var despesas = new Array();
        var somaTotal = 0;

        service.addDespesa = function(Data, descricao, valor){
            var despesa = { 
                data : Data,
                descricao : descricao,
                valor : valor }
           var req = {
                method: 'POST',
                url: 'http://localhost:8089/api/add',
                data: despesa                
            }
            console.log("MyService "+Data+"  "+descricao+"   "+valor);
                $http(req).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                });
        };

        service.getDespesas = function(){            
            var req = {
            method: 'GET',
            url: 'http://localhost:8089',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            },

            }
            $http(req).then(function(response) {
                    var despesaTemp = {
                        id:"",
                        data:"",
                        descricao:"",
                        valor:""
                    }
                    for(var i in response.data){
                        despesaTemp = {
                            id:response.data[i].id,
                            data:response.data[i].data,
                            descricao:response.data[i].descricao,
                            valor:response.data[i].valor
                        }
                        despesas.push(despesaTemp);
                    }                                                         
                }, function(){
                    console.log("fail")
                });
                return despesas;
            };

        service.deleteDespesas = function(index){
            var req = {
            method: 'DELETE',
            url: 'http://localhost:8089/'+ index,

            }
            $http(req).then(function(response) {       
                    console.log("delete");                            
                }, function(){
                    console.log("Delete fail")
                });
                //return despesas;
            //despesas.splice(index,1);
        };

        service.calculaDespesasPeriodo = function(dataInicio,dataFinal){
                     
            var perido = { 
                dataInicio : dataInicio ,
                dataFinal : dataFinal
            }

            var req = {
                method: 'POST',
                url: 'http://localhost:8089/api/calcPeriodo',
                data: perido                
            }
            
            $http(req).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
               $scope.despesa.valorPeriodo = response.data[0].total;
                console.log(""+ somaTotal);
               
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Fail");
            });
            
            console.log(somaTotal);
            return somaTotal;
        };

    }
 
 
//no controller você chama seu service assim:

   
})();
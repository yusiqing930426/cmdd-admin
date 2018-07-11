'use strict'

var categoryModule = angular.module('categoryModule', ['ngTable', 'checklist-model'])

		categoryModule.controller('categoryListController',
			[ '$scope', 'CategoryService', 'ngTableParams', '$filter','$window',
				function ($scope, CategoryService, ngTableParams, $filter,$window) {
		
			$scope.listFilter = {};
		
			CategoryService.list().$promise.then(function (response) {
				$scope.tableParams = new ngTableParams(
						{
							page: 1,
							count: 25,
							sorting: {},
							filter: $scope.listFilter
						}, {
								total: 0,
								getData: function ($defer, params) {
									var filteredData = $filter('filter')(response.msg, $scope.listFilter);
									var sortedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
									$scope.categoryList = sortedData.slice((params.page() - 1) * params.count(), params.page() * params.count())
									$scope.totalLength = sortedData.length
									params.total(sortedData.length)
									$defer.resolve($scope.category)
								}
							}
				 )
			})

			$scope.saveSort = function (category){
				CategoryService.update(category,
					function(response){
				         if(response.code!=200){
				         	console.log(response);
				         	alert("操作失败!");
				         }else{
							 alert("操作成功");
				         }
					}
				)
			}
		} 
	])

categoryModule.controller('categoryCreateController', [ '$scope', '$location', 'CategoryService','DataUtilService',
	function ($scope, $location, CategoryService,DataUtilService) {
		$scope.YesNoModel  = DataUtilService.YesNoModel;
		$scope.create = function () {
			//$scope.category.is_upload = syncStatus+1;
			$scope.category.shop_id=localStorage.getItem("shop_id");
		    CategoryService.create($scope.category,
			   function(response){
			         if(response.code!=200){
			        	 alert(response.msg)
						 return;
			         }else{
						 alert("创建成功")
			        	$location.path('/dataentry/category')
			         }
		   		}
		   )
		}
	}
])

categoryModule.controller('categoryController',['$scope','$location','CategoryService','$routeParams','DataUtilService',
	function($scope,$location,CategoryService,$routeParams,DataUtilService){
		$scope.YesNoModel  = DataUtilService.YesNoModel;
		
		var categoryId=$routeParams.id;
			
		CategoryService.view({id:categoryId},function(response){
			$scope.category=response.msg;			
		})
		
		$scope.update=function(){
			CategoryService.update($scope.category,
					function(response){
						//if($scope.category.is_upload!=syncStatus+1){
			 			//	$scope.category.is_upload = syncStatus+2;
					//	}
				        if(response.code!=200){
				        	alert(response.msg)
							return;
				        }else{
							alert("修改成功")
				        	$location.path('/dataentry/category')
				        }
					}
			)
			
		}
	}
])

	





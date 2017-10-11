var store = require('../services/store');
var async = require('async');

module.exports = function (req, res, next) {

    //来源标记
    res.locals.URL = "http://" + host + path;
    res.locals.page = page.split('/').join('-');
    res.locals.path = path;
    res.locals.cookies = req.cookies;

    async.parallel([
        function (callback) {
            if (res.app.locals.categoryTree && res.app.locals.categoryMap) {
                callback(null, res.app.locals.categoryTree, res.app.locals.categoryMap);
            }
            else {
                store.getCategory(callback);
            }
        },
        function (callback) {
            if (res.app.locals.brandCore) {
                callback(null, res.app.locals.brandCore);
            }
            else {
                store.getBrandCore(callback);
            }
        },
        function (callback) {
            store.getHotWord(callback);
        }
    ], function (error, results) {
        if (!error) {

            // res.locals.categoryTree = res.app.locals.categoryTree = results[0][0];
            res.app.locals.categoryTree = results[0][0];
            if( !res.app.locals.customerCategoryTree ){
                res.app.locals.customerCategoryTree = {} ;
            }

            //customer category
            var customerString = res.locals.user.customerString ;
            // var customerString = [5,12240,16169,16427,16908,16910].join(',') ;
            var customerArray = res.locals.user.company_categories ;
            // var customerArray = [5,12240,16169,16427,16908,16910] ;
            if ( customerString ){
                if ( res.app.locals.customerCategoryTree[ customerString ] ){
                    res.locals.categoryTree = res.app.locals.customerCategoryTree[ customerString ] ;
                } else {
                    var temp_CategoryTree = JSON.parse( JSON.stringify( res.app.locals.categoryTree ) ) ;
                    //遍历一二级产线,对有权限的加上auth=true或auth=false
                    temp_CategoryTree.forEach(function(v){
                        v.objs.forEach(function(_v,i){
                            _v.isAvailable = false ;
                            v.category[i].isAvailable = false ;
                            if (  customerArray.indexOf( _v.catId ) > -1 ){
                                _v.isAvailable = true ;
                                v.category[i].isAvailable = true ;
                                _v.nodes.forEach(function(__v){
                                    // if ( customerArray.indexOf( __v.catId ) > -1 ){
                                    //     __v.isAvailable = true ;
                                    // } else {
                                    //     __v.isAvailable = false ;
                                    // }
                                    __v.isAvailable = true ;
                                }) ;
                            } else {
                                _v.nodes.forEach(function(__v){
                                    if ( customerArray.indexOf( __v.catId ) > -1 ){
                                        __v.isAvailable = true ;
                                        _v.isAvailable = true ;
                                        v.category[i].isAvailable = true ;
                                    } else {
                                        __v.isAvailable = false ;
                                    }
                                }) ;
                            }
                        }) ;
                    }) ;
                    res.locals.categoryTree = res.app.locals.customerCategoryTree[ customerString ] = temp_CategoryTree ;
                }
            } else {
                if ( res.app.locals.customerCategoryTree[ 'normalUser' ] ){
                    res.locals.categoryTree = res.app.locals.customerCategoryTree[ 'normalUser' ] ;
                } else {
                    var temp_CategoryTree = JSON.parse( JSON.stringify( res.app.locals.categoryTree ) ) ;
                    //对两级产线,全部加上auth 为true
                    temp_CategoryTree.forEach(function(v,i){
                        v.category.forEach(function(_v,_i){
                            _v.isAvailable = true ;
                        }) ;
                        v.objs.forEach(function(_v,_i){
                            _v.isAvailable = true ;
                            _v.nodes.forEach(function (__v,i) {
                                __v.isAvailable = true ;
                            }) ;
                        }) ;
                    }) ;
                    res.locals.categoryTree = res.app.locals.customerCategoryTree[ 'normalUser' ] = temp_CategoryTree ;
                }
            }
            res.locals.customerTree = res.locals.categoryTree ;


            res.locals.categoryMap = res.app.locals.categoryMap = results[0][1];
            res.locals.brandCore = res.app.locals.brandCore = results[1];


            res.locals.hotwords = results[2].data;
            next();
        }
        else {
            res.render('error', {
                message: '获取分类信息失败'
            });
        }
    });
};

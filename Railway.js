const Railway = (function(){

    var diffRoutesResult;

    function graphItemValueCtrl(item){

        const isStringType = Object.prototype.toString.call(item) === '[object String]';
        const hasEnoughSize = item.length > 2;
        const hasLength = !isNaN( item.substr(2, item.length) );
        
        return isStringType && hasEnoughSize && hasLength ;
    }

    function routeItemValueCtrl(item){

        const isStringType = Object.prototype.toString.call(item) === '[object String]';
        const hasEnoughSize = item.length === 1;
        const isItemNaN = isNaN(item);

        return isStringType && hasEnoughSize && isItemNaN;
    }

    function parseGraph(graph, callback){

        let parsedGraph = [];

        if( graph.indexOf(',') !== -1 ){

            parsedGraph = graph.split(',').map( item => item.trim() );
            
            if( parsedGraph.every( graphItemValueCtrl ) ){
                
                callback( parsedGraph );
            }else{
    
                callback();
            }

        }else if(graphItemValueCtrl( graph )){

            callback([graph]);

        }else{

            callback();
        }
    }

    function formatParsedGraph(parsedGraph, callback){

        var formattedGraph = [];

        for(let route of parsedGraph){

            let from = route.charAt(0);
            let to = route.charAt(1);
            let length = route.substr(2, route.length);

            formattedGraph.push( {from: from, to: to, length: length, stop: -1} );
        }

        callback( formattedGraph );
    }

    function parseRoute(route, callback){

        let parsedRoute = [];

        if( route.indexOf('-') !== -1 ){

            parsedRoute = route.split('-');
        }

        for(let routeItem of parsedRoute){

            routeItem = routeItem.trim();
        }

        if( parsedRoute.every( routeItemValueCtrl ) ){

            callback( parsedRoute );
        
        }else{

            callback();
        }
    }

    function formatParsedRoute(parsedRoute, callback){

        let formattedRoute = [];

        for(let i = 1; i < parsedRoute.length; i++){

            let from = parsedRoute[i-1];
            let to = parsedRoute[i];

            formattedRoute.push( {from: from, to: to} );
        }

        callback( formattedRoute );
    }

    function distance(formattedGraph, formattedRoute, callback){

        let distance = 0;
        let matchedGraphs = [];

        for( let route of formattedRoute ){

            let matchedGraphItem = formattedGraph.find( (formattedGraphItem) => {
                
                return formattedGraphItem.from === route.from && formattedGraphItem.to === route.to;
            });

            if( matchedGraphItem ){

                matchedGraphs.push( matchedGraphItem );
                
                distance += parseInt(matchedGraphItem.length);
                
                // console.log('matched graph item: ', matchedGraphItem);
            }
        }

        if( matchedGraphs.length === formattedRoute.length ){

            callback(distance);
        
        }else{

            callback('NO SUCH ROUTE');
        }

    }

    function arrayFilter(array, filterObj, callback){

        if(Object.prototype.toString.call(filterObj) !== '[object Object]' || !Object.keys(filterObj).length ){

            callback([]);
        
        }else{

            const filterKey = Object.keys(filterObj)[0];

            let filteredArray = array.filter((item) => {

                return item[filterKey] === filterObj[filterKey]
            });

            callback(filteredArray);
        }
    }

    function findCrossingPoints(froms, tos, params, callback){

        var crossingPoints = [];

        for(let fromItem of froms){

            arrayFilter(tos, {from: fromItem.to}, (filteredArray) => {

                let lastFiltereds = [];

                // console.log(`from item: ${JSON.stringify(fromItem)}`);
                // console.log('finded in crossings');
                // console.log(filteredArray);

                for(let filteredItem of filteredArray){

                    let distance = parseInt(filteredItem.length) + parseInt(fromItem.length);
                    let stop = parseInt(filteredItem.stop) + parseInt(fromItem.stop);

                    if( distance <= parseInt(params.maxLength) && stop <= parseInt(params.maxStop)){
                        
                        lastFiltereds.push({from: filteredItem.from, to: filteredItem.to, length: distance, stop: stop});
                    }
                }

                crossingPoints = crossingPoints.concat(lastFiltereds);
            });
        }

        callback( crossingPoints );
    }

    function findSameDirections(formattedGraph, froms, tos, params, callback){

        var sameDirections = [];

        for(let fromItem of froms){

            let foundItemIndex = tos.indexOf(fromItem);

            if( foundItemIndex != -1){

                let foundItem = tos[foundItemIndex];
                let itemFromGraph = formattedGraph.find( (graphItem) => {

                    return graphItem.from === foundItem.from && graphItem.to === foundItem.to;
                });

                // console.log(`fromItem: ${JSON.stringify(fromItem)}, foundItem: ${JSON.stringify(foundItem)}, itemFromGraph: ${JSON.stringify(itemFromGraph)}`);

                let distance = foundItem.length + fromItem.length - parseInt(itemFromGraph.length);
                let stop = foundItem.stop + fromItem.stop - parseInt(itemFromGraph.stop);

                if( distance <= params.maxLength && stop <= params.maxStop ){

                    sameDirections.push({from: fromItem.from, to: fromItem.to, length: distance, stop: stop});
                }
            }
        }

        callback(sameDirections);
    }

    function collectEdges(froms, tos, callback){

        var edgePointObj = { froms: [], tos: [] };

        for(let fromItem of froms){

            edgePointObj.froms.push(fromItem);
        }

        for(let toItem of tos){

            edgePointObj.tos.push(toItem);
        }

        callback( edgePointObj );
    }

    function findDiffRouts(formattedGraph, edgePointObj, params, callback){

        var froms = [];
        var tos = [];

        var differentRoutes = [];

        for(let fromPoint of edgePointObj.froms){

            arrayFilter(formattedGraph, {from: fromPoint.to}, (filteredArray) => {
                
                let lastFiltereds = [];

                // console.log('from filtereds');
                // console.log(filteredArray);

                for(let filteredItem of filteredArray){

                    filteredItem.length = parseInt(filteredItem.length) + parseInt(fromPoint.length);
                    filteredItem.stop = parseInt(filteredItem.stop) + 1;

                    if( filteredItem.length <= parseInt(params.maxLength) && 
                        filteredItem.stop <= parseInt(params.maxStop) ){

                        lastFiltereds.push(filteredItem);
                    }
                }

                froms = froms.concat(lastFiltereds);
            });
        }

        // console.log('froms: ');
        // console.log(froms);

        for(let toPoint of edgePointObj.tos){

            arrayFilter(formattedGraph, {to: toPoint.from}, (filteredArray)=>{
    
                let lastFiltereds = [];

                // console.log('to filtereds');
                // console.log(filteredArray);

                for(let filteredItem of filteredArray){

                    filteredItem.length = parseInt(filteredItem.length) + parseInt(toPoint.length);
                    filteredItem.stop = parseInt(filteredItem.stop) + 1;

                    if(filteredItem.length <= parseInt(params.maxLength) && 
                        filteredItem.stop <= parseInt(params.maxStop)){

                        lastFiltereds.push(filteredItem);
                    }
                }

                tos = tos.concat(lastFiltereds);
            });
        }
        
        // console.log('tos: ');
        // console.log(tos);

        findCrossingPoints(froms, tos, params, (crossingPoints) => {
            
            if( crossingPoints.length ){

                differentRoutes = differentRoutes.concat(crossingPoints);
                
                // console.log(`crossing points ${JSON.stringify(crossingPoints)} \n  differentRoutes ${JSON.stringify(differentRoutes)}`);
            }

            findSameDirections(formattedGraph, froms, tos, params, (sameDirections) => {

                if( sameDirections.length ){

                    differentRoutes = differentRoutes.concat(sameDirections);

                    // console.log(`same Directions ${JSON.stringify(sameDirections)} \n  differentRoutes ${JSON.stringify(differentRoutes)}`);
                }

                collectEdges(froms, tos, (newEdgeObj) => {

                    if( newEdgeObj.froms.length && newEdgeObj.tos.length ){
                        
                        findDiffRouts(formattedGraph, newEdgeObj, params, (dr) => {

                            callback( differentRoutes.concat(dr) );
                        });
                    
                    }else{

                        callback( differentRoutes );
                    }
                });
            });

        });        
    }

    function diffRoutes(formattedGraph, formattedRoute, params, callback){

        const startPoint = formattedRoute[0].from;
        const endPoint = formattedRoute[ formattedRoute.length -1 ].to;

        const edgePointObj = {

            froms: [{to: startPoint, length: 0}],
            tos: [{from: endPoint, length: 0}]
        };
        
        findDiffRouts(formattedGraph, edgePointObj, params, (diffs) => {

            diffRoutesResult = diffs;
            // console.log(diffs);
            callback(diffs);
        });
    }

    function findShortRouteLength(differentRoutes, callback){

        let routesLength = [];

        for(let route of differentRoutes){

            routesLength.push( route.length );
        }

        callback( Math.min(...routesLength) );
    }

    return {

        parseGraph: parseGraph,
        formatParsedGraph: formatParsedGraph,
        parseRoute: parseRoute,
        formatParsedRoute: formatParsedRoute,
        distance: distance,
        diffRoutes: diffRoutes,
        findShortRouteLength: findShortRouteLength
    }

}());

module.exports = Railway;
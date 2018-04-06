const railway = require('./Railway');

function main(){

    const exmGraph1 = '\'AL5, LC4, CW8, WC8, WG6, AW5, CG2, GL3, AG7\'';
    const exmGraph2 = 'AL5,LC4,CW8,WC8,WG6,AW5,CG2,GL3,AG7';
    const exmRoute = 'C-W-G-L';

    if( process.argv.length >= 4 ){

        const graph = process.argv[2];
        const route = process.argv[3];
        const params = {maxLength: process.argv[4] || 30, maxStop: process.argv[5] || 7} ;
    
        railway.parseGraph(graph, (parsedGraph)=>{
    
            if( parsedGraph ){
    
                railway.formatParsedGraph( parsedGraph, (formattedGraph) => {
    
                    console.log( formattedGraph );
    
                    railway.parseRoute(route, (parsedRoute) => {
    
                        if(parsedRoute){
    
                            railway.formatParsedRoute(parsedRoute, (formattedRoute) => {
    
                                if(formattedRoute){
    
                                    railway.distance( formattedGraph, formattedRoute, (distance) => {
    
                                        console.log('distance: ' , distance);
                                    });
    
                                    railway.diffRoutes( formattedGraph, formattedRoute, params, (diffroutes) => {
    
                                        console.log(`Different routes: ${JSON.stringify(diffroutes)} and count: ${diffroutes.length}`);
                                    });
                                }
    
                            });
                        
                        }else{

                            console.log('Unclear Route Data');
                            console.log(`Route example:\n ${exmRoute}`);
                        }
    
                    });
    
                });
            
            }else{
    
                console.log('Unclear Graph Data');
                console.log(`Graph examples:\n ${exmGraph1}`);
                console.log(`or:\n ${exmGraph2}`);
            }
    
        });

    }else{

        console.log(`Input examples:\n ${exmGraph1} ${exmRoute} `);
        console.log(`or:\n ${exmGraph2} ${exmRoute}`);
    }

}

main();
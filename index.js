import {createFontCatalog} from './fonts.js';
export const inject=['connection'];
export const FONT_PATH='/api/dsh-appearance-studio/fonts';

export function apply(ctx) {
    const catalog=createFontCatalog();
    const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
    const json=(status,value)=>new Response(JSON.stringify(value),{status,headers});
    const routes=[];
    ctx.effect(()=>{
        for(const [path,methods,force] of [[FONT_PATH,['GET','HEAD'],false],[FONT_PATH+'/refresh',['POST'],true]]){
            routes.push(ctx.connection.fetch.register({path,methods,requestBody:'buffered',fetch:async request=>{
                if(!methods.includes(request.method))return json(405,{ok:false,error:'METHOD_NOT_ALLOWED'});
                if(request.method==='HEAD')return new Response(null,{status:200,headers});
                try{return json(200,{ok:true,...await catalog.read(force)});}
                catch{return json(503,{ok:false,error:'FONT_ENUMERATION_FAILED'});}
            }}));
        }
        return ()=>{catalog.dispose();for(const off of routes)off();};
    },'appearance studio: authenticated local font catalog');
}

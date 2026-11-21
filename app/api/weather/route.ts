import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
async function get(url:URL){const r=await fetch(url.toString(),{cache:'no-store',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error(`Provider ${r.status}`);return r.json()}
export async function GET(req:NextRequest){
 const s=req.nextUrl.searchParams;if(!s.has('lat')||!s.has('lon'))return NextResponse.json({error:'Missing coordinates'},{status:400});
 const lat=Number(s.get('lat')),lon=Number(s.get('lon'));if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return NextResponse.json({error:'Invalid coordinates'},{status:400});
 const unit=s.get('unit')==='fahrenheit'?'fahrenheit':'celsius';
 const make=(base:string,params:Record<string,string>)=>{const u=new URL(base);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));return u};
 const f=make('https://api.open-meteo.com/v1/forecast',{latitude:String(lat),longitude:String(lon),timezone:'auto',forecast_days:'7',temperature_unit:unit,wind_speed_unit:'kmh',current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,pressure_msl,uv_index,precipitation',hourly:'temperature_2m,precipitation_probability,weather_code',daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max'});
 const a=make('https://air-quality-api.open-meteo.com/v1/air-quality',{latitude:String(lat),longitude:String(lon),timezone:'auto',current:'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide'});
 const end=new Date();end.setUTCDate(end.getUTCDate()-2);const start=new Date(end);start.setUTCDate(start.getUTCDate()-6);const dt=(x:Date)=>x.toISOString().slice(0,10);
 const h=make('https://archive-api.open-meteo.com/v1/archive',{latitude:String(lat),longitude:String(lon),start_date:dt(start),end_date:dt(end),timezone:'auto',temperature_unit:unit,daily:'temperature_2m_max,temperature_2m_min,precipitation_sum'});
 try{const [forecast,air,history]=await Promise.allSettled([get(f),get(a),get(h)]);if(forecast.status!=='fulfilled')throw Error('Forecast unavailable');return NextResponse.json({place:{id:Number(s.get('id')||0),name:s.get('name')||'Selected location',country:s.get('country')||'',admin1:s.get('admin')||'',latitude:lat,longitude:lon},...forecast.value,air:air.status==='fulfilled'?air.value:null,history:history.status==='fulfilled'?history.value:null,fetched_at:new Date().toISOString(),unit},{headers:{'Cache-Control':'no-store'}})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Weather unavailable'},{status:502})}
}

// Local preview server. It only binds to loopback and falls back if occupied.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname);
const appName = 'university-physics-optics-course';
const configuredPort = Number(process.env.OPTICS_PORT || 18765);
const preferredPort = Number.isInteger(configuredPort) && configuredPort >= 1 && configuredPort <= 65535 ? configuredPort : 18765;
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation','.pdf':'application/pdf','.blend':'application/octet-stream'};
function send(res,status,body,headers={}) { const data=Buffer.from(body); res.writeHead(status,{'Content-Length':data.length,'Cache-Control':'no-store',...headers}); if(res.req.method==='HEAD') res.end(); else res.end(data); }
const server=http.createServer((req,res)=>{
  let pathname; try { pathname=decodeURIComponent(new URL(req.url||'/', 'http://127.0.0.1').pathname); } catch { return send(res,400,'Bad request\n',{'Content-Type':'text/plain; charset=utf-8'}); }
  if(req.method!=='GET'&&req.method!=='HEAD') return send(res,405,'Method not allowed\n',{Allow:'GET, HEAD','Content-Type':'text/plain; charset=utf-8'});
  if(pathname==='/health') return send(res,200,JSON.stringify({app:appName,status:'ok',root:'optics-course'})+'\n',{'Content-Type':'application/json; charset=utf-8'});
  const requested=pathname==='/'?'/index.html':pathname;
  const segments=requested.split(/[\\/]/).filter(Boolean);
  if(segments.some(part=>part.startsWith('.')||['tools','node_modules'].includes(part.toLowerCase()))) return send(res,403,'Forbidden\n',{'Content-Type':'text/plain; charset=utf-8'});
  const target=path.resolve(root,'.'+requested);
  if(target!==root&&!target.startsWith(root+path.sep)) return send(res,403,'Forbidden\n',{'Content-Type':'text/plain; charset=utf-8'});
  fs.stat(target,(err,stat)=>{ if(err||!stat.isFile()) return send(res,404,'Not found\n',{'Content-Type':'text/plain; charset=utf-8'}); res.writeHead(200,{'Content-Type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'}); if(req.method==='HEAD') return res.end(); fs.createReadStream(target).on('error',()=>{if(!res.headersSent)send(res,500,'Read error\n');else res.destroy();}).pipe(res); });
});
function listen(port,attemptsLeft) { const onError=err=>{server.removeListener('listening',onListening); if(err.code==='EADDRINUSE'&&attemptsLeft>0)return listen(port>0?port+1:0,attemptsLeft-1); if(err.code==='EADDRINUSE'&&port!==0)return listen(0,0); console.error(`Optics course preview could not start: ${err.message}`); process.exitCode=1;}; const onListening=()=>{server.removeListener('error',onError); const actual=server.address().port; console.log(`Optics course preview: http://127.0.0.1:${actual}/`); console.log(`Optics course health: http://127.0.0.1:${actual}/health`);}; server.once('error',onError);server.once('listening',onListening);server.listen({host:'127.0.0.1',port}); }
listen(preferredPort,20);

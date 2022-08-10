const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');




const tempOverview =  fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=  fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct =  fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const objectData =  fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const productData = JSON.parse(objectData);

//////////////////SERVER//////////
const server = http.createServer((req,resp)=>{
   
    const {query,pathname} =url.parse(req.url,true);
   
    //Overview Page
    if(pathname==='/' || pathname==='/overview'){
       resp.writeHead(200,{'Content-Type':'text/html'});

       const cardsHtml = productData.map(el=> replaceTemplate(tempCard,el)).join('');
       const outPut = tempOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
       resp.end(outPut);

    //product Page
    }else if(pathname==='/product'){
        resp.writeHead(200,{'Content-Type':'text/html'});
        const product = productData[query.id];
        const outPut = replaceTemplate(tempProduct,product);
        resp.end(outPut);
    //api
    }else if(pathname==='/api'){
        resp.writeHead(200,{'Content-Type':'application/json'})

    //Not Found
    }else{
        resp.writeHead(400,{
            'Content-Type':'text/html',
            'my-own-header':'hello-word'
        });
        resp.end('<h3>Page not found</h3>')
    }
});

server.listen(5000,'127.0.0.1',()=>{
    console.log('listing port 5000');
});
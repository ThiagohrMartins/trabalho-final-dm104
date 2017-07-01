var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var mysql = require('mysql');

var app = express();
app.use(bodyParser.json());
app.use(cors())

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var despesas = {};
var sequenceId = 0;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"tbl_financa"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


app.listen(8089,function(){
    console.log('Server running...');
});


function notFound(resp){
    resp.status(404).send("Esse cara não existe!");
}

app.get('/',function(req,resp){
    //resp.json(despesas);
    var sql = "SELECT * FROM despesas;";
    con.query(sql, function(error,result){
            console.log(result); 
         resp.json(result); 
    });
   
});

app.get('/:id',function(req,resp){
    var despesa = despesas[req.params.id];
    if (despesas) {
         resp.status(200).json(despesa);
    }else{
        console.log("nao achou");
        notFound(resp);
    }
});


app.post('/api/add',function(req,resp){
    console.log(req.body);
    var newDespesa = {
        id : ++sequenceId,
        data:req.body.data,
        descricao:req.body.descricao,
        valor:req.body.valor
    };
    console.log("ADD!");
    var sql = "INSERT INTO despesas (data, descricao, valor) VALUES ('"+req.body.data+"', '"+req.body.descricao+"','"+req.body.valor+"')";
  con.query(sql, function (err, result) {
    console.log("1 record inserted");
    resp.status(200).json(result);
  });
    //despesas[sequenceId] = newDespesa;
    //resp.status(200).json(newDespesa);
});

app.post('/api/calcPeriodo',function(req,resp){
    var sql="SELECT SUM(valor) as total FROM despesas WHERE data BETWEEN  '"+req.body.dataInicio+"' AND  '"+req.body.dataFinal +"';"
    console.log(sql);
    console.log("Calcula entre...")
    con.query(sql, function(err,result){
        console.log(result);
        resp.status(200).json(result);
    });
})

app.delete('/:id',function(req,resp){
    var despesa = despesas[req.params.id];
   var sql = "DELETE FROM despesas WHERE id ="+req.params.id+" ;";
    con.query(sql, function(error,result){
            console.log(result); 
         resp.json(result); 
    });
});


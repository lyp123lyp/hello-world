const express =require("express");
const pool=require("../pool");
const router= express.Router();
//http://localhost:3000/city/province
router.get("/province",(req,res)=>{
    var sql=` select * from province`;
    res.header("Content-Type","application/json;charset=utf-8;");
    pool.query(sql,[],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
           
            res.write(JSON.stringify(result));
        }else{

           res.write({code:0});
        }
        res.end();
    });
    
});
router.get("/city",(req,res)=>{
    var sql=` select * from city`;
    res.header("Content-Type","application/json;charset=utf-8;");
    pool.query(sql,[],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
           
            res.write(JSON.stringify(result));
        }else{

           res.write({code:0});
        }
        res.end();
    });
    
});

router.get("/area",(req,res)=>{
    var sql=` select * from area`;
    res.header("Content-Type","application/json;charset=utf-8;");
    pool.query(sql,[],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
           
            res.write(JSON.stringify(result));
        }else{

           res.write({code:0});
        }
        res.end();
    });
    
});




module.exports=router;
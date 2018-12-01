const express=require("express");
const pool=require("../pool.js");
const router=express.Router();
const circularJson =require("circular-json");

//http:localhost:3000/users/register
//注册
router.post("/register",(req,res)=>{
   //res.header("Access-Control-Allow-Origin", "*");
    var uname=req.body.uname||req.query.uname;
    var upwd=req.body.upwd||req.query.upwd;
    var uemail=req.body.email||req.query.email||'';
    console.log(uemail);
    var sql="insert into qm_user(uname,upwd,uemail) values(?,md5(?),?)";
    pool.query(sql,[uname,upwd,uemail],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:"ok"});
        }else{
            res.send({code:"error"});
        }
       
        res.end();
    });
});
//登录
//http://localhost:3000/users/login
router.post("/login",(req,res)=>{
    var uname=req.body.uname;
    var upwd=req.body.upwd;
    var reg1=/^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
    var reg2=/^1[3-9][0-9]{9}$/;
    var sql=`select * from qm_user where uname=? and upwd=?`;
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            var user=result[0]
            req.session.uid=user.uid;
            //给req.session对象添加一个属性uid，并赋值（与服务器交互的时候cookie,会携带session）
            res.send(circularJson.stringify({code:"ok",session:req}));
        }else{
            res.send({code:"error"});
        }
        res.end();
    });

});

//验证用户名是否已被占用
router.get("/namerepeat",(req,res)=>{
    var uname=req.query.uname;
    var sql="select uname from qm_user where uname=?";
    pool.query(sql,[uname],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({code:1});
        }else{
            res.send({code:0});
        }
        res.end();
    });
});

//验证是否是登录状态
//需要通过session 模块
//http://localhost:3000/users/islogin
router.get("/islogin",(req,res)=>{
    if(req.session.uid===undefined){
       //res.write(JSON.stringify({ok:0}));
       res.send({code:0});
        res.end()
    }else{
        var uid=req.session.uid;
        var sql=
         "select * from qm_user where uid=?"
        pool.query(sql,[uid],(err,result)=>{
          if(err) throw err;
          //console.log(result);
          var user=result[0];
          //res.write(JSON.stringify({
        //     ok:1,uname:user.uname
        //   }))
          res.send({code:1,uname:user.uname});
          res.end()
        })
    }
      
})


//注销登录
router.get("/signout",(req,res)=>{
    req.session["uid"]=undefined;
    res.send({code:0});
    res.end();
  })
module.exports=router;
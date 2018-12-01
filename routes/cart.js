const express=require("express")
const router=express.Router()
const pool=require("../pool")

router.get("/add",(req,res)=>{
  var pid=req.query.pid;
  var count=req.query.count;
  var uid=req.session.uid;

  pool.query(//先判断商品是否存在，不存在就添加，存在就修改数据
    "select * from qm_shopping_cart where uid=? and product_id=?",
    [uid,pid],
    (err,result)=>{
      if(err) throw err;
      if(result.length==0){
        pool.query(
          "insert into qm_shopping_cart(uid,product_id,count) values(?,?,?)",
          [uid,pid,count],
          (err,result)=>{
            if(err) throw err;
            if(result.affectedRows>0){
              res.write(JSON.stringify({code:1}));
            }else{
              res.write(JSON.stringify({code:0}));
            }
            res.end();
          }
        )
      }else{
        pool.query(
          "update qm_shopping_cart set count=count+? where uid=? and product_id=?",
          [count,uid,pid,],
          (err,result)=>{
            if(err) throw err;
            if(result.affectedRows>0){
              res.write(JSON.stringify({code:1}));
            }else{
              res.write(JSON.stringify({code:0}));
            }
            res.end();
          }
        )
      }
    }
  )
});

router.get("/items",(req,res)=>{
  var uid=req.session.uid;
  var sql=`SELECT *,( select sm from qm_product_pic where qm_product_pic.product_id=qm_product.product_id limit 1 )as md FROM qm_shopping_cart inner join qm_product on qm_shopping_cart.product_id=qm_product.product_id where uid=?`;
  pool.query(sql,[uid],(err,result)=>{
    if(err) console.log(err);
    res.writeHead(200);
    res.write(JSON.stringify(result))
    res.end();
  })
})
//http://localhost:3000/users/signin?uname=dingding&upwd=123456
//http://localhost:3000/cart/update?iid=35&count=新数量
router.get("/update",(req,res)=>{// 根据iid 来修改商品
  var iid=req.query.iid;
  var count=req.query.count;
  console.log(iid,count);
  if(count>0){
    var sql="update qm_shopping_cart set count=? where cart_id=?";
    var data=[count,iid];
  }else{
    var sql="delete from qm_shopping_cart where cart_id=?";
    var data=[iid];
  }
  pool.query(sql,data,(err,result)=>{
    if(err) console.log(err);
    res.end();
  })
})


//设置购物车 is_checked
router.get("/isCheck",(req,res)=>{
  var check=req.query.check;
  var uid=req.session.uid;
  var iid=req.query.iid;
  if(iid==undefined){//判断是否是所有的都设置或者取消
    var sql=`update qm_shopping_cart set is_checked=? where uid=?`;
    pool.query(sql,[check,uid],(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.writeHead(200);
        res.write(JSON.stringify(result))
        res.end();
    });
  }else{
    var sql=`update qm_shopping_cart set is_checked=? where uid=? and cart_id=?`;
    pool.query(sql,[check,uid,iid],(err,result)=>{
        if(err) throw err;
        console.log(result)
        res.writeHead(200);
        res.write(JSON.stringify(result))
        res.end();
    });
  }
})

//删除选中项
router.get("/delchecked",(req,res)=>{
  var uid=req.session.uid;
  var sql=`delete from qm_shopping_cart where uid=? and is_checked=1`;
  pool.query(sql,[uid],(err,result)=>{
    console.log(result)
    res.writeHead(200);
    res.write(JSON.stringify(result))
    res.end();
  })
});


//购买商品的总数量查询
router.get("/productCount",(req,res)=>{
    var uid= req.session.uid;
    if(!uid){
      console.log('你没有登录');
      return ;
    }
    var sql="select sum(count) as c from qm_shopping_cart where uid=?";
    pool.query(sql,[uid],(err,result)=>{
      if(err) throw err;
      if(result.length>0){
        res.write(JSON.stringify(result));
      }
      res.end();
    });
});
module.exports=router;
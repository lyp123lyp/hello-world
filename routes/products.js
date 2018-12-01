const express =require("express");
const pool=require("../pool");
const router= express.Router();

//http://localhost:3000/products/products?keywords=苹果
router.get("/products",(req,res)=>{
    res.header("Content-Type","application/json;charset=utf-8;");
    var kw=req.query.keywords;
        //console.log(kw);
        var arr=kw.split(" ")
        for(var i=0;i<arr.length;i++){
        arr[i]=`title like '%${arr[i]}%'`
        }//arr[title like '%macbook%', ... ]
        var where=" where "+arr.join(" and ")
        // where title like '%macbook%' and title like '%i5%' and title like '%128g%'
        //要回发客户端的支持分页的对象
        var output={ pageSize:16 ,pno:0}
        
        where = `${where}   or category like '%${kw}%'`;
        
        if(req.query.pno){
            output.pno=req.query.pno*1;
        }
        var sql="SELECT product_id,src,title,name,price,old_price,is_onsale,shop_address,hot  FROM qm_product  ";
        pool.query(sql+where,[],(err,result)=>{
            if(err) throw err;
            if(result.length>0){
                output.length=result.length;//获得总记录数
                output.pageCount=Math.ceil(output.length/output.pageSize);//计算总页数
                output.products=result.slice(output.pno*16,output.pno*16+16);//截取分页后的结果集
                output.productsAll=result;
                res.write(JSON.stringify(output));
            }else{
                res.write(JSON.stringify({length:0}));
            }
            res.end();
        });
    
    
    
});


//商品详情页的查询
//http://localhost:3000/products/productDetails?pid=1
router.get("/productDetails",(req,res)=>{
    res.header("Content-Type","application/json;charset=utf-8;");
    var lid=req.query.pid;
    var output={product:{},pics:[],specs:[]};
    //用lid查当前商品信息
    var sql1="SELECT * FROM qm_product where product_id=?";//查询商品的所有的信息
    var sql2="SELECT * FROM qm_product_pic where product_id=?";//用lid查当前商品图片列表
    var sql3="SELECT product_id,spec FROM qm_product where family_id=( select family_id from qm_product where product_id=? ) ";//用lid查当前商品同系列的规格列表
    Promise.all([
      new Promise(function(open){
        pool.query(sql1,[lid],(err,result)=>{
          if(err) console.log(err);
          output.product=result[0];
          open();
          //console.log("查询product完成!");
        })
      }),
      new Promise(function(open){
        pool.query(sql2,[lid],(err,result)=>{
          if(err) console.log(err);
          output.pics=result;
          open()
          //console.log("查询pics完成");
        })
      }),
      new Promise(function(open){
        pool.query(sql3,[lid],(err,result)=>{
          if(err) console.log(err);
          output.specs=result;
          open()
         // console.log("查询specs完成");
        })
      })
    ]).then(function(){
      res.writeHead(200,{
        "Content-Type":"application/json;charset=utf-8",
        "Access-Control-Allow-Origin":"*"
      })
      res.write(JSON.stringify(output));
      res.end();
      //console.log("响应完成!");
    })
  })


//模拟热销商品
router.get("/random",(req,res)=>{
  var sql=`select * from qm_product`;
  pool.query(sql,[],(err,result)=>{
    if(err) throw errr;
    if(result.length>0){
      res.write(JSON.stringify(result));
    }else{
      res.write(JSON.stringify({code:0}));
    }
    res.end();
  });
});


//加入购物车
// router.get("/cart",(req,res)=>{
//   res.header("Content-Type","application/json;charset=utf-8;");
//   var uid=req.session.uid||1;
//   var pid=req.query.pid;
//   var count=req.query.count;
//   console.log(9)
//   var sql="insert into qm_shopping_cart(uid,product_id,count) values(?,?,?)";
//   pool.query(sql,[uid,pid,count],(err,result)=>{
//     if(err) throw err;
//     if(result.affectedRows>0){
//       res.write(JSON.stringify({code:1}));
//     }else{
//       res.write(JSON.stringify({code:0}));
//     }
//     res.end();
//   });
 
// });


module.exports=router;
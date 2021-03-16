const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const nodemailer= require('nodemailer');
const Bcrypt=require('bcrypt');
const app = express();
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
var multer = require('multer');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require('express-session');






var connect = mysql.createConnection({
  host     : 'localhost',
 
  user     : 'root',
  password : '',
  database : 'base'
});

connect.connect(function(err){

    if(err) throw err
    console.log("connected");

}); 

//static files
 app.use(express.static('public'))
 app.use(express.static('views'))
 app.use('/css',express.static(__dirname +'public/css'))
 app.use('/js',express.static(__dirname +'public/js'))
app.use('/img',express.static(__dirname +'public/img'))
app.set('view engine', 'ejs');
app.use(fileUpload());

  app.use(bodyParser.urlencoded({ extended: true }))
var upload = multer({ dest: 'public/upimage' })

//////////////////////////////////GET ///////////////////////////////// 

app.get('/Accueil',(req,res,next) => {
    // fs.createReadStream(path.join(__dirname,'Accueil.html')).pipe(res);
    
    res.render('Accueil.hbs');
    
    
    });
    
app.get('/profil',(req,res,next) => {
  res.render('profil.ejs');
      //  fs.createReadStream(path.join(__dirname,'profil.html')).pipe(res);
    });

app.get('/formation',(req,res,next) => {
      // fs.createReadStream(path.join(__dirname,'formation.html')).pipe(res);
      res.render('formation.ejs');
   });

app.get('/experience',(req,res,next) => {
 
    // fs.createReadStream(path.join(__dirname,'experience.html')).pipe(res);
    res.render('experience.ejs' ,{id:req.query.id});
 });

app.get('/competence',(req,res,next) => {
  // fs.createReadStream(path.join(__dirname,'competence.html')).pipe(res);
  res.render('competence.ejs' ,{id:req.query.id});
});

app.get('/langue',(req,res,next) => {
  // fs.createReadStream(path.join(__dirname,'langue.html')).pipe(res);
  res.render('langue.ejs',{id:req.query.id});
});

app.get('/centre',(req,res,next) => {
  // fs.createReadStream(path.join(__dirname,'centre_interet.html')).pipe(res);
  res.render('centre_interet.ejs',{id:req.query.id});
});

app.get('/inscription',(req,res,next) => {
 // fs.createReadStream(path.join(__dirname,'inscription.html')).pipe(res);
 res.render('inscription.hbs');
});

app.get('/connexion',(req,res,next) => {


 res.render('connexion',{id:req.query.id});
});

app.get('/forgotten',(req,res,next) => {


  res.render('forgotten_pass.hbs');
 });

 app.get('/aff_apr',(req,res,next) => {


  res.render('aff_apres.ejs');
 });


 app.get('/upd_pass',(req,res,next) => {

  res.render('update_password.ejs');
 });

app.get('/portfolio',(req,res,next) => {

  // var param=[
  //   req.query.id
  // ]
  // var profil="select * from profil where  idInsc= '"+i+"' "

    connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
       if (err) throw err;
        
    // var formation="select * from formation  where  idInsc= '"+i+"'"
     connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
         if (err) throw err;
        
       //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
        connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
             if (err) throw err;
            //  var interetSql="select * from centre where idInsc= '"+i+"'"
             connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                if (err) throw err;

                // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                  if (err) throw err;


                  // var  competence="select * from competence where  idInsc= '"+i+"'"
                  connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                    if (err) throw err;

                         res.render('portfolio',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
             

                      
                   });

             });
             
         });

      });
         
   });

  });
  
 });


 app.get('/deconnexion',(req,res,next) => {
  req.logout();
  res.redirect("/Accueil");
  
 });
//////nouveau password///////////
 app.post('/upPass', async function (req,res,next) {
      const salt=await Bcrypt.genSalt();
      const hashedPassword=await Bcrypt.hash(req.body.mdp ,salt)
                  var sqlp=" update inscription set password ='"+hashedPassword+"' where pseudo = '"+req.body.pseud+"'";
                 
                         
                              
                       connect.query(sqlp,function(err,results){
                       if (err)throw err
                       else if (results.length==0) {
                    req.flash(' mess', 'ce pseudo n existe pas');
                    res.locals.messages = req.flash();
    
    
                    return res.render('update_password.ejs')} 
                    else
                       res.render('connexion');
                      
                      
                       })  ; 
               
                      
 }); 
   ////////oublie du password////////// 
 app.post('/forget', (req,res) => {
    
      var sql ="select email FROM inscription where  pseudo = '"+req.body.pseud+"'";
      connect.query(sql, async function(err,results){
        if (err){ 
        //   req.flash(' mess', 'cet email n existe pas');
        // res.locals.messages = req.flash();
       return res.render('forgotten_pass',{
        mess:"cet email n existe pas"})}
       
        else  if (results[0].email== 0){
          return res.render('forgotten_pass',{
            mess:"cet email n existe pas"})}
     
              else {
                 console.log(results[0].email);
              var transport = nodemailer.createTransport({
                host:"smtp.gmail.com",
                port: 465,
                secure:true,
               
                auth:{
                  user:'carrerpath12@gmail.com',
                  pass:'carrerPath123'
                 //  carrerPath123
                }
         
              })

              var msg=`<p> cliquer ici pour creer un nouveau mot de passe <a href="http://localhost:8000/upd_pass">LINK</a>`;
              var em=`${results[0].email}`;
             
              var mail ={
                from:'carrerpath12@gmail.com',
                to:em,
                subject:"mail from site carer path",
               
                html:msg
              }
         
                transport.sendMail(mail,function(err,resu){
                  if(err){
                    console.log(err);
                    
                  }else{
                  res.render('aff_apres.ejs');
                  //  console.log("email sent");
                  //   console.log(msg);
         
                  }
         
                });
      
            }
       })  ;
        
}); 
////////////formulaire contact de la page d accueil
 app.post('/emailMe', function (req,res,next) {
     var transport = nodemailer.createTransport({
       host:"smtp.gmail.com",
       port: 465,
       secure:true,
      
       auth:{
         user:'carrerpath12@gmail.com',
         pass:'carrerPath123'
        //  carrerPath123
       }

     })

    var msg=`De chez:${req.body.name}  Email: ${req.body.email} Message: ${req.body.message}`;
     var em=`email: ${req.body.email}`;
    
     var mail ={
       from:em,
       to:'carrerpath12@gmail.com',
       subject:"mail from site carer path",
      
       text:msg
     }

       transport.sendMail(mail,function(err,re){
         if(err){
           console.log(err);
           
         }else{
         res.render('Accueil.hbs',{msg:'email has been sent'})
          console.log("email sent");
          

         }



       });



      //res.json({message:"email function implemented"});
             
            
 }); 



//////////////////////////////////POST des donnees des formulaire dans la base ///////////////////////////////// 


app.post('/POSTprofil', (req,res) => {
 
      var id=req.query.id;
       if (!req.files){
       return res.status(400).send('No files were uploaded.');}

       var file = req.files.photo;
     var img_name=file.name;

 
 

     var sqlProfil=" insert into profil values (null,'"+req.body.nom+"','"+req.body.prenom +"','"+req.body.email+"','"+req.body.tel+"','"+req.body.age+"','"+req.body.adresse+"','"+req.body.profession+"','"+req.body.website+"','"+req.body.message+"' ,'"+img_name+"','"+id+"') ";
       
      
        connect.query(sqlProfil,function(err,results){
        if (err)throw err
        else
        file.mv('public/upimage/'+file.name, function(err) {

             res.render('formation',{id:req.query.id});
        console.log(req.body.nom);
        console.log(img_name);
         console.log('yes');
        })  ; 

      });
      
      
    }); 

app.post('/formation', function (req,res,next) {
  var id=req.query.id;
  console.log(id);
  var sqlFormation="insert into formation values (null,'"+req.body.formation+"','"+req.body.etablissement +"','"+req.body.ville+"','"+req.body.dateD+"','"+req.body.dateF+"','"+req.body.message1+"' ,'"+id+"')";
         
        
          connect.query(sqlFormation,function(err,results){
          if (err)throw err
          else
        
          res.render('formation.ejs',{id:req.query.id});
          console.log(results);
          console.log('yes ');
          })  ; 
  
         
        
      }); 

app.post('/experience', function (req,res,next) {
  var id=req.query.id;
  var sqlExperience=  "insert into experience values (null,'"+req.body.poste+"','"+req.body.ville +"','"+req.body.dateDe+"','"+req.body.dateFi+"','"+req.body.message2+"','"+id+"')";
            
           
             connect.query(sqlExperience,function(err,results){
             if (err)throw err
             else
             
          res.render('experience.ejs',{id:req.query.id});
             console.log(results);
             console.log('yes ');
             })  ; 
     
            
           
         }); 

app.post('/competence', function (req,res,next) {
  var id=req.query.id;
          var sqlCompetence="insert into competence values (null,'"+req.body.Competence+"','"+req.body.niveau +"','"+req.body.ans+"','"+id+"')";
              
             
               connect.query(sqlCompetence,function(err,results){
               if (err)throw err
               else
                    
          res.render('competence.ejs',{id:req.query.id});
               console.log(results);
               console.log('yes ');
               })  ; 
       
               
             
           }); 

app.post('/langue', function (req,res,next) {
  var id=req.query.id;
            var sqlLangue="insert into langue values (null,'"+req.body.langue+"','"+req.body.niv +"','"+id+"')";
                
               
                 connect.query(sqlLangue,function(err,results){
                 if (err)throw err
                 else
                 res.render('langue.ejs',{id:req.query.id});
                 console.log(results);
                 console.log('yes ');
                 })  ; 
         
                
               
             }); 

app.post('/centre', function (req,res,next) {
  var id=req.query.id;
              var sqlCentre="insert into centre values (null,'"+req.body.interet+"','"+id+"')";
                  
                 
                   connect.query(sqlCentre,function(err,results){
                   if (err)throw err
                   else
                   res.render('centre_interet.ejs',{id:req.query.id});
                   console.log(results);
                   console.log('yes ');
                   })  ; 
           
                  
                 
               }); 

    
//////////////////////////////////INSCRIPTION /CONNEXION /////////////////////////////////        
              
app.post('/inscription',async (req,res) =>{
  
  var ins="SELECT pseudo FROM inscription where pseudo = '"+req.body.pseudo+"' ";
  connect.query(ins, async (err,results) =>{
   

    if (results.length> 0){
          return res.render('inscription.hbs',{
            message:"ce pseudo existe deja"})}

      else{

                const salt=await Bcrypt.genSalt();
                   const hashedPassword=await Bcrypt.hash(req.body.password ,salt)
                 
                    var sqlInscription="insert into inscription values (null,'"+req.body.pseudo+"','"+req.body.email+"','"+hashedPassword+"')";
                       connect.query(sqlInscription,function(err,results){
                      if (err)throw err
                         else{
                        

                         var id ="select idInsc from inscription where pseudo = '"+req.body.pseudo+"'";
                         connect.query(id,function(err,result){
                          if (err)throw err
                             else{
                        
           
                          
                              res.render('profil',{id:result[0].idInsc});
                              console.log(result[0].idInsc);
                                   console.log('yes ');}

                                   
                             });
                       
                           }
                        
                      })  ; 

                      

                     
                  //res.redirect('/centre');
              
      }
    });

}); 


//connexion
 app.post('/port', (req,res) =>{

  let message="ce pseudo n'existe pas";
  let msg="mot de passe erroné";
      var ins="SELECT password FROM inscription where pseudo = '"+req.body.pseud+"' ";
      connect.query(ins, async function(err,results){
        if (err){
         // req.flash(' message', 'ce pseudo n existe pas');
          //res.locals.messages = req.flash();
        return res.render('connexion' )}
              

              else if (results[0].length == 0) {
              //  req.flash(' mess', 'ce pseudo n existe pas');
              //  res.locals.messages = req.flash();


                return res.render('connexion')} 
                     
                  
                   else {
                          var compare= await Bcrypt.compare(req.body.mdp,results[0].password);
                             if (compare == false) {
                              //req.flash(' messag', 'mot de passe erroné');
                              //res.locals.messages = req.flash();
                           return res.render('connexion' )
                               
                     }else {
                   var id="select idInsc from inscription where pseudo = '"+req.body.pseud+"' "
            connect.query(id, async function(err,resul,fields){
             if (err) throw err;
     console.log(resul[0].idInsc);
   var i=resul[0].idInsc;

           //var profil="select *  from profil, formation , competence, experience, langue, centre  where  centre.idInsc= '"+i+"' AND langue.idInsc= '"+i+"' AND experience.idInsc= '"+i+"' AND competence.idInsc= '"+i+"' AND formation.idInsc= '"+i+"'  AND profil.idInsc= '"+i+"'"                        
         var profil="select * from profil where  idInsc= '"+i+"' "

  connect.query(profil, function(err,result,fields){
       if (err) throw err;
        
     var formation="select * from formation  where  idInsc= '"+i+"'"
   connect.query(formation, function(err,resu,fields){
         if (err) throw err;
        
         var experienceSql="select * from experience where  idInsc= '"+i+"'"
        connect.query(experienceSql, function(err,resul,fields){
             if (err) throw err;
             var interetSql="select * from centre where idInsc= '"+i+"'"
             connect.query(interetSql,  function(err,r,fields){
                if (err) throw err;

                var  langueSql="select * from langue where  idInsc= '"+i+"'"
                connect.query(langueSql,  function(err,re,fields){
                  if (err) throw err;


                  var  competence="select * from competence where  idInsc= '"+i+"'"
                  connect.query(competence,  function(err,resultat,fields){
                    if (err) throw err;

                         res.render('portfolio',{id :resul[0].idInsc, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
             

                      });
                   });

             });
             
         });

      });
         
   });

   });                


    } 
                  
    }

  });  

});

////////////////////////////////DELETE////////////////////////////////////////


app.get('/deleteCentre', (req,res) =>    {
  
  var param=[
   
    req.query.id,
   

  ]

 connect.query("DELETE from centre where id= ? ", param, function(err,rs){
  
  connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
    if (err) throw err;
     
 // var formation="select * from formation  where  idInsc= '"+i+"'"
 connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
      if (err) throw err;
     
    //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
     connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
          if (err) throw err;
         //  var interetSql="select * from centre where idInsc= '"+i+"'"
          connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
             if (err) throw err;

             // var  langueSql="select * from langue where  idInsc= '"+i+"'"
             connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
               if (err) throw err;


               // var  competence="select * from competence where  idInsc= '"+i+"'"
               connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                 if (err) throw err;

                      res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
          

                   
                });

          });
          
      });

   });
      
});

});


})


});   

app.get('/deleteLang', (req,res) =>    {

  connect.query("DELETE from langue where id= ?",req.query.id,function(err,rs){
    connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
      if (err) throw err;
       
   // var formation="select * from formation  where  idInsc= '"+i+"'"
  connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
        if (err) throw err;
       
      //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
       connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
            if (err) throw err;
           //  var interetSql="select * from centre where idInsc= '"+i+"'"
            connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
               if (err) throw err;

               // var  langueSql="select * from langue where  idInsc= '"+i+"'"
               connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                 if (err) throw err;


                 // var  competence="select * from competence where  idInsc= '"+i+"'"
                 connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                   if (err) throw err;

                        res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
            

                     
                  });

            });
            
        });

     });
        
  });

});
 })
  }); 

  app.get('/deleteExp', (req,res) =>    {

    connect.query("DELETE from experience where id= ?",req.query.id,function(err,rs){
      connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
        if (err) throw err;
         
     // var formation="select * from formation  where  idInsc= '"+i+"'"
    connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
          if (err) throw err;
         
        //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
         connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
              if (err) throw err;
             //  var interetSql="select * from centre where idInsc= '"+i+"'"
              connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                 if (err) throw err;
 
                 // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                 connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                   if (err) throw err;
 
 
                   // var  competence="select * from competence where  idInsc= '"+i+"'"
                   connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                     if (err) throw err;
 
                          res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
              
 
                       
                    });
 
              });
              
          });
 
       });
          
    });
 
  });
 
 
    })
    
    
    }); 
   
    app.get('/deleteForma', (req,res) =>    {

      connect.query("DELETE from formation where id= ?",req.query.id,function(err,rs){
        connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
          if (err) throw err;
           
       // var formation="select * from formation  where  idInsc= '"+i+"'"
      connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
            if (err) throw err;
           
          //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
           connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                if (err) throw err;
               //  var interetSql="select * from centre where idInsc= '"+i+"'"
                connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                   if (err) throw err;
   
                   // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                   connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                     if (err) throw err;
   
   
                     // var  competence="select * from competence where  idInsc= '"+i+"'"
                     connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                       if (err) throw err;
   
                            res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                
   
                         
                      });
   
                });
                
            });
   
         });
            
      });
   
    });
   
   
      })
      
      
      });

      app.get('/deleteComp', (req,res) =>    {

        connect.query("DELETE from competence where id= ?",req.query.id,function(err,rs){
          connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
            if (err) throw err;
             
         // var formation="select * from formation  where  idInsc= '"+i+"'"
        connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
              if (err) throw err;
             
            //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
             connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                  if (err) throw err;
                 //  var interetSql="select * from centre where idInsc= '"+i+"'"
                  connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                     if (err) throw err;
     
                     // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                     connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                       if (err) throw err;
     
     
                       // var  competence="select * from competence where  idInsc= '"+i+"'"
                       connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                         if (err) throw err;
     
                              res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                  
     
                           
                        });
     
                  });
                  
              });
     
           });
              
        });
     
      });
     
     
        })
        
        
        });


/////////////////////////////////////ADD//////////////////////////////////////////////



app.get('/addCentre', (req,res) => {

  res.render('addCentre.ejs',{idInsc:req.query.idInsc, id:req.query.id});
});

app.post ('/addCentre', (req,res) =>  {
 
   var id= req.query.idInsc;
     
  
  var c="insert into centre (interet,idInsc)values ('"+req.body.interet+"','"+id+"')";
              connect.query(c,function(err,rs){
                if (err)throw err
                else
                connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                               if (err) throw err;
           
                                    res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                        
           
                                 
                              });
           
                        });
                        
                    });
           
                 });
                    
              });
           
            });
           
           
              
              });


  console.log(req.query.idInsc);
  console.log(req.body.interet);

});


app.get('/addlangue', (req,res) => {

  res.render('addlangue.ejs',{idInsc:req.query.idInsc, id:req.query.id});
});

app.post ('/addlangue', (req,res) =>  {
 
  var id= req.query.idInsc;
    
 
 var c="insert into langue (langue,niveau,idInsc)values ('"+req.body.langue+"','"+req.body.niv +"','"+id+"')";
             connect.query(c,function(err,rs){
               if (err)throw err
               else
               connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
                if (err) throw err;
                 
             // var formation="select * from formation  where  idInsc= '"+i+"'"
            connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
                  if (err) throw err;
                 
                //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                 connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
                      if (err) throw err;
                     //  var interetSql="select * from centre where idInsc= '"+i+"'"
                      connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                         if (err) throw err;
         
                         // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                         connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                           if (err) throw err;
         
         
                           // var  competence="select * from competence where  idInsc= '"+i+"'"
                           connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                             if (err) throw err;
         
                                  res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                      
         
                               
                            });
         
                      });
                      
                  });
         
               });
                  
            });
         
          });
             });


 

});


app.get('/addexp', (req,res) => {

  res.render('addexperience.ejs',{idInsc:req.query.idInsc, id:req.query.id});
});

app.post ('/addexp', (req,res) =>  {
 
  var id= req.query.idInsc;
    
 
 var c="insert into experience (poste,ville,dateD,dateF,message,idInsc)values ('"+req.body.poste+"','"+req.body.ville +"','"+req.body.dateDe+"','"+req.body.dateFi+"','"+req.body.message2+"','"+id+"')";
             connect.query(c,function(err,rs){
               if (err)throw err
               else
               connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
                if (err) throw err;
                 
             // var formation="select * from formation  where  idInsc= '"+i+"'"
            connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
                  if (err) throw err;
                 
                //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                 connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
                      if (err) throw err;
                     //  var interetSql="select * from centre where idInsc= '"+i+"'"
                      connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                         if (err) throw err;
         
                         // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                         connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                           if (err) throw err;
         
         
                           // var  competence="select * from competence where  idInsc= '"+i+"'"
                           connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                             if (err) throw err;
         
                                  res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                      
         
                               
                            });
         
                      });
                      
                  });
         
               });
                  
            });
         
          });
             });


 

});


app.get('/addfor', (req,res) => {

  res.render('addformation.ejs',{idInsc:req.query.idInsc, id:req.query.id});
});

app.post ('/addfor', (req,res) =>  {
 
  var id= req.query.idInsc;
    
 
 var c="insert into formation (formation,etablissement,ville,dateD,dateF,message,idInsc)values ('"+req.body.formation+"','"+req.body.etablissement +"','"+req.body.ville+"','"+req.body.dateD+"','"+req.body.dateF+"','"+req.body.message1+"' ,'"+id+"')";
             connect.query(c,function(err,rs){
               if (err)throw err
               else
               connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
                if (err) throw err;
                 
             // var formation="select * from formation  where  idInsc= '"+i+"'"
            connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
                  if (err) throw err;
                 
                //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                 connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
                      if (err) throw err;
                     //  var interetSql="select * from centre where idInsc= '"+i+"'"
                      connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                         if (err) throw err;
         
                         // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                         connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                           if (err) throw err;
         
         
                           // var  competence="select * from competence where  idInsc= '"+i+"'"
                           connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                             if (err) throw err;
         
                                  res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                      
         
                               
                            });
         
                      });
                      
                  });
         
               });
                  
            });
         
          });
             });


 

});


app.get('/addcomp', (req,res) => {

  res.render('addcomp.ejs',{idInsc:req.query.idInsc , id:req.query.id});
});

app.post ('/addcomp', (req,res) =>  {
 
  var id= req.query.idInsc;
    
 
 var c="insert into competence (competence,niveau,ans,idInsc)values ('"+req.body.Competence+"','"+req.body.niveau +"','"+req.body.ans+"','"+id+"')";
             connect.query(c,function(err,rs){
               if (err)throw err
               else
               connect.query("select * from profil where  idInsc= ? ", req.query.id, function(err,result,fields){
                if (err) throw err;
                 
             // var formation="select * from formation  where  idInsc= '"+i+"'"
            connect.query("select * from formation  where  idInsc= ?",req.query.id,function(err,resu,fields){
                  if (err) throw err;
                 
                //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                 connect.query("select * from experience where  idInsc=?",req.query.id, function(err,resul,fields){
                      if (err) throw err;
                     //  var interetSql="select * from centre where idInsc= '"+i+"'"
                      connect.query("select * from centre where idInsc= ?",req.query.id,  function(err,r,fields){
                         if (err) throw err;
         
                         // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                         connect.query("select * from langue where  idInsc= ?",req.query.id, function(err,re,fields){
                           if (err) throw err;
         
         
                           // var  competence="select * from competence where  idInsc= '"+i+"'"
                           connect.query("select * from competence where  idInsc= ?", req.query.id, function(err,resultat,fields){
                             if (err) throw err;
         
                                  res.render('portfolio.ejs',{id:req.query.id, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                      
         
                               
                            });
         
                      });
                      
                  });
         
               });
                  
            });
         
          });
             });


 

});

///////////////////////////UPDATE///////////////////////////////////////

app.get('/uplangue', (req,res) => {
  connect.query("select * from langue where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else
    res.render('uplangue.ejs',{id:req.query.id,langue:rs[0] ,idf:req.query.idf});

  });
   
  
  
});
app.post ('/uplangue', (req,res) =>  {
 var param=[
 
req.query.id
 ]
 //var c="insert into langue (langue,niveau)values ('"+req.body.langue+"','"+req.body.niv +"')";
//  langue='"+req.body.langue+"',niveau='"+req.body.niv +"'   
          connect.query("update langue set langue='"+req.body.langue+"', niveau='"+req.body.nive +"' where id =?",param,function(err,rs){
               if (err)throw err
               else
              
               connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
                if (err) throw err;
                 
             // var formation="select * from formation  where  idInsc= '"+i+"'"
            connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
                  if (err) throw err;
                 
                //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                 connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                      if (err) throw err;
                     //  var interetSql="select * from centre where idInsc= '"+i+"'"
                      connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                         if (err) throw err;
         
                         // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                         connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                           if (err) throw err;
         
         
                           // var  competence="select * from competence where  idInsc= '"+i+"'"
                           connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                             if (err) throw err;
         
                                  res.render('portfolio.ejs',{id:req.query.idf, profil :result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                      
         
                                
                                });
           
                              });
                              
                          });
                 
                       });
                          
                    });
                 
                    });
       
                  });
                });



app.get('/upcentre', (req,res) => {

  connect.query("select * from centre where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else
   
 res.render('upcentre.ejs',{id:req.query.id,centre:rs[0],idf:req.query.idf});
  });

 


});

app.post ('/upcentre', (req,res) =>  {
  var param=[
    req.body,
 req.query.id
  ]
//  interet='"+req.body.interet+"'
              connect.query("update centre set ?  where id =?",param,function(err,rs){
                if (err)throw err
                else
                connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                               if (err) throw err;
           
                                    res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                        
           
                                  
                                  });
           
                                });
                                
                            });
                   
                         });
                            
                      });
                   
                      });
         
                    });
                  });



 app.get('/upexp', (req,res) => {
  connect.query("select * from experience where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else
   
 res.render('upexp.ejs',{id:req.query.id,exp:rs[0],idf:req.query.idf});
  });
   
 


});

app.post ('/upexp', (req,res) =>  {
  var param=[
   
 req.query.id
  ]
//  poste='"+req.body.poste+"',ville='"+req.body.ville +"',dateD='"+req.body.dateDe+"',dateF='"+req.body.dateFi+"',message='"+req.body.message2+"'
              connect.query("update experience set poste='"+req.body.poste+"',ville='"+req.body.ville +"',dateD='"+req.body.dateDe+"',dateF='"+req.body.dateFi+"',message='"+req.body.message2+"' where id =?",param,function(err,rs){
                if (err)throw err
                else
                connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                               if (err) throw err;
           
                                    res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                        
           
                                  
                                  });
           
                                });
                                
                            });
                   
                         });
                            
                      });
                   
                      });
                    });
                  });



 app.get('/upfor', (req,res) => {
  connect.query("select * from formation where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else
    res.render('upfor.ejs',{id:req.query.id,form:rs[0],idf:req.query.idf});

  });
 


});

app.post ('/upfor', (req,res) =>  {
  var param=[
    
 req.query.id
  ]
  // formation='"+req.body.formation+"',etablissement='"+req.body.etablissement +"', ville='"+req.body.ville +"',dateD='"+req.body.dateD+"',dateF='"+req.body.dateF+"',message='"+req.body.message1+"'
              connect.query("update formation set formation='"+req.body.formation+"',etablissement='"+req.body.etablissement +"', ville='"+req.body.ville +"',dateD='"+req.body.dateD+"',dateF='"+req.body.dateF+"',message='"+req.body.message1+"' where id =?",param,function(err,rs){
                if (err)throw err
                else
                connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                               if (err) throw err;
           
                                    res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                        
                    
                                  });
           
                                });
                                
                            });
                   
                         });
                            
                      });
                   
                      });
         
                    });
                  });


 app.get('/upcomp', (req,res) => {
  connect.query("select * from competence where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else
   
 res.render('upcomp.ejs',{id:req.query.id,comp:rs[0],idf:req.query.idf});
  });
 


});

app.post ('/upcomp', (req,res) =>  {
  var param=[
    req.body,
 req.query.id
  ]
  var id=req.query.idf;
//  competence='"+req.body.Competence+"',niveau='"+req.body.niveau +"',ans='"+req.body.ans+"'
              connect.query("update competence set ?  where id =?",param,function(err,rs){
                if (err)throw err
                else
                  connect.query("select * from profil where  idInsc= '"+id+"' ", function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= '"+id+"' ",function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc= '"+id+"' ", function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= '"+id+"' ",  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc=  '"+id+"' ", function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc=  '"+id+"' ", function(err,resultat,fields){
                               if (err) throw err;
           
                                    res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                        
           
                              
                                  });
           
                                });
                                
                            });
                   
                         });
                            
                      });
                   
                      });
         
                    });
                  });



 app.get('/upprof', (req,res) => {
  connect.query("select * from profil where id =?",req.query.id,function(err,rs){
    if (err)throw err
    else

    res.render('upprof.ejs',{id:req.query.id,pr:rs[0],idf:req.query.idf});

  });
 


});


app.post ('/upprof', (req,res) =>  {
  

  
  if (!req.files){
				return res.status(400).send('No files were uploaded.');}

        var file = req.files.photo;
		var img_name=file.name;
var param=[
    req.body,
    
 req.query.id
  ]
       file.mv('public/upimage/'+file.name, function(err) {
                    
              connect.query("update profil set ?  where id = ?",param,function(err,rs){
                if (err)throw err
                else
                connect.query("update profil set photo= '"+img_name+"'   where id ='"+req.query.id+"'",function(err,rs){
                  if (err)throw err
                  else

                connect.query("select * from profil where  idInsc= ? ", req.query.idf, function(err,result,fields){
                  if (err) throw err;
                   
               // var formation="select * from formation  where  idInsc= '"+i+"'"
              connect.query("select * from formation  where  idInsc= ?",req.query.idf,function(err,resu,fields){
                    if (err) throw err;
                   
                  //  var experienceSql="select * from experience where  idInsc= '"+i+"'"
                   connect.query("select * from experience where  idInsc=?",req.query.idf, function(err,resul,fields){
                        if (err) throw err;
                       //  var interetSql="select * from centre where idInsc= '"+i+"'"
                        connect.query("select * from centre where idInsc= ?",req.query.idf,  function(err,r,fields){
                           if (err) throw err;
           
                           // var  langueSql="select * from langue where  idInsc= '"+i+"'"
                           connect.query("select * from langue where  idInsc= ?",req.query.idf, function(err,re,fields){
                             if (err) throw err;
           
           
                             // var  competence="select * from competence where  idInsc= '"+i+"'"
                             connect.query("select * from competence where  idInsc= ?", req.query.idf, function(err,resultat,fields){
                               if (err) throw err;
                              
                                   console.log("Successfully moved the file!");
                                    res.render('portfolio.ejs',{id:req.query.idf, profil : result[0],Formation:resu ,experience:resul,interet:r,langue:re,competence:resultat});
                               
                          
                                  });
                                
                              });
           
                        });
                        
                    });
           
                 });
                    
              });
           
              });
 
            });
          
         
          });  
      });
  
  app.listen(8000);


const { faker, el } = require('@faker-js/faker');
const mysql = require('mysql2');

const express = require('express');
const app = express();
// let port = process.env.PORT | 8080;
const path = require('path');

const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname + "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'vk_app',
    password: 'vaibhav@45',
  });

  // INSERTING NEW DATA INTO THE DATABASE
//  let q="INSERT INTO user (Id, username, email, password) VALUES ?";
//  let users =[ 
//   ["123b", "ayush", "abc@gmail.comb", "abcb"],
//   ["123c", "om", "abc@gmail.comc", "abcbd"],
// ];

//   try{
//     connection.query(q, [users],(err, result) => {
//       if(err) throw err;
//     console.log(result);
// });
//   }catch(err){
//     console.log(err);
// }

// connection.end();


// let getRandomUser= () =>{
//   return {
//     Id: faker.string.uuid(),
//     username: faker.internet.userName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };
// }

// INSERTING RANDOM DATA  IN BULK INTO THE DATABASE

let getRandomUser= () =>{
  return [
     faker.string.uuid(),
     faker.internet.userName(),
     faker.internet.email(),
     faker.internet.password(),
  ];
}


//Home page route
app.get('/', (req, res) => {
  let q = `SELECT COUNT(*) FROM user`;
    try{
  connection.query(q,(err, result) => {
    if(err) throw err;
  let count = result[0]["COUNT(*)"];
  res.render("home.ejs",{count}); 
});
}catch(err){
  console.log(err);
  res.send("some error occured");
}
});


//Show Route
app.get("/user", (req , res) =>{
  let q = `SELECT * FROM user`;

  try{
    connection.query(q,(err, users) => {
      if(err) throw err;
    // console.log(result);
    res.render("showusers.ejs",{users}); 
  });
  }catch(err){
    console.log(err);
    res.send("some error occured");
  }
});

//Edit Route

app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE Id ='${id}'`;
  
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      let user = result[0];
    res.render("edit.ejs",{user}); 
  });
  }catch(err){
    console.log(err);
    res.send("some error occured");
  }
});

//update (DB) Route
app.patch("/user/:id", (req,res) => {
  let {id} = req.params;
  let {password: formPass, username: formUser} = req.body;
  let q = `SELECT * FROM user WHERE Id ='${id}'`;
  try{
    connection.query(q,(err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formPass != user.password){
        res.send("Password does not match");
      }else{
    let q2 = `UPDATE user SET username = '${formUser}' WHERE Id = '${id}'`; //username update query
    connection.query(q2,(err, result) => {
      if(err) throw err;
      res.redirect("/user");
      });
    }
  });
  }catch(err){
    console.log(err);
    res.send("some error occured");
  }
});

app.listen("8080", () => {
    console.log('Server is running on port 8080');
  });




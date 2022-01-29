const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");



const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// const port = 3000;
// heroku port
const port = process.env.PORT || 3000;

app.get("/",(req, res)=>{
  res.sendFile(__dirname+"/index.html");

})

app.get("/projects", (req, res)=>{
  res.send("<h1>lists of projects coming soon </h1>");
})



// ******FUN PAGE
let loveRate = "";
app.get("/fun/love-calculator", (req, res)=>{
  res.render('love-calculator', {loveRateVariable: loveRate, titleName : "Love Calculator"});
})

app.get("/fun/bmi-calculator.html", (req, res)=>{
  res.sendFile(__dirname+"/bmi-calculator.html");
})


app.post("/fun/love-calculator",(req, res)=>{
  // tapping the vaules of FORM from request and body parser-parsed as text
  // console.log(req.body);
  // console.log(req.body.num1);

  // var num1 = Number(req.body.num1);
  // var num2 = Number(req.body.num2);
  // var result = num1+num2;
  // res.send("Result of the calculation is " + result);

  loveRate = Math.round(Math.random()*101);
  res.redirect("/fun/love-calculator");

})



app.post("/fun/bmi-calculator.html",(req, res)=>{
  function bmiCalculator(weight,height){
      var bmi = Math.round(weight / Math.pow(height,2));
      return Math.round(bmi);
  }
  var weight = Number(req.body.weight);
  var height = Number(req.body.height);


  res.send("Your BMI is " + bmiCalculator(weight,height));
})

// ******* KANYE REST PAGE

app.get("/apiUsage/kanye-rest.html", (req,res)=>{
  const urlKanye = "https://api.kanye.rest";
  https.get(urlKanye,(response)=>{
  response.on("data", (data)=>{
    let kanyeQuote = JSON.parse(data);
    res.write("<h1>Kanye Rest Quote</h1>");
    res.write("<p> '"+kanyeQuote.quote+" '</p>");
    res.send();

  })
  })

})

// ***** WEATHER APP


app.get("/apiUsage/weather-app.html", (req,res)=>{
  res.sendFile(__dirname+"/weather-app.html")
});

app.post("/apiUsage/weather-app.html", (req, res)=>{

  const weatherApiKey = "8d8d5ba8c9233eac60fa3e4ebad545c5";
  const weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  const weatherLocation = req.body.cityName;
  const weatherUrl = weatherEndpoint+"?q="+weatherLocation+"&units=metric&appid="+weatherApiKey;

  https.get(weatherUrl,(response)=>{
    console.log(response);
    response.on("data", (data)=>{
      const weatherData = JSON.parse(data)
      const temp = weatherData.main.temp
      const description = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const iconUrl = " http://openweathermap.org/img/wn/"+icon+"@2x.png"
      res.write("<h1>Current weather of "+ weatherLocation+" </h1>")
      res.write("Temparature :"+temp+"<br/>")
      res.write("Description : "+description+"<br>")
      res.write("<img src='"+iconUrl+"'>")
      res.send()
      //
      // console.log(weatherData);
    })
  })
});

// ************ SIGN UP PAGE *************


app.get("/sign-up.html", function(req,res){
  res.sendFile(__dirname+"/sign-up.html");
});

app.post("/sign-up.html", function(req,res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  console.log(fName, lName, email);
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
    	FNAME: fName,
    	LNAME: lName
      }
    }

    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    const url = "https://us20.api.mailchimp.com/3.0/lists/2ed4441bc9/members";
    const options ={
      method:"POST",
      auth:"ashes:302ba07cc86991e7d10b2428323e9f67-us20"
    }

    const request = https.request(url, options, function(response){
      if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html");
      }

      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/sign-up.html");
})

// apiUsage
// 302ba07cc86991e7d10b2428323e9f67-us20

// audience id
// 2ed4441bc9

// *****************EJS TEMPLATE

// ***TO DO LIST



app.get("/mysite",(req,res)=>{
  res.render('mySite',{foo : "FOO"});
});

var listItems = [];
let workListItems = [];
function todayDate(){
  let date = new Date();
  let currentDate = date.getDay();
  const options = {
        weekday: 'long',
        // year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-us', options);
}

app.get("/to-do-list",(req,res)=>{
  let currentDay = todayDate();
  res.render('list',{kindOfDay : currentDay, newListItem : listItems, listTitle : "Home", titleName: "Todo List-Home"});
  // console.log(date.toLocaleString('en-US', options));
});
app.post("/to-do-list",(req,res)=>{
  let listItem = req.body.listItem;
  if(req.body.list == "Work"){
    workListItems.push(listItem);
    res.redirect("/to-do-list-work");
  }else{
    listItems.push(listItem);
    res.redirect("/to-do-list");
  }


})

app.get("/to-do-list-work", (req, res)=>{
    let currentDay = todayDate();
    res.render('list',{kindOfDay : currentDay, newListItem : workListItems, listTitle : "Work",titleName: "Todo List-Work"});
});




app.listen(port, ()=>{
  console.log("Server is listening the action from browser on port : "+ port+ "...");
})

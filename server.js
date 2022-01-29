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

let bmi='';

app.get("/fun/bmi-calculator", (req, res)=>{
  res.render("bmi-calculator",{
    titleName: "BMI Calculator",
    bmiVar: bmi
  });
})

app.post("/fun/bmi-calculator",(req, res)=>{
  let weight = Number(req.body.weight);
  let height = Number(req.body.height);

  let rawBmi =  weight / Math.pow(height,2);
  bmi = Math.round(rawBmi *10) / 10;
   res.redirect("/fun/bmi-calculator");

})

// ******* KANYE REST PAGE

app.get("/apiUsage/kanye-quotes", (req,res)=>{
  const urlKanye = "https://api.kanye.rest";
  https.get(urlKanye,(response)=>{
  response.on("data", (data)=>{
    let kanyeParsed = JSON.parse(data);
    let kanyeQuote =kanyeParsed.quote;
    res.render("kanye-quotes",{
      titleName:"Kanye Quotes",
      kanyeQuoteVar:kanyeQuote
    });
      })
  })

})

// ***** WEATHER APP
let temp = '';
let description ='' ;
let iconUrl = "";
let weatherLocation='';


app.get("/apiUsage/check-weather", (req,res)=>{
  res.render('check-weather',{
    titleName: "Weather Check",
    weatherLocationVar: weatherLocation,
    tempVar: temp,
    iconUrlVar:iconUrl,
    descriptionVar:description
  });
});

app.post("/apiUsage/check-weather", (req, res)=>{

  const weatherApiKey = "8d8d5ba8c9233eac60fa3e4ebad545c5";
  const weatherEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  weatherLocation = req.body.cityName;
  const weatherUrl = weatherEndpoint+"?q="+weatherLocation+"&units=metric&appid="+weatherApiKey;

  https.get(weatherUrl,(response)=>{
      console.log(response);
      if(response.statusCode === 200){
        response.on("data", (data)=>{
         const weatherData = JSON.parse(data)
         temp = weatherData.main.temp
         description = weatherData.weather[0].description
        const icon = weatherData.weather[0].icon
         iconUrl = " http://openweathermap.org/img/wn/"+icon+"@2x.png"
        res.redirect("/apiUsage/check-weather");

      })
      }else{
        res.send("Oops something went wrong. Please try again!");
        // res.sendFile(__dirname+"/failure.html");
      }

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

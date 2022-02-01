const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const _ = require("lodash");
const date = require(__dirname+"/date.js");



// ***** ejs challenges
const homeStartingContent = "Share your story with the world. Stand out with a professionally-designed template that can be customized to fit your brand. Promote your blog and build your online presence with Squarespace's built-in suite of marketing tools.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// const port = 3000;
// heroku port
const port = process.env.PORT || 3000;
const posts=[];

app.get("/",(req, res)=>{
  // res.sendFile(__dirname+"/index.html");
  res.render("home",{
    titleName : "Ashes - Personal Site",
    homeStartingConternVar:homeStartingContent,
    posts:posts
  });

});

app.get("/projects",(req, res)=>{
  res.render("projects",{
    titleName : "Projects",
  });

});

app.get("/about-me",(req, res)=>{
  res.render("about",{
    titleName:"About me",
    aboutContentVar: aboutContent
  })
});

app.get("/contact-me",(req, res)=>{
  res.render("contact",{
    titleName:"Contact me",
    contactContentVar: contactContent
  })
});

app.get("/compose",(req, res)=>{
  res.render("compose",{
    titleName:"Compose Blog"
  })
});


app.post("/compose",(req, res)=>{
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postName", (req, res)=>{
  const requestPostTitle = _.lowerCase(req.params.postName);
  posts.forEach(function(post){
    const storedPost =_.lowerCase(post.title);
    if(storedPost === requestPostTitle){
      res.render("post",{
          titleName:"Blog Post",
          titlePostVar:post.title,
          contentPostVar:post.content
      });
    }
  })


})



app.get("/projects", (req, res)=>{
  res.send("<h1>lists of projects coming soon </h1>");
})



// ******FUN PAGE
let loveRate = "";
app.get("/love-calculator", (req, res)=>{
  res.render('love-calculator', {loveRateVariable: loveRate, titleName : "Love Calculator"});
})



app.post("/love-calculator",(req, res)=>{
  // tapping the vaules of FORM from request and body parser-parsed as text
  // console.log(req.body);
  // console.log(req.body.num1);

  // var num1 = Number(req.body.num1);
  // var num2 = Number(req.body.num2);
  // var result = num1+num2;
  // res.send("Result of the calculation is " + result);

  loveRate = Math.round(Math.random()*101);
  res.redirect("/love-calculator");

})

let bmi='';

app.get("/bmi-calculator", (req, res)=>{
  res.render("bmi-calculator",{
    titleName: "BMI Calculator",
    bmiVar: bmi
  });
})

app.post("/bmi-calculator",(req, res)=>{
  let weight = Number(req.body.weight);
  let height = Number(req.body.height);

  let rawBmi =  weight / Math.pow(height,2);
  bmi = Math.round(rawBmi *10) / 10;
   res.redirect("/bmi-calculator");

})

// ******* KANYE REST PAGE

app.get("/kanye-quotes", (req,res)=>{
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


app.get("/check-weather", (req,res)=>{
  res.render('check-weather',{
    titleName: "Weather Check",
    weatherLocationVar: weatherLocation,
    tempVar: temp,
    iconUrlVar:iconUrl,
    descriptionVar:description
  });
});

app.post("/check-weather", (req, res)=>{

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
        res.redirect("/check-weather");

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

const listItems = [];
const workListItems = [];


app.get("/to-do-list",(req,res)=>{
  let currentDay = date.weekDay();
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
    let currentDay = date.todayDate();
    res.render('list',{kindOfDay : currentDay, newListItem : workListItems, listTitle : "Work",titleName: "Todo List-Work"});
});




app.listen(port, ()=>{
  console.log("Server is listening the action from browser on port : "+ port+ "...");
})

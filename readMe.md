/////////////// WORKING on a real project WITH MONGODB and the MONGOOSE

```CRUD

~~~~~~~~~~~~~~~~~~~ CREATE

-- first we install mongoose in the commandline
npm i mongoose

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');// 1. require mongoose after installing it via npm

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB')// 2. connect mongoose to mongodb and create a new database 'todolistDB'

const itemsSchema = ({// 3. then we create a schema
  name: String
});

const Item = mongoose.model(// 4. we create a model
  'Item',
  itemsSchema)

// 5. we create three(3) default items in our database to add to our todolist
const item1 = new Item ({
  name: 'welcome to your todolist!'
})
const item2 = new Item ({
  name: 'Hit the + button to place a new item.'
})
const item3 = new Item ({
  name: '<-- Hit this to delete an item.'
})

// 6. lets put the three items inside an array
const defaultItems = [item1, item2, item3]

// 7. use the 'insertMany' model keyword to insert all the default items into our items collection
Item.insertMany(defaultItems, (err) =>(err) ? console.log(err) : console.log(' items added sucessfully'))


~~~~~~~~~~~~~~~~~~~~~~~~~~~ READ

app.get("/",(req, res) => {

// use the '.find method' to list out all the items in the defaultItems array,
  Item.find({}, (err, foundItems) =>{

  if (foundItems.length === 0){
   Item.insertMany(defaultItems, (err) =>(err) ? console.log(err) : console.log(' items added sucessfully'))
  // if the array is empty(means the database is als empty), use the 'insertMany' model keyword to insert all the default items into our items collection and log wether successfully logged or not.

  // then we redirect them(post them) on our home route
  res.redirect('/');

  } else {
    //else if its already in the database, just post it to the home page
    res.render("list", {listTitle: 'Today', newListItems: foundItems});
  }
}
  )
});
//the 'foundItems' is a random name and must match the key value pair' newListItems: foundItems'.
// 9r. in our list.ejs, add '.name' to our key 'newListItems' to get only the names of the items in the array.


-- what the app.get is saying is using the '.find method' (remember this lists out all the records in a database), if the database is empty (foundItems.length === 0), let it insert all the defaultItems and redirect it to the home page.
else, let it render it to just the homepage


~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UPDATE (TO KEEP POSTING NEW ITEMS TO THE DATABASE AND OUR WEBPAGE)

// to save entries or records in the items collection in the todolistDB and post it on the home route,
app.post("/", function(req, res){

  const itemName = req.body.newItem;

// we create a new item
  const item = new Item({
    name: itemName
  })

item.save(); // this saves the 'Item' objects into the items collection in the todolistDB
res.redirect('/'); // this posts the new items in the home route.
})


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DELETE

-- in the list.ejs;
-put the checkbox input inside a form with the action attribute whose route will be '/delete'method attribute of 'post'

- add the attribute onChange and put this in its value 'this.form.submit()'.
what this does is when the check box is checked, it will submit the checkbox input to make a post request to our delete route
 <form action="/delete" method="post">
      <div class="item">
        <input type="checkbox" name="checkbox" onchange="this.form.submit()">
        <p><%=  item.name  %></p>
      </div>
    </form>

-- in the app.js, create a post request
app.post('/delete', (req, res) => {
  console.log(req.body.checkbox);
})

--  currently, we delete from other routes, we get taken back to the home route.
so solve this issue, we have to add an input tag in the list,ejs with the type attribute and hidden as the value.

next, we infuse the PULL operator($pull - this finds and removes items from an existing array) into the findOneAndUpdate mongoose method and this is the syntax;

<ModelName>.findOneAndUpdate(

  {conditions}, //what do you want to find and in this case its a list
  {$pull: {field: {_id:value}}},
  function(err, results){}

)



\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

connecting our app to the mongo atlas server

-- we access mongodb.com, try it for free if we are testing or the paid version
-- we connect, create users and clusters, useclusters to connect to the app and copy thecode from the database then run it/






```

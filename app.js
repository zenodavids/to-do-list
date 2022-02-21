const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose') // 1c. require mongoose after installing it via npm
const { redirect } = require('express/lib/response')
const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(
  'mongodb+srv://admin-zeno:&0ngsept$@cluster0.0somk.mongodb.net/todolistDB',
  { useNewUrlParser: true }
)
// 2c. connect mongoose to mongodb and create a new database 'todolistDB'
//
const itemsSchema = {
  // 3c. then we create a schema
  name: String,
}

// 4c. we create a model
const Item = mongoose.model('Item', itemsSchema)

// 5c. we create three(3) default items in our database to add to our todolist
const item1 = new Item({
  name: 'welcome to your todolist!',
})
const item2 = new Item({
  name: 'Hit the + button to place a new item.',
})
const item3 = new Item({
  name: '<-- Hit this to delete an item.',
})

// 6c. lets put the three items inside an array
const defaultItems = [item1, item2, item3]

// 15. we make a new schema for the list
const listSchema = {
  name: String,
  items: [itemsSchema],
}

// 16 new model for list
const List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
  // 8r. use the '.find method' to list out all the items in the defaultItems array
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) =>
        err ? console.log(err) : console.log(' items added sucessfully')
      )
      // 7r. use the 'insertMany' model keyword to insert all the default items into our items collection
      res.redirect('/')
    } else {
      //else if its already in the database, just post it to the home page
      res.render('list', { listTitle: 'Today', newListItems: foundItems })
    }
  })
})
//the 'foundItems' is a random name and must match the key value pair' newListItems: foundItems'.
// 9r. in our list.ejs, add '.name' to our key 'newListItems' to get only the names of the items in the array.

/* what the app.get is saying is using the '.find method' (remember this lists out all the records in a database), if the database is empty (foundItems.length === 0), let it create the three items and redirect it to the home page.
else, let it render it to just the homepage
*/

// 10u. to make whatever we type to save in the items collection in the todolistDB and post it on the home route.

// 14. say we want to create a custom list so that when we want to access it, it opens as a seperate page
app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName) // the capitalize is a method in lodash that capitalizes only the first letter and leaves the rest as lowercase

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      //if no errors
      if (!foundList) {
        //if no foundList
        //create a new list
        // 17. we create a new list
        const list = new List({
          name: customListName, //this gets the name based on the path the user tries to access
          items: defaultItems, // this is the defaultitems array
        })
        list.save() // this saves the list
        res.redirect(`/${customListName}`)
      } else {
        //show an existing list
        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        })
      }
    }
  })
})

app.post('/', function (req, res) {
  const itemName = req.body.newItem
  const listName = req.body.list // this matches the name in the list.ejs button

  // 11u. we create a new item
  const item = new Item({
    name: itemName,
  })

  if (listName === 'Today') {
    item.save() // 12u. this saves the into the items collection in the todolistDB
    res.redirect('/') // this posts the new items in the home route.
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item)
      foundList.save()
      res.redirect(`/${listName}`)
    })
  }
  /**
   * what this app.post is simply saying is that once the user clicks on the submit button, it brings them here to check if its from the home route, it saves the item. but if its from a new list, it finds the name of the list, pushes the new item inside an array with the new list name and saves it. this is after it redirects it to the new list page.
   */
})

// 13d. this is the post route to delete items
app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) =>
      err ? console.log(err) : console.log('removed')
    )
    //this removes the item from our database
    res.redirect('/')
    //this remves the item from our webpage
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect(`/${listName}`)
        }
      }
    )
  }
})

app.get('/about', function (req, res) {
  res.render('about')
})

app.listen(3000, () => console.log('server started on 3000'))

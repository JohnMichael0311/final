const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require('bcrypt');
const app = express();
const { log } = require("console");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", "views");


mongoose.connect('mongodb://localhost:27017/project', {
   

});

const db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to the database"));
db.once('open', () => console.log("Connected to the database"));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

const User = mongoose.model('User', userSchema);

app.use(express.static('public'));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/dishes', (req, res) => {
    res.sendFile(path.join(__dirname, '/dishes.html'));
});


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log("user name ",username);

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // return res.status(400).json({ error: 'Email already exists' });
            return res.send("<h1>Email already exists</h1>");
        }

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        console.log("Record Inserted Successfully");
        res.redirect('./home.html');
    } catch (error) {
        console.error('Error:', error.message);

        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else if (error.code === 11000) {
            res.redirect('login.html');
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log('Entered Password:', password);
  console.log('Request Body:', req.body);
  try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Hashed Password:', user.password);
      console.log('Password Comparison Result:', isPasswordValid);

      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }

      res.cookie("user", user, {sameSite: true});      
      console.log("User signed in successfully");
      res.redirect('./home.html');
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/profile", async (req, res) => {
    try {
        // Retrieve user data from cookies
        console.log("Cookies: ", req.cookies.user);
        const user = req.cookies.user;

        if (!user) {
            return res.status(401).send("Unauthorized");
        }

        // Render the profile page with user details
        res.render("profile", { user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send("Internal server error");
    }
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.use(express.static(__dirname));


const foodItem= [
    {
    id: 1,
    name: 'Achar Do Pizza',
    category : 'Pizza',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/achari do pyaza.jpg',
    quantity: 1
},
{
    id: 2,
    name: 'Almond Delight Pastry',
    category : 'Pastries',
    rating : 4.5,
    price: 109,
    img: 'Images/Dishes/almond delight pastry.webp',
    quantity: 1
},
{
    id: 3,
    name: 'Almond Delight Cake 1kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 968,
    img: 'Images/Dishes/almond delight.jpg',
    quantity: 1
},
{
    id: 4,
    name: 'Angry Bird Cake',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 180,
    img: 'Images/Dishes/angry bird cake.jpg',
    quantity: 1
},
{
    id: 5,
    name: 'Baby Corn Manchurian',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/baby-corn-manchurian.jpg',
    quantity: 1
},
{
    id: 6,
    name: 'Black Forest Pastry',
    category : 'Pastries',
    rating : 4.5,
    price: 73,
    img: 'Images/Dishes/blackforest pastry.jpg',
    quantity: 1
},
{
    id: 7,
    name: 'Black Forest 1kg',
    category : 'Regular Cakes',
    rating : 4.5,
    price: 688,
    img: 'Images/Dishes/blackforest.jpg',
    quantity: 1
},
// to do
{
    id: 8,
    name: 'Memoni Biryani',
    category : 'biryani',
    rating : 4.5,
    price: 20,
    img: 'Images/Dishes/blue berry pastry.jpg',
    quantity: 1
},
{
    id: 9,
    name: 'Boneless Biryani Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/boneless biryani.jpg',
    quantity: 1
},
{
    id: 10,
    name: 'Butter-Chicken',
    category : 'Currys',
    rating : 4.5,
    price: 250,
    img: 'Images/Dishes/butter-chicken.jpg',
    quantity: 1
},
{
    id: 11,
    name: 'Butter-Naan',
    category : 'Rotis',
    rating : 4.5,
    price: 40,
    img: 'Images/Dishes/butter-naan.jpg',
    quantity: 1
},
{
    id: 12,
    name: 'Butter-Roti',
    category : 'Rotis',
    rating : 4.5,
    price: 20,
    img: 'Images/Dishes/butter-roti.jpg',
    quantity: 1
},
{
    id: 13,
    name: 'Butter Scotch Cake 1kg',
    category : 'Regular Cakes',
    rating : 4.5,
    price: 660,
    img: 'Images/Dishes/butter-scotch.jpg',
    quantity: 1
},
{
    id: 14,
    name: 'ButterScotch Pastry',
    category : 'pastries',
    rating : 4.5,
    price: 73 ,
    img: 'Images/Dishes/butterscotch pastry.jpg',
    quantity: 1
},
{
    id: 15,
    name: 'Chapathi',
    category : 'Rotis',
    rating : 4.5,
    price: 20,
    img: 'Images/Dishes/chapathi.jpg',
    quantity: 1
},
{
    id: 16,
    name: 'Cheese And Tomato',
    category : 'pizza',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/cheese n tomato.png',
    quantity: 1

},
{
    id: 17,
    name: 'Cheese And Corn Pizza',
    category : 'pizza',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/cheese-n-corn.png',
    quantity: 1
},
{
    id: 18,
    name: 'Chicken Burger',
    category : 'Burger',
    rating : 4.5,
    price: 127,
    img: 'Images/Dishes/chicken burger.jpg',
    quantity: 1

},
{
    id: 19,
    name: 'Chicken Spring Roll',
    category : 'Burger',
    rating : 4.5,
    price: 94,
    img: 'Images/Dishes/chicken spring roll.jpg',
    quantity: 1

},
{
    id: 20,
    name: 'Chicken Burger',
    category : 'Burger',
    rating : 4.5,
    price: 127,
    img: 'Images/Dishes/chicken tika burger.jpg',
    quantity: 1
},
{
    id: 21,
    name: 'Chicken-65',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/chicken-65.jpg',
    quantity: 1
},
{
    id: 22,
    name: 'Chicken Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 120,
    img: 'Images/Dishes/Chicken-Biryani.jpg',
    quantity: 1
},
{
    id: 23,
    name: 'Chicken Fiesta',
    category : 'Pizza',
    rating : 4.5,
    price: 220,
    img: 'Images/Dishes/chicken-fiesta.jpg',
    quantity: 1
},
{
    id: 24,
    name: 'Chicken Fry',
    category : 'Starters',
    rating : 4.5,
    price: 359,
    img: 'Images/Dishes/chicken-fry.jpg',
    quantity: 1
},
{
    id: 25,
    name: 'Chicken Golden Delight',
    category : 'Pizza',
    rating : 4.5,
    price: 449,
    img: 'Images/Dishes/chicken-golden-delight.png',
    quantity: 1
},
{
    id: 26,
    name: 'Chicken Golden Delight',
    category : 'Pizza',
    rating : 4.5,
    price: 499,
    img: 'Images/Dishes/chicken-golden-delight.png',
    quantity: 1
},
{
    id: 27,
    name: 'Chicken Hot Dog',
    category : 'Sandwich',
    rating : 4.5,
    price: 109,
    img: 'Images/Dishes/chicken-hot-dog.webp',
    quantity: 1
},
{
    id: 28,
    name: 'Chicken Lollipop',
    category : 'Starters',
    rating : 4.5,
    price: 220,
    img: 'Images/Dishes/chicken-lollipop.jpg',
    quantity: 1
},
{
    id: 29,
    name: 'Chicken Manchurian Full',
    category : 'Starters',
    rating : 4.5,
    price: 350,
    img: 'Images/Dishes/chicken-manchuria.jpg',
    quantity: 1
},
{
    id: 30,
    name: 'Chicken Sausage',
    category : 'Pizza',
    rating : 4.5,
    price: 379,
    img: 'Images/Dishes/chicken-sausage.png',
    quantity: 1
},
{
    id: 31,
    name: 'Chicken Soup',
    category : 'Soup',
    rating : 4.5,
    price: 100,
    img: 'Images/Dishes/chicken-soup.jpg',
    quantity: 1
},
{
    id: 32,
    name: 'Chicken Sweet Corn Soup',
    category : 'Soup',
    rating : 4.5,
    price: 150,
    img: 'Images/Dishes/chicken-sweet-corn soup.jpg',
    quantity: 1
},
{
    id: 33,
    name: 'Chicken Tikka Masala',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/chicken-tikka-masala.jpg',
    quantity: 1
},
{
    id: 34,
    name: 'Chicken Wings',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/chicken-wings.jpg',
    quantity: 1
},
{
    id: 35,
    name: 'Chilli Prawns',
    category : 'Starters',
    rating : 4.5,
    price: 299,
    img: 'Images/Dishes/chilli-prawns.jpg',
    quantity: 1
},
{
    id: 36,
    name: 'Chicken Hot And Sour Soup',
    category : 'Soup',
    rating : 4.5,
    price: 110,
    img: 'Images/Dishes/chinese-hot-and-sour-soup.jpg',
    quantity: 1
},
{
    id: 37,
    name: 'Cream Bread',
    category : 'Bread',
    rating : 4.5,
    price: 30,
    img: 'Images/Dishes/creambread.jpg',
    quantity: 1
},
{
    id: 38,
    name: 'Dil Kush',
    category : 'Bread',
    rating : 4.5,
    price: 28,
    img: 'Images/Dishes/dilkush.jpg',
    quantity: 1
},
{
    id: 39,
    name: 'Donut',
    category : 'Pastrys',
    rating : 4.5,
    price: 109,
    img: 'Images/Dishes/donut.jpg',
    quantity: 1
},
{
    id: 40,
    name: 'Plain Dosa',
    category : 'Break Fast',
    rating : 4.5,
    price: 40,
    img: 'Images/Dishes/dosa.jpg',
    quantity: 1
},
{
    id: 41,
    name: 'Double Ka Meetha',
    category : 'Bread',
    rating : 4.5,
    price: 60,
    img: 'Images/Dishes/double ka meetha.jpg',
    quantity: 1
},
{
    id: 42,
    name: 'Double Cheese Marghherita',
    category : 'Pizza',
    rating : 4.5,
    price: 339,
    img: 'Images/Dishes/double-chesse-margherita.png',
    quantity: 1
},
{
    id: 43,
    name: 'Dry Fruit Pastry',
    category : 'Pastrys',
    rating : 4.5,
    price: 109,
    img: 'Images/Dishes/dry fruit pastry.jpg',
    quantity: 1
},
{
    id: 44,
    name: 'Egg Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 90,
    img: 'Images/Dishes/egg biryani.jpg',
    quantity: 1
},
{
    id: 45,
    name: 'Egg Less Blackforest 1kg',
    category : 'Regular Cakes',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/egg-less blackforest.JPG',
    quantity: 1
},
{
    id: 46,
    name: 'Egg-Less Buterscotch 1kg',
    category : 'Regular Cakes',
    rating : 4.5,
    price: 720,
    img: 'Images/Dishes/eggless-buterscotch.jpg',
    quantity: 1,
},
{
    id: 47,
    name: 'Egg-Less Pineapple Cake 1kg',
    category : 'Regular Cakes',
    rating : 4.5,
    price: 704,
    img: 'Images/Dishes/eggless-pineapple.jpg',
    quantity: 1
},
{
    id: 48,
    name: 'Farm House',
    category : 'Pizza',
    rating : 4.5,
    price: 399,
    img: 'Images/Dishes/farmhouse.jpg',
    quantity: 1
},
{
    id: 49,
    name: 'Fish Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/fishbiryani.jpg',
    quantity: 1
},
{
    id: 50,
    name: 'Fresh Veggie Pizza',
    category : 'Pizza',
    rating : 4.5,
    price: 339,
    img: 'Images/Dishes/fresh-veggie.jpg',
    quantity: 1
},
{
    id: 51,
    name: 'Fruit Bread',
    category : 'Bread',
    rating : 4.5,
    price: 40,
    img: 'Images/Dishes/fruit bread.jpg',
    quantity: 1
},
{
    id: 52,
    name: 'Garlic Naan',
    category : 'Rotis',
    rating : 4.5,
    price: 35,
    img: 'Images/Dishes/garlicnaan.jpg',
    quantity: 1
},
{
    id: 53,
    name: 'Gongura Chicken',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/Gongura chicken.jpg',
    quantity: 1
},
{
    id: 54,
    name: 'Gongura Mutton',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/gongura mutton.jpg',
    quantity: 1
},
{
    id: 55,
    name: 'Gulab Jamun Cake 1pc',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 110,
    img: 'Images/Dishes/gulab-jamun-cake.jpg',
    quantity: 1
},
{
    id: 56,
    name: 'Gulab Jamun Cake 1kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 1108,
    img: 'Images/Dishes/gulab-jamun-cake1.jpg',
    quantity: 1
},
{
    id: 57,
    name: 'Idli',
    category : 'Break Fast',
    rating : 4.5,
    price: 40,
    img: 'Images/Dishes/idli-dosa.jpg',
    quantity: 1
},
{
    id: 58,
    name: 'Indi Chicken Tikka',
    category : 'Pizza',
    rating : 4.5,
    price: 610,
    img: 'Images/Dishes/indi-chicken-tikkapizza.jpg',
    quantity: 1
},
{
    id: 59,
    name: 'Indi Tandoori Panner',
    category : 'Pizza',
    rating : 4.5,
    price: 459,
    img: 'Images/Dishes/IndianTandooriPaneer.jpg',
    quantity: 1
},
{
    id: 60,
    name: 'Kaju Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 410,
    img: 'Images/Dishes/kaju biryani.jpg',
    quantity: 1
},
{
    id: 61,
    name: 'Kaju Masala',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/kaju curry.jpg',
    quantity: 1
},
{
    id: 62,
    name: 'Mutton Keema Biryani Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/keema biryani.jpg',
    quantity: 1
},
{
    id: 63,
    name: 'Keema Do Pyaza',
    category : 'Pizza',
    rating : 4.5,
    price: 438,
    img: 'Images\Dishes\keema-do-pizza.jpg',
    quantity: 1
},
{
    id: 64,
    name: 'Lyche Pastry',
    category : 'Pizza',
    rating : 4.5,
    price: 109,
    img: 'Images/Dishes/lyche pastry.png',
    quantity: 1
},
{
    id: 65,
    name: 'Margherita',
    category : 'Pizza',
    rating : 4.5,
    price: 199,
    img: 'Images/Dishes/margherita.jpg',
    quantity: 1
},
{
    id: 66,
    name: 'Masala Dosa',
    category : 'Break Fast',
    rating : 4.5,
    price: 50,
    img: 'Images/Dishes/masala-dosa.jpg',
    quantity: 1
},
{
    id: 67,
    name: 'Mexican Greenwave',
    category : 'Pizza',
    rating : 4.5,
    price: 399,
    img: 'Images/Dishes/mexican-greenwave.jpg',
    quantity: 1
},
{
    id: 68,
    name: 'Mini Chicken Burger',
    category : 'Burger',
    rating : 4.5,
    price: 99,
    img: 'Images/Dishes/mini-chicken-burger.jpg',
    quantity: 1
},
{
    id: 69,
    name: 'Mix Dry Fruit Cake 1kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 800,
    img: 'Images/Dishes/mix-dry-fruit-cake.jpg',
    quantity: 1
},
{
    id: 70,
    name: 'Moroccan Spice Pasta Pizza - Non Veg',
    category : 'Pizza',
    rating : 4.5,
    price: 440,
    img: 'Images/Dishes/Moroccan Spice Pasta Pizza - Non Veg.jpg',
    quantity: 1
},
{
    id: 71,
    name: 'Mushroom Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 110,
    img: 'Images/Dishes/mushroom biryani.jpg',
    quantity: 1
},
{
    id: 72,
    name: 'Mushroom Masala',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/mushroom masala.JPG',
    quantity: 1
},
{
    id: 73,
    name: 'Mutton Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/mutton biryani.jpeg',
    quantity: 1
},
{
    id: 74,
    name: 'Mutton Kheema',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/mutton-keema.jpg',
    quantity: 1
},
{
    id: 75,
    name: 'Mutton Masala',
    category : 'Currys',
    rating : 4.5,
    price: 300,
    img: 'Images/Dishes/mutton-masala.jpg',
    quantity: 1
},
{
    id: 76,
    name: 'Mysore Bonda',
    category : 'Break Fast',
    rating : 4.5,
    price: 30,
    img: 'Images/Dishes/mysorebonda.jpg',
    quantity: 1
},
{
    id: 77,
    name: 'Non Veg Supreme',
    category : 'Pizza',
    rating : 4.5,
    price: 619,
    img: 'Images/Dishes/Non-Veg_Supreme.jpg',
    quantity: 1
},
{
    id: 78,
    name: 'Onion Dosa',
    category : 'Break Fast',
    rating : 4.5,
    price: 60,
    img: 'Images/Dishes/onion dosa.jpg',
    quantity: 1
},
{
    id: 79,
    name: 'Palak Paneer',
    category : 'Currys',
    rating : 4.5,
    price: 240,
    img: 'Images/Dishes/palak paneer.jpg',
    quantity: 1
},
{
    id: 80,
    name: 'Paneer Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 110,
    img: 'Images/Dishes/paneer biryani.jpg',
    quantity: 1
},
{
    id: 81,
    name: 'Paneer Makhani',
    category : 'Pizza',
    rating : 4.5,
    price: 459,
    img: 'Images/Dishes/Paneer_Makhni.jpg',
    quantity: 1
},
{
    id: 82,
    name: 'Paneer Hot Dog',
    category : 'Burger',
    rating : 4.5,
    price: 88,
    img: 'Images/Dishes/paneer-hot-dog.jpg',
    quantity: 1
},
{
    id: 83,
    name: 'Panner Tikka',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/panner-tikka.jpg',
    quantity: 1
},
{
    id: 84,
    name: 'Panner Butter Masala',
    category : 'Currys',
    rating : 4.5,
    price: 220,
    img: 'Images/Dishes/panner-butter-masala.jpg',
    quantity: 1
},
{
    id: 85,
    name: 'Panner Butter Masala',
    category : 'Currys',
    rating : 4.5,
    price: 220,
    img: 'Images/Dishes/panner-butter-masala.jpg',
    quantity: 1
},
{
    id: 86,
    name: 'Pav Baji',
    category : 'Bread',
    rating : 4.5,
    price: 129,
    img: 'Images/Dishes/pavbaji.jpg',
    quantity: 1
},
{
    id: 87,
    name: 'Pepper Barbecue & Onion',
    category : 'Pizza',
    rating : 4.5,
    price: 439,
    img: 'Images/Dishes/Pepper_Barbeque_&_Onion.jpg',
    quantity: 1
},
{
    id: 88,
    name: 'Pepper Barbeque Chicken',
    category : 'Pizza',
    rating : 4.5,
    price: 439,
    img: 'Images/Dishes/PepperBarbequeChicken.jpg',
    quantity: 1
},
{
    id: 89,
    name: 'Peppy Paneer',
    category : 'Pizza',
    rating : 4.5,
    price: 399,
    img: 'Images/Dishes/peppy-paneer.jpg',
    quantity: 1
},
{
    id: 90,
    name: 'ButterScotch Pastry',
    category : 'Pastrys',
    rating : 4.5,
    price: 73,
    img: 'Images/Dishes/pineapple pastry.jpg',
    quantity: 1
},
{
    id: 91,
    name: 'Pineapple Cake 1kg',
    category : 'Pastrys',
    rating : 4.5,
    price: 638,
    img: 'Images/Dishes/pineapple.jpg',
    quantity: 1
},
{
    id: 92,
    name: 'Plain-Naan',
    category : 'Rotis',
    rating : 4.5,
    price: 25,
    img: 'Images/Dishes/plain-naan.jpg',
    quantity: 1
},
{
    id: 93,
    name: 'Prawns Biryani',
    category : 'Pastrys',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/prawns biryani.jpg',
    quantity: 1
},
{
    id: 94,
    name: 'Puri',
    category : 'Break Fast',
    rating : 4.5,
    price: 30,
    img: 'Images/Dishes/puri.jpg',
    quantity: 1
},
{
    id: 95,
    name: 'Rayalaseema Ragi Sangati',
    category : 'Biryanis',
    rating : 4.5,
    price: 320,
    img: 'Images/Dishes/ragi-sangati.jpeg',
    quantity: 1
},
{
    id: 96,
    name: 'Rasmalai Cake 1kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 1204,
    img: 'Images/Dishes/rasmalai cake.jpg',
    quantity: 1
},
{
    id: 97,
    name: 'Rasmalai Cake 1kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 1204,
    img: 'Images/Dishes/rasmalai cake.jpg',
    quantity: 1
},
{
    id: 98,
    name: 'Red Velvet Cake 1/2kg',
    category : 'Premium Cakes',
    rating : 4.5,
    price: 540,
    img: 'Images/Dishes/red-velvet cake.jpg',
    quantity: 1
},
{
    id: 99,
    name: 'Red Velvet Pastry',
    category : 'Pastrys',
    rating : 4.5,
    price: 127,
    img: 'Images/Dishes/red-velvet pastry.jpg',
    quantity: 1
},
{
    id: 100,
    name: 'Roomali Roti',
    category : 'Rotis',
    rating : 4.5,
    price: 15,
    img: 'Images/Dishes/roomali-roti.jpg',
    quantity: 1
},
{
    id: 101,
    name: 'Sandwich Bread',
    category : 'Sandwich',
    rating : 4.5,
    price: 50,
    img: 'Images/Dishes/sandwich bread.jpg',
    quantity: 1
},
{
    id: 102,
    name: 'Veg-Sweet Corn Soup',
    category : 'Soup',
    rating : 4.5,
    price: 90,
    img: 'Images/Dishes/sweet corn soup.jpg',
    quantity: 1
},
{
    id: 103,
    name: 'Tandoori Chicken',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/tandoori-chicken.jpg',
    quantity: 1
},
{
    id: 104,
    name: 'Tandoori Roti',
    category : 'Rotis',
    rating : 4.5,
    price: 35,
    img: 'Images/Dishes/tandoori-roti.jpg',
    quantity: 1
},
{
    id: 105,
    name: 'Toast',
    category : 'Bread',
    rating : 4.5,
    price: 99,
    img: 'Images/Dishes/toast.jpg',
    quantity: 1
},
{
    id: 106,
    name: 'Tomato Soup',
    category : 'Soup',
    rating : 4.5,
    price: 75,
    img: 'Images/Dishes/tomato-soup.gif',
    quantity: 1
},
{
    id: 107,
    name: 'Ulvacharu Chicken Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/ulvacharu biryani.jpg',
    quantity: 1
},
{
    id: 108,
    name: 'Uttapam',
    category : 'Break Fast',
    rating : 4.5,
    price: 45,
    img: 'Images/Dishes/uttapam.jpg',
    quantity: 1
},
{
    id: 109,
    name: 'Vada',
    category : 'Break Fast',
    rating : 4.5,
    price: 25,
    img: 'Images\Dishes\vada.jpg',
    quantity: 1
},
{
    id: 110,
    name: 'Veg Corn Burger',
    category : 'Burger',
    rating : 4.5,
    price: 116,
    img: 'Images/Dishes/veg corn burger.jpg',
    quantity: 1
},
{
    id: 111,
    name: 'Veg Burger',
    category : 'Burger',
    rating : 4.5,
    price: 85,
    img: 'Images/Dishes/veg-burger.jpg',
    quantity: 1
},
{
    id: 112,
    name: 'Veg Burger',
    category : 'Burger',
    rating : 4.5,
    price: 85,
    img: 'Images/Dishes/veg-burger.jpg',
    quantity: 1
},
{
    id: 113,
    name: 'Veg Manchow Soup',
    category : 'Soup',
    rating : 4.5,
    price: 80,
    img: 'Images/Dishes/veg-manchow soup.jpg',
    quantity: 1
},
{
    id: 114,
    name: 'Veg Manchurian',
    category : 'Starters',
    rating : 4.5,
    price: 210,
    img: 'Images/Dishes/veg-manchuria.jpg',
    quantity: 1
},
{
    id: 115,
    name: 'Veggie Paradise',
    category : 'Pizza',
    rating : 4.5,
    price: 399,
    img: 'Images/Dishes/veggie-paradise.jpg',
    quantity: 1
},
{
    id: 116,
    name: 'Veg Hot Dog',
    category : 'Burger',
    rating : 4.5,
    price: 95,
    img: 'Images/Dishes/veghotdog.jpg',
    quantity: 1
},
{
    id: 117,
    name: 'Veg Biryani',
    category : 'Biryanis',
    rating : 4.5,
    price: 140,
    img: 'Images/Dishes/vegpulao.jpg',
    quantity: 1
},
]

// export {foodItem};


const product = [
    {
        id: 0,
        image: 'image/gg-1.jpg',
        title: 'Z Flip Foldable Mobile',
        price: 120,
    },
    {
        id: 1,
        image: 'image/hh-2.jpg',
        title: 'Air Pods Pro',
        price: 60,
    },
    {
        id: 2,
        image: 'image/ee-3.jpg',
        title: '250D DSLR Camera',
        price: 230,
    },
    {
        id: 3,
        image: 'image/aa-1.jpg',
        title: 'Head Phones',
        price: 100,
    }
];



const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
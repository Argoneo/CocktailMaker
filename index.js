// Import dependencies
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

// Initialize app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine (assumed EJS views are used)
app.set('view engine', 'ejs');

/* -----------------------------------
   ROUTES
----------------------------------- */

// Landing page - renders default index
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Get a random cocktail
app.post("/random", async (req, res) => {
    try {
        const response = await axios.post("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const data = response.data;

        // Extract ingredients from the cocktail object
        const arrIngredients = [];
        for (let i = 1; i <= 15; i++) {
            if (data.drinks[0][`strIngredient${i}`] === null) {
                break;
            } else {
                arrIngredients.push(data.drinks[0][`strIngredient${i}`]);
            }
        }

        // Log cocktail data (for debugging)
        console.log(data.drinks[0].strDrink);
        console.log(arrIngredients);
        console.log(data.drinks[0].strInstructions);

        // Render cocktail info to the user
        res.render("index.ejs", {
            name: data.drinks[0].strDrink,
            image: data.drinks[0].strDrinkThumb,
            arrIngredients: arrIngredients,
            instructions: data.drinks[0].strInstructions,
            error: null
        });

    } catch (error) {
        console.error(error);
        res.render("index.ejs", {
            name: null,
            image: null,
            instructions: null,
            arrIngredients: null,
            error: "Error while fetching the cocktail."
        });
    }
});

// Search cocktail by name
app.post("/search", async (req, res) => {
    try {
        const searchItem = req.body.searchInput;
        console.log(searchItem);

        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchItem}`);
        const data = response.data;

        // If cocktail exists
        if (data.drinks && data.drinks.length > 0) {
            const arrIngredients = [];
            for (let i = 1; i <= 15; i++) {
                if (data.drinks[0][`strIngredient${i}`] === null) {
                    break;
                } else {
                    arrIngredients.push(data.drinks[0][`strIngredient${i}`]);
                }
            }

            // Log cocktail data (for debugging)
            console.log(data.drinks[0].strDrink);
            console.log(arrIngredients);
            console.log(data.drinks[0].strInstructions);

            // Render the found cocktail
            res.render("index.ejs", {
                name: data.drinks[0].strDrink,
                image: data.drinks[0].strDrinkThumb,
                arrIngredients: arrIngredients,
                instructions: data.drinks[0].strInstructions,
                error: null
            });
        } else {
            // No cocktail found with that name
            res.render("index.ejs", {
                name: null,
                image: null,
                instructions: null,
                arrIngredients: null,
                error: "No cocktail found with this name."
            });
        }
    } catch (error) {
        console.error(error);
        res.render("index.ejs", {
            name: null,
            image: null,
            instructions: null,
            arrIngredients: null,
            error: "Error while fetching the cocktail."
        });
    }
});

/* -----------------------------------
   START SERVER
----------------------------------- */

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
var addIngredientNameInput = document.getElementById("add-ingredient-name-input");
var deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
var addIngredientButton = document.getElementById("add-ingredient-submit-button");
var deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
var ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * TODO: Create an array to keep track of ingredients
 */
var ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    let ingredient = addIngredientNameInput.value.trim();
    if(!ingredient){
        alert("Must fill in ingredient");
        return;
    }
    const requestBody = {ingredient};
    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        body: JSON.stringify(requestBody)
    }

    try{
        let response = await fetch(`${BASE_URL}/ingredients`);

        if(response.ok){
            addIngredientNameInput.value = "";
            await getIngredients();
            refreshIngredientList();
        }
        else{
            throw new Error("Add Ingredient Error!");
        }
    }
    catch(error){
            console.log(error);
            alert(error.message);
        }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    try{
        const response = await fetch(`${BASE_URL}/ingredients`);

        if(response.ok){
            ingredients = await response.json;
            refreshIngredientList();
        }
    }
    catch(error){
        console.log(error);
        alert(error.message);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    let del = deleteIngredientNameInput.value.trim();

    if(!del){
        alert("Recipe Name Required!");
        return;
    }

    let delSearch = ingredients.find(i => i.name === del);

    if(!delSearch){
        alert("Ingredient not found!");
        return;
    }
    const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };
        
        try{
            const response = await fetch(`${BASE_URL}/ingredients/${delSearch.id}`);

            if(response.ok){
                deleteIngredientNameInput.value = "";
                await getIngredients();
            }
            else{
                throw new Error("Delete Ingredient Error!");
            }
        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML = "";
    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.createElement("p");
        p.textContent = `${ingredient.name}`;
        recipeList.appendChild(li);
    });
}

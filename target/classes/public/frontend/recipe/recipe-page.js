/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */

const logoutButton = document.getElementById("logout-button");

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const recipeList = document.getElementById("recipe-list");

const addRecipeInput = document.getElementById("add-recipe-name-input");
const addRecipeInstructions = document.getElementById("add-recipe-instructions-input");
const addRecipeButton = document.getElementById("add-recipe-submit-input");

const updateRecipeInput = document.getElementById("update-recipe-name-input");
const updateRecipeInstructions = document.getElementById("update-recipe-instructions-input");
const updateRecipeButton = document.getElementById("update-recipe-submit-input");

const deleteRecipeInput = document.getElementById("delete-recipe-name-input");
const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
if (sessionStorage.getItem("auth-token") != null){
    logoutButton.hidden = false;
}
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
function displayAdminLink(){

    if(sessionStorage.getItem("is-admin") === "true")
    {
        const adminLink = document.getElementById("admin-link");
        adminLink.hidden = false;
    }
}

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
addRecipeButton.addEventListener('click', addRecipe);
updateRecipeButton.addEventListener('click', updateRecipe);
deleteRecipeButton.addEventListener('click', deleteRecipe);
searchButton.addEventListener('click', searchRecipes);
logoutButton.addEventListener('click', processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();
    displayAdminLink();
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        let search = searchInput.value.trim();
        try{
            let response = await fetch(`${BASE_URL}/fetch/?name=${encodeURIComponent(search)}`);
            if(response.ok){
                recipes = await response.json();
                refreshRecipeList();
            }
            else{
                throw new Error("Search Error!");
            }
        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        let add = addRecipeInput.value.trim();
        let addInst = addRecipeInstructions.value.trim();

        if(!add || !addInst){
            alert("Recipe Name and Instructions must be filled!");
            return;
        }

        const requestBody = {add, addInst};

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try {
            let request = await fetch(`${BASE_URL}/recipes`, requestOptions);

            if(request.ok){
                addRecipeInput.value = "";
                addRecipeInstructions.value = "";
                await getRecipes();
            }
            else{
                throw new Error("Add Error!");
            }

        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        let update = updateRecipeInput.value.trim();
        let updateInst = updateRecipeInstructions.value.trim();

        if(!update || !updateInst){
            alert("Recipe Input and Instructions must be filled!");
            return;
        }

        const findRecipe = recipes.find(r => r.name === update);
        if(!findRecipe){
            alert("Recipe not found!");
            return;
        }

        const requestBody = {updateInst};
        
        const requestOptions = {
            method: "Put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };

        try {
            let request = await fetch(`${BASE_URL}/recipes/${findRecipe.id}`, requestOptions);

            if(request.ok){
                updateRecipeInput.value = "";
                updateRecipeInstructions.value = "";
                await getRecipes();
            }
            else{
                throw new Error("Update Error!");
            }

        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        let del = deleteRecipeInput.value.trim();

        if(!del){
            alert("Recipe Name Required!");
            return;
        }

        let delSearch = recipes.find(r => r.name === del);

        if(!delSearch){
            alert("Recipe not found!");
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
            const response = await fetch(`${BASE_URL}/recipes/${delSearch.id}`, requestOptions);

            if(response.ok){
                deleteRecipeInput.value = "";
                await getRecipes();
            }
            else{
                throw new Error("Delete Error!");
            }
        }
        catch(error){
            console.log(error);
            alert(error.message);
        }

    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        try{
            const response = await fetch(`${BASE_URL}/recipes`);
            if(response.ok){
                recipes = await response.json();
                refreshRecipeList();
            }
            else{
                throw new Error("Get Recipes Error!");
            }


        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        recipeList.innerHTML = "";
        for(recipe of recipes){
            const li = document.createElement("li");
            li.textContent = `${recipe.name}: ${recipe.instructions}`;
            recipeList.appendChild(li);
        };
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        try{
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);

            if(response.ok){
                sessionStorage.clear();
                window.location.href = `login-page.html`
            }
            else{
                throw new Error("Logout Error!");
            }
        }
        catch(error){
            console.log(error);
            alert(error.message);
        }
    }

});

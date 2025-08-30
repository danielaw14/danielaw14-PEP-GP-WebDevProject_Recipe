/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
var usernameInput = document.getElementById("login-input");
var passwordInput = document.getElementById("password-input");
var loginButton = document.getElementById("login-button");
var logoutButton = document.getElementById("logout-button");
/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
loginButton.addEventListener('click', processLogin);

/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    // TODO: Retrieve username and password from input fields
    // - Trim input and validate that neither is empty
    let username = usernameInput.value.trim();
    let password = passwordInput.value.trim();


    // TODO: Create a requestBody object with username and password
    const requestBody = {username, password}
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
    };

    try {
        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions
        const request = await fetch(`${BASE_URL}/login`, requestOptions);

        if(request.status == 200){
            let text = await request.text();
            const [token, isAdmin] = String(text).split(" ");
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("is-admin", isAdmin);
        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
        // - Store both in sessionStorage using sessionStorage.setItem()

        // TODO: Optionally show the logout button if applicable
        
        // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page
            setTimeout(500);
            window.location.href = 'recipe-page.html';
        }
        else if(request.status == 401){
            throw new Error("Incorrect login!");
        }
        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"
        else{
            throw new Error("Unknown issue!");
        }
        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"

    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.log(error);
        alert(error.message);
    }
}


/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");
/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.addEventListener('click', processRegistration);

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
        let username = usernameInput.value;
        let email = emailInput.value;
        let password = passwordInput.value;
        let repeatPassword = repeatPasswordInput.value;
        if(repeatPassword !== password){
            passwordInput.value = '';
            repeatPasswordInput.value = '';
            alert('Passwords Must Match!');
            return;
        }
        //Create a request body with username, email, and password
        const registerBody = {username, email, password};

    //Define requestOptions using method POST and proper headers
    const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody)
        };
    try{
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if(response.ok){
            /* - If status is 201:
            *- Redirect user to login page*/
            window.location.href = 'login-page.html';
        }
        else if(response.status == 409){
            throw new Error('User/Email Already Exists!');
        }
        else{
            throw new Error('Uknown Error!');
        }
        /* Fetch Logic:
        * - Send POST request to `${BASE_URL}/register`
        * - If status is 201:
        *      - Redirect user to login page
        * - If status is 409:
        *      - Alert that user/email already exists
        * - Otherwise:
        *      - Alert generic registration error
        */}
    catch(error){
        console.log(error);
        alert(error.message);
    }
}

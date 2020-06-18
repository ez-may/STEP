/**
 * TODO:(matwsuaz) : Update with logic to allow the implementation of a 
 * rotating image gallery with buttons, changing captions depending on what
 * image is being displayed, and a navigation bar which allows the user to
 * navigate to different scroll positions.
 *
 * TODO(matwsuaz) : Include a page number view for the comment section. Because
 * the limit to viewing is to either see a set amount at a time, or all of them,
 * users need a way to navigate through comments. I.e. if there are 50 comments
 * and the user decides to view only 5 at a time, they should arrows to navigate
 * back and forth from the first 5, to the next 5, and so on. 
 **/

/**
 * Manages the logic for the initial load of the main page by calling functions
 * and managing logic based on servlet responses.
 */
async function loadPage() { 
    let responseData = await getServletData();

    if (responseData.action === "redirect") {
        renderLoginStatus({
            name: "Hello Anonymous User!",
            status: "You are not logged in.",
            action: "Please login here.",
            link: responseData.content,
            });
        
        // Remove most of the comment section so user's can't interact until
        // they log in.
        let commentDiv = document.getElementById("comments");
        disableComments(commentDiv, responseData.content);
        return;
    } else {
        // The content sent from the servlet
        let jsonContent = responseData.content;
        /* The first element of the parsed list is the user's information.
         * User data was changed to a JSON string before being added to an
         * arraylist of strings, then the arraylist was also converted to
         * a JSON string. So user data was converted twice, and must be parsed
         * twice.
         */
        let userData = JSON.parse(JSON.parse(jsonContent)[0]);

        renderLoginStatus({
            name: "Hello " + userData.name + "!",
            status: "Thank you for logging in.",
            action: "You can logout here.",
            link: userData.logoutUrl,
            });
        renderComments(jsonContent);
        return;
    }
}

/******************************************************************************
 ******************************************************************************
 **********************AUTHENTICATION FEATURE RELATED CODE*********************
 ******************************************************************************
 *****************************************************************************/

/**
 * Makes the request to the data servlet, and processes the response so it can
 * be returned and used by other functions. Returns an object with the response
 * data and a string value specifying what to do with the response data, "read"
 * or "redirect."
 */
async function getServletData() {
    /**
     * Makes the initial request. Determines the content type being sent and
     * trims additional white space.
     */
    let response = await fetch("/data?size=5"); // Default to show 5 comments
    let responseType = response.headers.get("Content-Type");
    let responseContent = await response.text();
    responseContent = responseContent.trim();
    /*
     * If the content type is 'text' then it means the servlet replied with a
     * login link, otherwise it replied with application:json due to the
     * current implementation of the data servlet. An object is returned so
     * another function can use the "action" key to control logic in an "if"
     * statement and then acces the "content" key to complete the step.
     */
     if (responseType === "text") {
        return {content: responseContent, action: "redirect"};
    } else {
        return {content: responseContent, action: "read"};
    }
}

/**
 * Takes in a status object with data used to update the html status bar.
 * The status object needs to have the following keys:
 * name, status, action, link.
 */
async function renderLoginStatus(statusObj) {
    // The div to hold all the HTML elements created here
    let statusDiv = document.createElement("div");

    // A welcome message + user's name, or 'Anon' if they aren't logged in
    let name = document.createElement("p");
    
    // A message which is filled if the user isn't logged in
    let status = document.createElement("p");
    
    // A link created for the user to either sign in or out
    let action = document.createElement("a");    
    action.href = statusObj.link; 
    
    // The HTML div the new elements will be added to
    let loginStatusBar = document.getElementById("login-status-bar");
    
    // The text nodes needed to fill the html elements
    let userName = document.createTextNode(statusObj.name);    
    let userStatus = document.createTextNode(statusObj.status);
    let userAction = document.createTextNode(statusObj.action);

    // Adds the text node children to their respective parents
    name.appendChild(userName);
    status.appendChild(userStatus);
    action.appendChild(userAction);

    // Adds the html elements to the div
    statusDiv.appendChild(name);
    statusDiv.appendChild(status);
    statusDiv.appendChild(action);

    // Adds the new div element to the HTML
    loginStatusBar.appendChild(statusDiv);
}


/******************************************************************************
 ******************************************************************************
 *************************COMMENT FEATURE RELATED CODE*************************
 ******************************************************************************
 *****************************************************************************/

/**
 * Makes a request to the servelet for the comments it has stored, and then
 * makes a call to have it rendered.
 **/
async function loadComments(requestSize) {
    const response = await fetch("/data?size=" + requestSize);
    let msgJson = await response.text();
    renderComments(msgJson.trim());
}

/**
 * Takes a JSON object with comment data and renders the comments on the page.
 * Because of the implementation of getServletData and loadPage(), and the need
 * to call this function outside of loadComments, the task of converting
 * the data from JSON to a list and extracting user data is left in here. 
 */
renderComments  = (commentJSON) => {
    // The list obtained from a direct conversion of JSON, including user data
    let allJsonData = JSON.parse(commentJSON);

    if (allJsonData.length  === 1 ) {
        // This means the list only has the user info nothing should happen
        return;
    } else {
        // Tries loading all the comments on the website, if an error occurs it
        // alerts the user and tries to refresh.
        try {
            // Removes the userdata from the list
            let commentData = allJsonData.slice(1);
            commentData.forEach(createComment);
            return;
        } catch (err) {
            alert("There was an error trying to load the comment section.");
            clearComments();
            return;
        }
    }
}

/**
 * Takes in the div element from the html and the login link, and clears the
 * contents of the comment section, updating to ask the user to login.
 */
 disableComments = (commentDiv, loginUrl) => {
    commentDiv.innerHTML = "";

    // creates the message for the user to log in where the comments usually are
    let loginPrompt1 = document.createElement("p");
    let loginPrompt2 = document.createElement("a");

    let text1 = document.createTextNode("Please ");
    let text2 = document.createTextNode(" if you would like to enable the comment section.");
    let text3 = document.createTextNode("login");

    loginPrompt2.appendChild(text3);
    loginPrompt2.href = loginUrl;

    loginPrompt1.appendChild(text1);
    loginPrompt1.appendChild(loginPrompt2);
    loginPrompt1.appendChild(text2);

    commentDiv.appendChild(loginPrompt1);
 }

/**
 * When the user updates the amount of comments to be displayed, this function
 * makes sure to update the page.
 **/
updateCommentDisplay = (requestSize) => {
    clearComments();
    loadComments(requestSize);
}

/**
 * For a given json string creates a new div element on the page which contains
 * the paragraph of comment text.
 **/
createComment = (commentJson) => {
    // Initializes the HTML elements needed to fill all the comment data
    let newComment = document.createElement("div");
    let userNameHolder = document.createElement("p");
    let userCommentHolder = document.createElement("p");

    // Creates a JS object from the JSON string
    let commentObj = JSON.parse(commentJson);

    // Retrieves user comment data from JS object
    let name = document.createTextNode(commentObj.userName);
    let text = document.createTextNode(commentObj.userComment);
    
    // Adds the name and text contents the respective <p> elements
    userNameHolder.appendChild(name);
    userCommentHolder.appendChild(text);

    // Adds the <p> elements to the div element
    newComment.appendChild(userNameHolder);
    newComment.appendChild(userCommentHolder);

    // Adds the new div element to the HTML
    document.getElementById("comments-container").appendChild(newComment);
}

/*
 * Clears the div with all the comment data.
 */
 clearComments = () => {
   document.getElementById("comments-container").innerHTML = "";
}

/** 
 * TODO(matwsuaz): abstract this functionality to the servlet to delete all the
 * ids from datastore to impove preformance. Having the FE send all the ID data
 * to the server is not a good idea, and isn't necessary. 
 *
 * Removes all the comments from datastore by making successive calls to 
 * deleteComment(id).
 **/
async function deleteComments() {
    const response = await fetch("/data?size=all");
    let msgJson = await response.text();

    // remove additional white spaces from the response.
    msgJson = msgJson.trim();

    if (msgJson === "") {
        return;
    } else {
        // Processes all the comment ids for deletion
        let commentList = JSON.parse(msgJson);
        for (i = 0; i < commentList.length; i++) {
            deleteComment(JSON.parse(commentList[i]).commentId);
        }
    
    /**
     * Clears the comment section and redirects to the comment section of the
     * webpage. Because of the delay to update datastore, clearing the comments
     * from the HTML gives the datastore time to finish resolving the deletion
     * requests until the user requests data again. Servlet failed to redirect
     * properly so this task is assigned here.
     **/
    clearComments();
    location.assign(location.origin + "/#comments");
    }
}

/** 
 * Takes an id and makes a request to the servlet to remove it.
 **/
async function deleteComment(id) {

    let tempForm = new FormData();
    tempForm.append("idList", id);

    /** 
     * Customization options for request.
     * The header and body parameters make sure that the HTTP request sends the
     * form data in such a way that the servlet can access it. With this code
     * the form can be read as if it had been sent by an HTML form and the
     * servlet can process it the exact same way.
     **/
    let myInit = {
        body: new URLSearchParams(tempForm),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: "POST",
    };
    
    await fetch("/delete-data", myInit);
}

/******************************************************************************
 ******************************************************************************
 ******************************MISCELLANEOUS CODE******************************
 ******************************************************************************
 *****************************************************************************/

/**
 * Redirects the user to the page where I have my charts API implementation.
 **/
 redirectToChartsPage = () => {
     location.assign(location.origin + "/ChartProject.html")
 }
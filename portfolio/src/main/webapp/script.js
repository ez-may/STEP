// TODO:(matwsuaz) : Update with logic to allow the implementation of a rotating image gallery with buttons, changing captions depending on what
// image is being displayed, and a navigation bar which allows the user to navigate to different scroll positions.

// TODO(matwsuaz) : Include a page number view for the comment section. Because the limit to viewing 
// is to either see a set amount at a time, or all of them, users need a way to navigate through
// comments. I.e. if there are 50 comments and the user decides to view only 5 at a time, they should
// arrows to navigate back and forth from the first 5, to the next 5, and so on. 

/*
 * Makes a request to the servelet for the comments it has stored, and renders each element of the JSON
 * as a new comment. Default value is 5 for the initial onload call made by the HTML body. 
 */
async function loadComments(requestSize = 5) {
    const response = await fetch("/data?size=" + requestSize);
    let msgJson = await response.text();

    // remove additional white spaces from the response. This is especially neccessary when receiving no data
    msgJson = msgJson.trim();

    if (msgJson === "") {
        // In the case the response is an empty array, we don't want to do anything.
        return;

    } else {
        // Tries loading all the comments on the website, if an error occurs it alerts the user and tries to refresh.
        try {
            JSON.parse(msgJson).forEach(createComment);
        } catch (err) {
            alert("There was an error trying to load the comment section.");
        }
    }
}

/*
 * When the user updates the amount of comments to be displayed, this function makes sure to
 * update the page.
 */
updateCommentDisplay = (requestSize) => {
    clearComments();
    loadComments(requestSize);
}

/*
 * For a given json string creates a new div element on the page which contains the paragraph of comment text.
 */
createComment = (commentJson) => {
    // Initializes the HTML elements needed to fill all the comment data
    let newComment = document.createElement("div");
    let userNameHolder = document.createElement("p");
    let userCommentHolder = document.createElement("p");

    // Creates a JS object from the JSON string
    let jsonObj = JSON.parse(commentJson);

    // Retrieves user comment data from JS object
    let name = document.createTextNode(jsonObj.userName);
    let text = document.createTextNode(jsonObj.userComment);
    
    // Adds the name and text contents the respective <p> elements
    userNameHolder.appendChild(name);
    userCommentHolder.appendChild(text);

    // Adds the <p> elements and seperator to the div element
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

/* TODO(matwsuaz): abstract this functionality to the servlet to delete all the ids from datastore to impove preformance.
 * Having the FE send all the ID data to the server is not a good idea, and isn't necessary. 
 *
 * Removes all the comments from datastore by making successive calls to deleteComment(id).
 */
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
    
    // Clears the comment section and redirects to the comment section of the webpage. Because of the delay to update datastore,
    // clearing the comments from the HTML gives the datastore time to finish resolving the deletion requests until the user requests data again.
    // Servlet failed to redirect properly so this task is assigned here.
    clearComments();
    location.assign(location.origin + "/#comments");
    }
}

/*
 * Takes an id and makes a request to the servlet to remove it.
 */
async function deleteComment(id) {

    let tempForm = new FormData();
    tempForm.append("idList", id);

    /* Customization options for request.
     * The header and body parameters make sure that the HTTP request sends the form data in such a way that the servlet can
     * access it. With this code the form can be read as if it had been sent by an HTML form and the servlet can process it 
     * the exact same way.
     */
    let myInit = {
        body: new URLSearchParams(tempForm),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: "POST",
    };
    
    await fetch("/delete-data", myInit);
}
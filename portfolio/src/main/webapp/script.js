// TODO:(matwsuaz) : Update with logic to allow the implementation of a rotating image gallery with buttons, changing captions depending on what
// image is being displayed, and a navigation bar which allows the user to navigate to different scroll positions.

/*
* Makes a request to the servelet for the comments it has stored, and renders each element of the JSON
* as a new comment.
*/
async function loadComments(requestSize = 5) {
    const response = await fetch("/data?size=" + requestSize);
    let msgJson = await response.text();

    // remove additional white spaces from the response. This is especially neccessary when receiving no data
    msgJson = msgJson.trim();

    if(msgJson === "") {
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
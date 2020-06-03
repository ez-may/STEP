//TODO:(matwsuaz) : Update with logic to allow the implementation of a rotating image gallery with buttons, changing captions depending on what
// image is being displayed, and a navigation bar which allows the user to navigate to different scroll positions.

/*
* Makes a request to the servelet for the comments it has stored, and renders each element of the JSON
* as a new comment.
*/
async function loadComments() {
    const response = await fetch("/data");
    const msgJson = await response.text();
    convertJsonStringToArray(msgJson).forEach(createComgit ment);
}

/*
* For a given string creates a new div element on the page which contains the paragraph of comment text.
*/
createComment = (comment) => {

    //Initializes a div element to hold a paragraph element with the comment
    let newComment = document.createElement("div");
    let commentText = document.createElement("p");
    let node = document.createTextNode(comment);
    
    //Adds the paragraph to the div, and then appends the new div to the website
    commentText.appendChild(node);
    newComment.appendChild(commentText);
    document.getElementById("comments").appendChild(newComment);
}

/*
* Takes a string which is formatted as an array, e.g. the result of a JSON string, and converts it
* to an array. The String being passed in must be in the form of a 1 dimesional array of String values,
* and of type String. E.g. "["apple","orange"]"
*/
convertJsonStringToArray = (arrayAsString) => {
    
    console.log(arrayAsString);

    //replaces the quotes and commas seperating string elements from the json for double commas so
    // they can be sperated later
    arrayAsString = arrayAsString.replace(/\",\"/g, ",*,");

    //replaces the delimiting brackets which remain from being in array notation
    arrayAsString = arrayAsString.replace(/\[\"/, "");
    arrayAsString = arrayAsString.replace(/\"\]/, "");

    //seperates all the strings 
    let arrayOfStrings = arrayAsString.split(",*,");

    console.log(arrayOfStrings);

    return arrayOfStrings;
}
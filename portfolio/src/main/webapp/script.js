//TODO:(matwsuaz) : Update with logic to allow the implementation of a rotating image gallery with buttons, changing captions depending on what
// image is being displayed, and a navigation bar which allows the user to navigate to different scroll positions.

async function greeting() {
    const response = await fetch("/data");
    const msg = await  response.text();
    alert(msg);
}
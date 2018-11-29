$(document).ready(function () {
    //Initial Global Variables
    var categories = ["cats", "Spongebob", "memes", "Monty Python and the Holy Grail"]; //Category strings assigned which will be used for buttons

    //Functions (non-event) listed below
    function requestGifs() { //Gets the gifs sets selected using the buttons
        var category= $(this).attr("data-category");
        var apiKey = "cshCx2Zj2tK3wyiWf5Ms9XYBmbWrTECp"; //The API Key (make sure to keep this in a separate file in the future)
        $("#gifs").empty(); //Clear previous GIFs from screen when a new set is requested

         //This stores the URL with the search term inserted into the search parameter and limit=10 inserted to request only 10 search items
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + category + "&api_key=" + apiKey + "&limit=10";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var gifs = response.data; //Stores the array containing objects which contain various versions of the gifs we requested
            for (i=0; i<gifs.length; i++) {
                var gif = $("<img>");
                gif.addClass("gif"); //This will be used later so we can reference images on click
                gif.attr("src", gifs[i].images.fixed_height_still.url); //Retrieves GIF with fixed height that is not animated
                gif.attr("data-still", gifs[i].images.fixed_height_still.url); //Stores the URL for still image in data attribute
                gif.attr("data-animate", gifs[i].images.fixed_height.url); //Stores animated GIF URL in data attribute for later use
                gif.attr("data-state", "still") //Creates state with string "still" on initialization which will be checked later
                $("#gifs").append(gif); //Appends our finished elements to the #gifs div
            }
        });
    }

    function renderButtons() { //Function to render buttons using both the initial and user input data
        $("#buttons").empty();
        for (i=0; i<categories.length; i++) {
            var b = $("<button>");
            b.addClass("category");
            b.attr("data-category", categories[i]);
            b.text(categories[i]);
            $("#buttons").append(b); //Appends button elements defined above to the #buttons div
        }
    }


    //Event functions
    $("#newButton").click(function(event) { //Function for creating a new button
        //The event parameter takes an object from the calling function to allow for the setting of various properties
        event.preventDefault(); //Prevents clicking or hitting enter on a submit form from refreshing the page
                                //This takes the user input from the form on click or enter
        var category = $("#categoryInput").val().trim(); //Note that val() formats the text of the element so it can be stored as a string
                                                        //While trim() removes any whitespaces from the string ends
        categories.push(category);
        renderButtons(); //Render buttons again with new string attached to array
    })

    $(document).on("click", ".category", requestGifs);

    //Function for changing gif from still to animate on click
    $(document).on("click", ".gif", function() {
        var state = $(this).attr("data-state"); //Use this throughout to refer only to the clicked image
        if (state === "still") {
            var animate = $(this).attr("data-animate"); //Stores URL string for animated GIF in variable
            $(this).attr("src", animate); //Set source URL to the animated one
            $(this).attr("data-state", "animated"); //Changes state to animated to be checked again
        }
        else { //Since there are only 2 states, else will work fine
            var still = $(this).attr("data-still");
            $(this).attr("src", still);
            $(this).attr("data-state", "still");
        }
    })

    //Call renderButtons() on its own for initial page render
    renderButtons();
})
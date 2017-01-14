// Grab the articles as
var numScraped = 0;
console.log(numScraped);
$("#scrapeButton").on("click", function() {
  $("#articles").empty();
  if(numScraped === 0){


    $.get("/scrape", function() {
        console.log("poo");
    }); //end of getscrape


  numScraped ++;
}
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      numScraped++;

        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "<button class='btn btn-success' data-id='" + data[i]._id + "' id='saveButton'> Save Article</button>");
    }
    numScraped = numScraped - 1;
    $("#amountScraped").append(numScraped + " Scraped");
}) //end of getJSON articles

}); //end of onClik

$(document).on("click", "#saveButton", function() {

    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    $.get("/find/articles/" + thisId, function(art){
      $.post("/saveThisArticle/" + thisId,
        art
      ).done(function(data) {
          console.log(data);
      });
    });
});

$(document).on("click", "#savedArt", function(){
  $("#articles").empty();
  console.log("saved nav");
  $.get("/showSaved", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {

          // Display the apropos information on the page
          $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" +
           " <button class='btn btn-info' data-id='" + data[i]._id + "' id='editNote'>Article Notes</button> <button class='btn btn-danger' data-id='" + data[i]._id + "' id='deleteButton'> Delete Article</button>");
      }
  }); //end of getJSON articles

});

// Whenever someone clicks a p tag
$(document).on("click", "#editNote", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $("#editNote").attr("data-id");

    // Now make an ajax call for the Article
  $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
        .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        //append save article button

        // If there's a note in the article
        if (data.note) {
            // Place the title of the note in the title input
            $("#titleinput").val(data.note.title);
            // Place the body of the note in the body textarea
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#deleteButton", function(){
  var thisId = $("#deleteButton").attr("data-id");
  console.log(thisId);

  $.ajax({
        method: "DELETE",
        url: "/deleteSaved/" + thisId
    })
    // With that done, add the note information to the page
        .done(function(data) {
          console.log(data);
          $("#articles").empty();
              for (var i = 0; i < data.length; i++) {

                  // Display the apropos information on the page
                  $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" +
                   " <button class='btn btn-info' data-id='" + data[i]._id + "' id='editNote'>Article Notes</button> <button class='btn btn-danger' data-id='" + data[i]._id + "' id='deleteButton'> Delete Article</button>");
              }
          }); //end of getJSON articles


});

$("#home").on("click", function(){
  $("#articles").empty();
  $.getJSON("/articles", function(data) {
      // For each one
      for (var i = 0; i < data.length; i++) {

          // Display the apropos information on the page
          $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "<button class='btn btn-success' data-id='" + data[i]._id + "' id='saveButton'> Save Article</button>");
      }
  }) //end of getJSON articles
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.post("/articles/" + thisId, {

        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()

    })
    // With that done
        .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
    });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

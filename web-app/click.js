clicked = 0
$('#getResults').on('click', function (e) {

    results = $("#results-div")
    results.empty()
     //your awesome code here
     text = "";
     if ($("#child-yes")[0].checked || $("#pregnant-yes")[0].checked)
     {
        text = "<br>You are in a sensitive population, so you can eat less fish than other people. <br>"
     }

     spec_name = $("#inputGroupSelectSpecies").val()
     waterbody_name = $("#inputGroupSelectWhere").val()
     length = $("#inputGroupSelectLength").val()

     number = 8

     text = text + "<br>You caught a <strong>" + spec_name + "</strong> in <strong>" + waterbody_name + "</strong>, and it was <strong>" + length +"</strong> long.<br><br>"
     if (clicked % 2 == 0)
     {
       text = text + "You can eat <strong>" + number + "</strong> meals of this fish safely in one month. <br><br>"
       text = text + "Add the details for another fish above and search again!"
     }
     else
     {
       text = text + "Unfortunately, this combination of fish, location, and length is missing from our data. <br><br>"
       text = text + "Add the details for another fish above and try again."
     }
     clicked = clicked + 1


     results.append(text)

})

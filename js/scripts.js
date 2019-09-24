var FlightSearch = {
  init: function () {
    flight1 = new Flight("Indigo", "IN-1100", "BOM", "DEL", 1800, 1569303791);
    flight2 = new Flight("Jet", "JA-2200", "BOM", "PUN", 2300, 1569303791);
    flight3 = new Flight("Air India", "AI-1155", "DEL", "BLR", 3400, 1569303791);
    flight4 = new Flight("Spicejet", "MH-3377", "BLR", "KOL", 4400, 1569303791);
    flight5 = new Flight("Go Air", "GA-5500", "PUN", "DEL", 6500, 1569303791);
    flight6 = new Flight("Indigo", "IN-3300", "BOM", "DEL", 7600, 1569303791);
    flight7 = new Flight("Indigo", "IN-4400", "DEL", "BOM", 8700, 1569303791);
  },
  search: function (travel_type, from, to, ondate, returndate, fromprice, toprice) {
    console.log("Search criteria - " + travel_type + "-" + from + "-" + to + "-" + ondate + "-" + returndate + "-" + fromprice + "-" + toprice);
    var flights = Enumerable.From(_.where(all_flights, { from: from, to: to }))
      .Where("$.price >= " + fromprice)
      .Where("$.price <= " + toprice)
      .ToArray();

    var return_flights = [];
    if (travel_type == "roundtrip") {
      return_flights = Enumerable.From(_.where(all_flights, { from: to, to: from }))
        .Where("$.price >= " + fromprice)
        .Where("$.price <= " + toprice)
        .ToArray();
    }
    flights = flights.concat(return_flights);
    console.log(flights.length + "flights found");
    FlightSearch.render(flights);
  },
  render: function (flights) {
    container = $("#flights_info");
    container.empty();
    if (flights.length > 0) {
      for (index in flights) {
        flight = flights[index];
        container.append("<tr><td>" + flight.name + "</td><td>" + flight.number + "</td><td>" + flight.from + "</td><td>" + flight.to + "</td><td>" + flight.price + "</td></tr>")
      }
    } else {
      container.append("<tr class='danger'><td colspan=5>No flights for selected criteria</td><td>");
    }
  }
}

$(document).ready(function () {

  /*Price slider*/
  $("#slider-range").slider({
    range: true,
    min: 900,
    max: 35000,
    values: [900, 35000],
    slide: function (event, ui) {
      $("#amount").text("Rs." + ui.values[0] + " - Rs." + ui.values[1]);
    }
  });
  $("#amount").text("Rs." + $("#slider-range").slider("values", 0) +
    " - Rs." + $("#slider-range").slider("values", 1));

  $("#ondate,#returndate").datetimepicker({
    format: 'd-M-Y H:i',
    step: 15
  }).click(function () { $(this).focus(); });

  $("#from, #to").select2({
    placeholder: "Select a place"
  });

  /*Enable - Disable return date*/
  $("[name='travel_type']").click(function () {
    radio_val = $("[name='travel_type']:checked").val();
    switch (radio_val) {
      case "oneway":
        $("#returndate").val("");
        $("#returndate").attr("disabled", "disabled");
        break;
      case "roundtrip":
        $("#returndate").removeAttr("disabled");
        break;
    }
  });
  $("#returndate").attr("disabled", "disabled");

  /*Submit search form*/
  $("#search-flights").on("click", function (e) {
    e.preventDefault();
    travel_type = $("[name='travel_type']:checked").val();
    from = $("#from").val();
    to = $("#to").val();

    ondate = Date.parse($("#ondate").val(), "d-MMM-yyyy HH:mm")
    if (travel_type == "roundtrip") {
      returndate = Date.parse($("#returndate").val(), "d-MMM-yyyy HH:mm");
    }
    fromprice = $("#slider-range").slider("values", 0);
    toprice = $("#slider-range").slider("values", 1);
    FlightSearch.search(travel_type, from, to, ondate, returndate, fromprice, toprice);
  });


});

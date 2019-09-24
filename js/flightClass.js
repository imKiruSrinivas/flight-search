var allFlights = [];
function Flight(name, number, from, to, price, departureTime) {
  this.name = name;
  this.number = number;
  this.from = from;
  this.to = to;
  this.price = price;
  this.departure_time = departureTime;
  allFlights.push(this);
}
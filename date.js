
exports.todayDate  = function(){
  const date = new Date();
  const currentDate = date.getDay();
  const options = {
        weekday: 'long',
        // year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-us', options);
}

exports.weekDay = function(){
  const date = new Date();
  const currentDate = date.getDay();
  const options = {
        weekday: 'long',
      };
      return date.toLocaleDateString('en-us', options);
}

console.log(module.exports);

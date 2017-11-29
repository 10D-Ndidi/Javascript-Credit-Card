# Javascript-Credit-Card
Building A Javascript Credit Card Form

A javascript credit card validator that checks issuing bank & valid number

Initialized with input masks, and a function that verifies typing has been completed (with 1 second interval) before passing finishedTyping() function that starts card validation. 

finishedTyping takes two parameters (id, value) the id of the input (e.g. cc-number, cc-exp-date, cc-cvv) and the value of the input 
  with the id we do a switch that which verifies the input that was typed into and then validating that value

For the number it uses Diego Salazars function (https://gist.github.com/DiegoSalazar/4075533) to check the validity of the credit card number 



Test Valid Credit Card numbers with free-formatter's credit card generator
https://freeformatter.com/credit-card-number-generator-validator.html



Demo Here:
https://10d-ndidi.github.io/Javascript-Credit-Card/



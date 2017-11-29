/**
 * Luhn algorithm for checking valid card numbers
 * https://gist.github.com/DiegoSalazar/4075533
 * 
 * 
 */
// takes the form field value and returns true on valid number
function valid_credit_card(value) {
    // accept only digits, dashes or spaces
      if (/[^0-9-\s]+/.test(value)) return false;
  
      // The Luhn Algorithm. It's so pretty.
      var nCheck = 0, nDigit = 0, bEven = false;
      value = value.replace(/\D/g, "");
  
      for (var n = value.length - 1; n >= 0; n--) {
          var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);
  
          if (bEven) {
              if ((nDigit *= 2) > 9) nDigit -= 9;
          }
  
          nCheck += nDigit;
          bEven = !bEven;
      }
  
      return (nCheck % 10) == 0;
  }

// Validates Expiration Date
function validExpirationDate( date ) {
    var currentDate = new Date(),
        currentMonth = currentDate.getMonth() + 1,
        currentYear = currentDate.getFullYear(),
        expirationMonth = Number( date.substr(0,2)),
        expirationYear = Number( date.substr(3, date.length));

      // Checks if expiration date is at least 1 month ahead of the current year
      if ( (expirationYear < currentYear ) || (expirationYear == currentYear && expirationMonth <= currentMonth)) {
          return false;
      }  

      return true;
}

// Validates Cvv
function validCVV(cvv) {
    return cvv.length > 2;
}

// Retrieves the card bank
function getCardType( ccNumber ) {
    var cardPatterns = {

        visa:/^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard:/^5[1-5][0-9]{14}$/,
        amex:/^3[47][0-9]{13}$/
    };
    for (var cardPattern in cardPatterns) {
        if(cardPatterns[cardPattern].test(ccNumber)) {
            return cardPattern;
        }
    }
    return false;
}


/**
 * 
 * On Document Ready
 */

$( function(){
    var number = $( "#cc-number" ),
    expDate = $( "#cc-expiration-date"),
    cvv = $('#cc-cvv'),
    paymentButton = $( '#submit-payment' ),
    ccInputs = $(".cc-input"),
    timerInterval = 1000,
    timer,
    numberOK = false, expDateOK, cvvOK;

    // Sets the masks.
    number.inputmask('9999 9999 9999 9[999] [999]', {"placeholder": " "});
    expDate.inputmask("mm/yyyy");
    cvv.inputmask("999[9]", {"placeholder": " "});

    number.focus();
    // On keyup sets a timer that triggers the finishTyping() function
    ccInputs.keyup( function (e) {
        if(e.keyCode != '9' && e.keyCode != '16'){
            clearTimeout( timer );
            timer = setTimeout( finishTyping, timerInterval, $(this).attr("id"), $(this).val() );
            }
        } );

    // On keydown stops the current timer
    ccInputs.keydown( function(e){
            clearTimeout(timer);
    } );

    // On field focus adds the .active class to corresponding span in page title
    ccInputs.focus( function(){
        $("#title-" + $(this).attr("id")).addClass("active");
    });
    ccInputs.blur( function(){
        $("h2 span").removeClass("active");
    });

    // Assure payment button wont do anything while disabled

    paymentButton.click( function( event){
        event.preventDefault();
            if ($(this).hasClass('disabled')){
                return false;
            }

            $('#card-form').submit();
    } );
    
    function finishTyping(id, value) {
        var validationValue = value.replace(/ /g, '');
        ccGeneric = 'cc-generic';
        cardType = getCardType( validationValue );
        cardClass = (cardType != false) ? "cc-" + cardType : String(ccGeneric);
        
        switch(id) {
            case 'cc-number':
                // If the number length is higher than 0, checks valid_credit_card
                if( validationValue.length > 0) {
                    numberOK = valid_credit_card( validationValue) && getCardType(validationValue);
                }
                
                if( numberOK ) {
                    number.removeClass( 'error');
                    expDate.parent().fadeIn( 'fast', function() {expDate.focus(); } );
                } else {
                    number.addClass('error');
                }
                // Switches the card icons depending on cardType
                number.parent().attr('class', cardClass);
            

                break;
            case 'cc-expiration-date':
                // Checks if the string retains "m" or "y" values from mask
                if( validationValue.indexOf('m') == -1 && validationValue.indexOf("y") == -1){
                    expDateOK = validExpirationDate(validationValue);

                    // Checks if expiration date is valid, either moves on or adds error class and disables payment button
                    if (expDateOK) {
                        expDate.removeClass( 'error');
                        cvv.parent().fadeIn( 'fast', function() {cvv.focus(); } );
                    } else {
                        expDate.addClass('error');
                    }
                }
                break;
            case 'cc-cvv':
                cvvOK = validCVV(validationValue);

                if(cvvOK) {
                    cvv.removeClass( 'error');
                    paymentButton.focus();
                } else {
                    cvv.addClass( 'error' );
                }
                break;
        }

        // Updates Payment Button Status
        if ( numberOK && expDateOK && cvvOK) {
            paymentButton.removeClass("disabled");
        } else {
            paymentButton.addClass("disabled");
        }
    }
} );

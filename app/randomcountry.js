//
// keith jolley
// squalor heights, ca, usa
// Jamul Heavy Industries, LLC ©2016-2017
// MIT License.  Seriously, do whatever you want.
//
'use strict';

var VERSION = '1.0';

var request = require('request');

// called when someone wants a randomcountry
// there are a couple ways this is done.
// if it's a POST then its alexa asking.
// if it's a GET then someone's pinging manually.
module.exports = function(req, res, what) {
  // what is "what" we need to return
  if (typeof(what) !== "string") { what = "alexa"; }

  // whatever i got is dorked up. bail.
  if (req.body === undefined) {
    console.error('Alexa ended the session due to an error.  1');
  
  // this is from a "GET"
  // i can return html (through pug nee jade),
  // or two flavors of json - minimal or alexafied
  } else if (Object.keys(req.body).length == 0) {
    var rc = getRandomCountry();
    console.log('responding to random country GET with:', rc.title, ',  what: ', what);
    // html output
    if(what === "html") {
      res.render("html", rc)

    // minimal json out
    } else if(what === "json") {
      res.json({
        "randomcountry": rc.title,
        "flag": rc.image.smallImageUrl,
        "author": "Keith P. Jolley",
        "source": "https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags"
      });

    // alexa output, but not to alexa
    } else {
      res.json( buildResponse( {}, '<speak>How about, ' + rc.title + '?</speak>', rc, true ));

    }
  } else if ((req.body.request.type === 'LaunchRequest')
          ||
            ((req.body.request.type === 'IntentRequest') && (req.body.request.intent.name === 'RandomCountry')))
  {
    // this is from a generic "POST" or a specific request from alexa. hit and quit.
    var rc = getRandomCountry();
    console.log('responding to random country POST with:', rc.randomcountry);
    var randnum = Math.random();
    if (randnum<1/3) {
      res.json( buildResponse( {}, "<speak>I give you, " + rc.title + '</speak>', rc, true ));
    } else if (randnum<2/3) {
      res.json( buildResponse( {}, "<speak>How about, " + rc.title + '?</speak>', rc, true ));
    } else {
      res.json( buildResponse( {}, "<speak>Let's say,, " + rc.title + '</speak>', rc, true ));
    }
  } else if ((req.body.request.type === 'IntentRequest')) {
    console.log('unknown IntentRequest:');
    res.json( buildResponse( {}, '<speak>' + "I'm not sure how we got here." + '</speak>', {}, true ));
  } else if ((req.body.request.type === 'CancelIntent')) {
    console.log('CancelIntent:');
    res.json( buildResponse( {}, '<speak>' + "Whatever" + '</speak>', {}, true ));
  } else if ((req.body.request.type === 'HelpIntent')) {
    console.log('HelpIntent:');
    res.json( buildResponse( {}, '<speak>' + "Simple. You ask me for a random country, I give you a random country." + '</speak>', {}, true ));
  } else if (req.body.request.reason === 'ERROR') {
      console.error('Alexa ended the session due to an error.  3');
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     Per Alexa docs, we shouldn't send ANY response here... weird, I know.
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  } else {
    console.log('ELSE:');
    res.json( buildResponse( {}, '<speak>' + "Goodbye." + '</speak>', {}, true ));
  }
}

// pick a random country from our list of flags. create a card for it while we are at it.
function getRandomCountry () {
  var randomcountry = Object.keys(flags)[Math.floor(Math.random()*Object.keys(flags).length)];
  var flag = flags[randomcountry];
  var text = "Country names and flag images courtesy of Wikipedia.";
  var card = {
              type:  'Standard',
              title: randomcountry,
              text:  text,
              image: {
                  smallImageUrl: flag,
                  largeImageUrl: flag
              }
          };
  return( card );
}

// what alexa wants, alexa gets
function buildResponse(session, speech, card, end) {
    return {
        version: VERSION,
        sessionAttributes: session,
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: speech
          },
          card: card,
          shouldEndSession: !!end
        }
    };
}

// this was a call to countries.io to grab their json output, but, i liked having the flags and i liked having the
// info (semi) static, but, as countries come and countries grow, some day i'll have to update this list. it's
// probably already out of date.

// maybe i'll write a script to kep this current. another day.

var flags = {
  "Abkhazia": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Abkhazia.svg/300px-Flag_of_Abkhazia.svg.png",
  "Afghanistan": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Afghanistan.svg/225px-Flag_of_Afghanistan.svg.png",
  "Albania": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/210px-Flag_of_Albania.svg.png",
  "Algeria": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/225px-Flag_of_Algeria.svg.png",
  "Andorra": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Andorra.svg/214px-Flag_of_Andorra.svg.png",
  "Angola": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/225px-Flag_of_Angola.svg.png",
  "Antigua and Barbuda": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Antigua_and_Barbuda.svg/225px-Flag_of_Antigua_and_Barbuda.svg.png",
  "Argentina": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/240px-Flag_of_Argentina.svg.png",
  "Armenia": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/300px-Flag_of_Armenia.svg.png",
  "Australia": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/300px-Flag_of_Australia_%28converted%29.svg.png",
  "Austria": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/225px-Flag_of_Austria.svg.png",
  "Azerbaijan": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/300px-Flag_of_Azerbaijan.svg.png",
  "Bahamas": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flag_of_the_Bahamas.svg/300px-Flag_of_the_Bahamas.svg.png",
  "Bahrain": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/250px-Flag_of_Bahrain.svg.png",
  "Bangladesh": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/250px-Flag_of_Bangladesh.svg.png",
  "Barbados": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Barbados.svg/225px-Flag_of_Barbados.svg.png",
  "Belarus": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Flag_of_Belarus.svg/300px-Flag_of_Belarus.svg.png",
  "Belgium": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Belgium_%28civil%29.svg/225px-Flag_of_Belgium_%28civil%29.svg.png",
  "Belize": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/225px-Flag_of_Belize.svg.png",
  "Benin": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/225px-Flag_of_Benin.svg.png",
  "Bhutan": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/225px-Flag_of_Bhutan.svg.png",
  "Bolivia": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_Bolivia_%28state%29.svg/220px-Flag_of_Bolivia_%28state%29.svg.png",
  "Bosnia and Herzegovina": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Flag_of_Bosnia_and_Herzegovina.svg/300px-Flag_of_Bosnia_and_Herzegovina.svg.png",
  "Botswana": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/225px-Flag_of_Botswana.svg.png",
  "Brazil": "http://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/214px-Flag_of_Brazil.svg.png",
  "Brunei": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/300px-Flag_of_Brunei.svg.png",
  "Bulgaria": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/250px-Flag_of_Bulgaria.svg.png",
  "Burkina_Faso": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Burkina_Faso.svg/225px-Flag_of_Burkina_Faso.svg.png",
  "Burundi": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Burundi.svg/250px-Flag_of_Burundi.svg.png",
  "C%C3%B4te_d%27Ivoire": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg/225px-Flag_of_C%C3%B4te_d%27Ivoire.svg.png",
  "Cambodia": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/235px-Flag_of_Cambodia.svg.png",
  "Cameroon": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/225px-Flag_of_Cameroon.svg.png",
  "Canada": "http://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Flag_of_Canada.svg/300px-Flag_of_Canada.svg.png",
  "Cape Verde": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/255px-Flag_of_Cape_Verde.svg.png",
  "Central African Republic": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Central_African_Republic.svg/225px-Flag_of_the_Central_African_Republic.svg.png",
  "Chad": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flag_of_Chad.svg/225px-Flag_of_Chad.svg.png",
  "Chile": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/225px-Flag_of_Chile.svg.png",
  "Colombia": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/225px-Flag_of_Colombia.svg.png",
  "Comoros": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Flag_of_the_Comoros.svg/250px-Flag_of_the_Comoros.svg.png",
  "Cook Islands": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_the_Cook_Islands.svg/300px-Flag_of_the_Cook_Islands.svg.png",
  "Costa Rica": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/250px-Flag_of_Costa_Rica.svg.png",
  "Croatia": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/300px-Flag_of_Croatia.svg.png",
  "Cuba": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/300px-Flag_of_Cuba.svg.png",
  "Cyprus": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Cyprus.svg/225px-Flag_of_Cyprus.svg.png",
  "Czech Republic": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/225px-Flag_of_the_Czech_Republic.svg.png",
  "Democratic Republic of the Congo": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/200px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png",
  "Denmark": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/198px-Flag_of_Denmark.svg.png",
  "Djibouti": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_Djibouti.svg/225px-Flag_of_Djibouti.svg.png",
  "Dominica": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Dominica.svg/300px-Flag_of_Dominica.svg.png",
  "Dominican Republic": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/225px-Flag_of_the_Dominican_Republic.svg.png",
  "East Timor": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_East_Timor.svg/300px-Flag_of_East_Timor.svg.png",
  "Ecuador": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/225px-Flag_of_Ecuador.svg.png",
  "Egypt": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/225px-Flag_of_Egypt.svg.png",
  "El Salvador": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/266px-Flag_of_El_Salvador.svg.png",
  "Equatorial Guinea": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Equatorial_Guinea.svg/225px-Flag_of_Equatorial_Guinea.svg.png",
  "Eritrea": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_Eritrea.svg/300px-Flag_of_Eritrea.svg.png",
  "Estonia": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Estonia.svg/236px-Flag_of_Estonia.svg.png",
  "Ethiopia": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/300px-Flag_of_Ethiopia.svg.png",
  "Federated States of Micronesia": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg/285px-Flag_of_the_Federated_States_of_Micronesia.svg.png",
  "Fiji": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/300px-Flag_of_Fiji.svg.png",
  "Finland": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/246px-Flag_of_Finland.svg.png",
  "France": "http://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/225px-Flag_of_France.svg.png",
  "Gabon": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/200px-Flag_of_Gabon.svg.png",
  "Georgia": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/225px-Flag_of_Georgia.svg.png",
  "Germany": "http://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/250px-Flag_of_Germany.svg.png",
  "Ghana": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/225px-Flag_of_Ghana.svg.png",
  "Greece": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/225px-Flag_of_Greece.svg.png",
  "Grenada": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Grenada.svg/250px-Flag_of_Grenada.svg.png",
  "Guatemala": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/240px-Flag_of_Guatemala.svg.png",
  "Guinea": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Guinea.svg/225px-Flag_of_Guinea.svg.png",
  "Guinea-Bissau": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Guinea-Bissau.svg/300px-Flag_of_Guinea-Bissau.svg.png",
  "Guyana": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/250px-Flag_of_Guyana.svg.png",
  "Haiti": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/250px-Flag_of_Haiti.svg.png",
  "Honduras": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Flag_of_Honduras.svg/300px-Flag_of_Honduras.svg.png",
  "Hungary": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/300px-Flag_of_Hungary.svg.png",
  "Iceland": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/209px-Flag_of_Iceland.svg.png",
  "India": "http://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/225px-Flag_of_India.svg.png",
  "Indonesia": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/225px-Flag_of_Indonesia.svg.png",
  "Iran": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/263px-Flag_of_Iran.svg.png",
  "Iraq": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/225px-Flag_of_Iraq.svg.png",
  "Ireland": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/300px-Flag_of_Ireland.svg.png",
  "Israel": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/206px-Flag_of_Israel.svg.png",
  "Italy": "http://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/225px-Flag_of_Italy.svg.png",
  "Jamaica": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/300px-Flag_of_Jamaica.svg.png",
  "Japan": "http://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/225px-Flag_of_Japan.svg.png",
  "Jordan": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/300px-Flag_of_Jordan.svg.png",
  "Kazakhstan": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/300px-Flag_of_Kazakhstan.svg.png",
  "Kenya": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/225px-Flag_of_Kenya.svg.png",
  "Kiribati": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kiribati.svg/300px-Flag_of_Kiribati.svg.png",
  "Kosovo": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Flag_of_Kosovo.svg/210px-Flag_of_Kosovo.svg.png",
  "Kuwait": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/300px-Flag_of_Kuwait.svg.png",
  "Kyrgyzstan": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/250px-Flag_of_Kyrgyzstan.svg.png",
  "Laos": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/225px-Flag_of_Laos.svg.png",
  "Latvia": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/300px-Flag_of_Latvia.svg.png",
  "Lebanon": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Lebanon.svg/225px-Flag_of_Lebanon.svg.png",
  "Lesotho": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Lesotho.svg/225px-Flag_of_Lesotho.svg.png",
  "Liberia": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Liberia.svg/285px-Flag_of_Liberia.svg.png",
  "Libya": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Libya.svg/300px-Flag_of_Libya.svg.png",
  "Liechtenstein": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Liechtenstein.svg/250px-Flag_of_Liechtenstein.svg.png",
  "Lithuania": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Lithuania.svg/250px-Flag_of_Lithuania.svg.png",
  "Luxembourg": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Luxembourg.svg/250px-Flag_of_Luxembourg.svg.png",
  "Macedonia": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Flag_of_Macedonia.svg/300px-Flag_of_Macedonia.svg.png",
  "Madagascar": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/225px-Flag_of_Madagascar.svg.png",
  "Malawi": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/225px-Flag_of_Malawi.svg.png",
  "Malaysia": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/300px-Flag_of_Malaysia.svg.png",
  "Maldives": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/225px-Flag_of_Maldives.svg.png",
  "Mali": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Mali.svg/225px-Flag_of_Mali.svg.png",
  "Malta": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Malta.svg/225px-Flag_of_Malta.svg.png",
  "Marshall Islands": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/285px-Flag_of_the_Marshall_Islands.svg.png",
  "Mauritania": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Flag_of_Mauritania.svg/225px-Flag_of_Mauritania.svg.png",
  "Mauritius": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Mauritius.svg/225px-Flag_of_Mauritius.svg.png",
  "Mexico": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/263px-Flag_of_Mexico.svg.png",
  "Moldova": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/300px-Flag_of_Moldova.svg.png",
  "Monaco": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/188px-Flag_of_Monaco.svg.png",
  "Mongolia": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/300px-Flag_of_Mongolia.svg.png",
  "Montenegro": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Montenegro.svg/300px-Flag_of_Montenegro.svg.png",
  "Morocco": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/225px-Flag_of_Morocco.svg.png",
  "Mozambique": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/225px-Flag_of_Mozambique.svg.png",
  "Myanmar": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_Myanmar.svg/225px-Flag_of_Myanmar.svg.png",
  "Nagorno-Karabakh": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Nagorno-Karabakh.svg/300px-Flag_of_Nagorno-Karabakh.svg.png",
  "Namibia": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/225px-Flag_of_Namibia.svg.png",
  "Nauru": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Nauru.svg/300px-Flag_of_Nauru.svg.png",
  "Nepal": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/123px-Flag_of_Nepal.svg.png",
  "Netherlands": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/225px-Flag_of_the_Netherlands.svg.png",
  "New Zealand": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/300px-Flag_of_New_Zealand.svg.png",
  "Nicaragua": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/250px-Flag_of_Nicaragua.svg.png",
  "Niger": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/175px-Flag_of_Niger.svg.png",
  "Nigeria": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/300px-Flag_of_Nigeria.svg.png",
  "Niue": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Niue.svg/300px-Flag_of_Niue.svg.png",
  "North_Korea": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/300px-Flag_of_North_Korea.svg.png",
  "Norway": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/206px-Flag_of_Norway.svg.png",
  "Oman": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/300px-Flag_of_Oman.svg.png",
  "Pakistan": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/225px-Flag_of_Pakistan.svg.png",
  "Palau": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Palau.svg/240px-Flag_of_Palau.svg.png",
  "Palestine": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Palestine.svg/300px-Flag_of_Palestine.svg.png",
  "Panama": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/225px-Flag_of_Panama.svg.png",
  "Papua New Guinea": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/200px-Flag_of_Papua_New_Guinea.svg.png",
  "Paraguay": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/273px-Flag_of_Paraguay.svg.png",
  "China": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/225px-Flag_of_the_People%27s_Republic_of_China.svg.png",
  "Peru": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/225px-Flag_of_Peru.svg.png",
  "Philippines": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/300px-Flag_of_the_Philippines.svg.png",
  "Poland": "http://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/240px-Flag_of_Poland.svg.png",
  "Portugal": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/225px-Flag_of_Portugal.svg.png",
  "Qatar": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/382px-Flag_of_Qatar.svg.png",
  "Republic of China": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Flag_of_the_Republic_of_China.svg/225px-Flag_of_the_Republic_of_China.svg.png",
  "Republic of the Congo": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/225px-Flag_of_the_Republic_of_the_Congo.svg.png",
  "Romania": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/225px-Flag_of_Romania.svg.png",
  "Russia": "http://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/225px-Flag_of_Russia.svg.png",
  "Rwanda": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/225px-Flag_of_Rwanda.svg.png",
  "Sahrawi Arab Democratic Republic": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg/300px-Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg.png",
  "Saint Kitts and Nevis": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg/225px-Flag_of_Saint_Kitts_and_Nevis.svg.png",
  "Saint Lucia": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Saint_Lucia.svg/300px-Flag_of_Saint_Lucia.svg.png",
  "Saint Vincent and the Grenadines": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg/225px-Flag_of_Saint_Vincent_and_the_Grenadines.svg.png",
  "Samoa": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/300px-Flag_of_Samoa.svg.png",
  "San Marino": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Flag_of_San_Marino.svg/200px-Flag_of_San_Marino.svg.png",
  "Sao Tome and Principe": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Sao_Tome_and_Principe.svg/300px-Flag_of_Sao_Tome_and_Principe.svg.png",
  "Saudi Arabia": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/225px-Flag_of_Saudi_Arabia.svg.png",
  "Senegal": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/225px-Flag_of_Senegal.svg.png",
  "Serbia": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/225px-Flag_of_Serbia.svg.png",
  "Seychelles": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/300px-Flag_of_Seychelles.svg.png",
  "Sierra Leone": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Sierra_Leone.svg/225px-Flag_of_Sierra_Leone.svg.png",
  "Singapore": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/225px-Flag_of_Singapore.svg.png",
  "Slovakia": "http://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/225px-Flag_of_Slovakia.svg.png",
  "Slovenia": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Flag_of_Slovenia.svg/300px-Flag_of_Slovenia.svg.png",
  "Solomon_Islands": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/300px-Flag_of_the_Solomon_Islands.svg.png",
  "Somalia": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Somalia.svg/225px-Flag_of_Somalia.svg.png",
  "Somaliland": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Somaliland.svg/300px-Flag_of_Somaliland.svg.png",
  "South Africa": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/225px-Flag_of_South_Africa.svg.png",
  "South Korea": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/225px-Flag_of_South_Korea.svg.png",
  "South Ossetia": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_South_Ossetia.svg/300px-Flag_of_South_Ossetia.svg.png",
  "South Sudan": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_South_Sudan.svg/300px-Flag_of_South_Sudan.svg.png",
  "Spain": "http://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/225px-Flag_of_Spain.svg.png",
  "Sri Lanka": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/300px-Flag_of_Sri_Lanka.svg.png",
  "Sudan": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Sudan.svg/300px-Flag_of_Sudan.svg.png",
  "Suriname": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Suriname.svg/225px-Flag_of_Suriname.svg.png",
  "Swaziland": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_Swaziland.svg/225px-Flag_of_Swaziland.svg.png",
  "Sweden": "http://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/240px-Flag_of_Sweden.svg.png",
  "Switzerland": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/150px-Flag_of_Switzerland_%28Pantone%29.svg.png",
  "Syria": "http://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flag_of_Syria.svg/225px-Flag_of_Syria.svg.png",
  "Tajikistan": "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/300px-Flag_of_Tajikistan.svg.png",
  "Tanzania": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/225px-Flag_of_Tanzania.svg.png",
  "Thailand": "http://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/225px-Flag_of_Thailand.svg.png",
  "The Gambia": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_The_Gambia.svg/225px-Flag_of_The_Gambia.svg.png",
  "Togo": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Togo.svg/243px-Flag_of_Togo.svg.png",
  "Tonga": "http://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/300px-Flag_of_Tonga.svg.png",
  "Transnistria": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Transnistria_%28state%29.svg/300px-Flag_of_Transnistria_%28state%29.svg.png",
  "Trinidad and Tobago": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Trinidad_and_Tobago.svg/250px-Flag_of_Trinidad_and_Tobago.svg.png",
  "Tunisia": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/225px-Flag_of_Tunisia.svg.png",
  "Turkey": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/225px-Flag_of_Turkey.svg.png",
  "Turkish Republic of Northern Cyprus": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg/225px-Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg.png",
  "Turkmenistan": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/225px-Flag_of_Turkmenistan.svg.png",
  "Tuvalu": "http://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tuvalu.svg/300px-Flag_of_Tuvalu.svg.png",
  "Uganda": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Uganda.svg/225px-Flag_of_Uganda.svg.png",
  "Ukraine": "http://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/225px-Flag_of_Ukraine.svg.png",
  "United Arab Emirates": "http://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/300px-Flag_of_the_United_Arab_Emirates.svg.png",
  "United Kingdom": "http://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/300px-Flag_of_the_United_Kingdom.svg.png",
  "United States": "http://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/285px-Flag_of_the_United_States.svg.png",
  "Uruguay": "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/225px-Flag_of_Uruguay.svg.png",
  "Uzbekistan": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/300px-Flag_of_Uzbekistan.svg.png",
  "Vanuatu": "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Vanuatu.svg/250px-Flag_of_Vanuatu.svg.png",
  "Vatican City": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_the_Vatican_City.svg/150px-Flag_of_the_Vatican_City.svg.png",
  "Venezuela": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/225px-Flag_of_Venezuela.svg.png",
  "Vietnam": "http://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/225px-Flag_of_Vietnam.svg.png",
  "Yemen": "http://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Yemen.svg/225px-Flag_of_Yemen.svg.png",
  "Zambia": "http://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/225px-Flag_of_Zambia.svg.png",
  "Zimbabwe": "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/300px-Flag_of_Zimbabwe.svg.png"
}

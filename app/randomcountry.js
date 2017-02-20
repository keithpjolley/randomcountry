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
// disable card for now.  url to image is problematic.
//          card: card,
          shouldEndSession: !!end
        }
    };
}

// this was a call to countries.io to grab their json output, but, i liked having the flags and i liked having the
// info (semi) static, but, as countries come and countries grow, some day i'll have to update this list. it's
// probably already out of date.

// maybe i'll write a script to kep this current. another day.

var flags = {
  "Abkhazia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Abkhazia.svg/300px-Flag_of_Abkhazia.svg.png",
  "Afghanistan": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Afghanistan.svg/225px-Flag_of_Afghanistan.svg.png",
  "Albania": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Flag_of_Albania.svg/210px-Flag_of_Albania.svg.png",
  "Algeria": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/225px-Flag_of_Algeria.svg.png",
  "Andorra": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Andorra.svg/214px-Flag_of_Andorra.svg.png",
  "Angola": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/225px-Flag_of_Angola.svg.png",
  "Antigua and Barbuda": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Antigua_and_Barbuda.svg/225px-Flag_of_Antigua_and_Barbuda.svg.png",
  "Argentina": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/240px-Flag_of_Argentina.svg.png",
  "Armenia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/300px-Flag_of_Armenia.svg.png",
  "Australia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/300px-Flag_of_Australia_%28converted%29.svg.png",
  "Austria": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Flag_of_Austria.svg/225px-Flag_of_Austria.svg.png",
  "Azerbaijan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/300px-Flag_of_Azerbaijan.svg.png",
  "Bahamas": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Flag_of_the_Bahamas.svg/300px-Flag_of_the_Bahamas.svg.png",
  "Bahrain": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Bahrain.svg/250px-Flag_of_Bahrain.svg.png",
  "Bangladesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/250px-Flag_of_Bangladesh.svg.png",
  "Barbados": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flag_of_Barbados.svg/225px-Flag_of_Barbados.svg.png",
  "Belarus": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Flag_of_Belarus.svg/300px-Flag_of_Belarus.svg.png",
  "Belgium": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Belgium_%28civil%29.svg/225px-Flag_of_Belgium_%28civil%29.svg.png",
  "Belize": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/225px-Flag_of_Belize.svg.png",
  "Benin": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/225px-Flag_of_Benin.svg.png",
  "Bhutan": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flag_of_Bhutan.svg/225px-Flag_of_Bhutan.svg.png",
  "Bolivia": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Flag_of_Bolivia_%28state%29.svg/220px-Flag_of_Bolivia_%28state%29.svg.png",
  "Bosnia and Herzegovina": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Flag_of_Bosnia_and_Herzegovina.svg/300px-Flag_of_Bosnia_and_Herzegovina.svg.png",
  "Botswana": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/225px-Flag_of_Botswana.svg.png",
  "Brazil": "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/214px-Flag_of_Brazil.svg.png",
  "Brunei": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Brunei.svg/300px-Flag_of_Brunei.svg.png",
  "Bulgaria": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Bulgaria.svg/250px-Flag_of_Bulgaria.svg.png",
  "Burkina_Faso": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Burkina_Faso.svg/225px-Flag_of_Burkina_Faso.svg.png",
  "Burundi": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Flag_of_Burundi.svg/250px-Flag_of_Burundi.svg.png",
  "C%C3%B4te_d%27Ivoire": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_C%C3%B4te_d%27Ivoire.svg/225px-Flag_of_C%C3%B4te_d%27Ivoire.svg.png",
  "Cambodia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_Cambodia.svg/235px-Flag_of_Cambodia.svg.png",
  "Cameroon": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/225px-Flag_of_Cameroon.svg.png",
  "Canada": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Flag_of_Canada.svg/300px-Flag_of_Canada.svg.png",
  "Cape Verde": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/255px-Flag_of_Cape_Verde.svg.png",
  "Central African Republic": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Central_African_Republic.svg/225px-Flag_of_the_Central_African_Republic.svg.png",
  "Chad": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Flag_of_Chad.svg/225px-Flag_of_Chad.svg.png",
  "Chile": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/225px-Flag_of_Chile.svg.png",
  "Colombia": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/225px-Flag_of_Colombia.svg.png",
  "Comoros": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Flag_of_the_Comoros.svg/250px-Flag_of_the_Comoros.svg.png",
  "Cook Islands": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Flag_of_the_Cook_Islands.svg/300px-Flag_of_the_Cook_Islands.svg.png",
  "Costa Rica": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Costa_Rica.svg/250px-Flag_of_Costa_Rica.svg.png",
  "Croatia": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/300px-Flag_of_Croatia.svg.png",
  "Cuba": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/300px-Flag_of_Cuba.svg.png",
  "Cyprus": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Cyprus.svg/225px-Flag_of_Cyprus.svg.png",
  "Czech Republic": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/225px-Flag_of_the_Czech_Republic.svg.png",
  "Democratic Republic of the Congo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Flag_of_the_Democratic_Republic_of_the_Congo.svg/200px-Flag_of_the_Democratic_Republic_of_the_Congo.svg.png",
  "Denmark": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/198px-Flag_of_Denmark.svg.png",
  "Djibouti": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_Djibouti.svg/225px-Flag_of_Djibouti.svg.png",
  "Dominica": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Flag_of_Dominica.svg/300px-Flag_of_Dominica.svg.png",
  "Dominican Republic": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/225px-Flag_of_the_Dominican_Republic.svg.png",
  "East Timor": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_East_Timor.svg/300px-Flag_of_East_Timor.svg.png",
  "Ecuador": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/225px-Flag_of_Ecuador.svg.png",
  "Egypt": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/225px-Flag_of_Egypt.svg.png",
  "El Salvador": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/266px-Flag_of_El_Salvador.svg.png",
  "Equatorial Guinea": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Equatorial_Guinea.svg/225px-Flag_of_Equatorial_Guinea.svg.png",
  "Eritrea": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Flag_of_Eritrea.svg/300px-Flag_of_Eritrea.svg.png",
  "Estonia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flag_of_Estonia.svg/236px-Flag_of_Estonia.svg.png",
  "Ethiopia": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_Ethiopia.svg/300px-Flag_of_Ethiopia.svg.png",
  "Federated States of Micronesia": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg/285px-Flag_of_the_Federated_States_of_Micronesia.svg.png",
  "Fiji": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Fiji.svg/300px-Flag_of_Fiji.svg.png",
  "Finland": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Finland.svg/246px-Flag_of_Finland.svg.png",
  "France": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/225px-Flag_of_France.svg.png",
  "Gabon": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flag_of_Gabon.svg/200px-Flag_of_Gabon.svg.png",
  "Georgia": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/225px-Flag_of_Georgia.svg.png",
  "Germany": "https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/250px-Flag_of_Germany.svg.png",
  "Ghana": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/225px-Flag_of_Ghana.svg.png",
  "Greece": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Greece.svg/225px-Flag_of_Greece.svg.png",
  "Grenada": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Grenada.svg/250px-Flag_of_Grenada.svg.png",
  "Guatemala": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/240px-Flag_of_Guatemala.svg.png",
  "Guinea": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Flag_of_Guinea.svg/225px-Flag_of_Guinea.svg.png",
  "Guinea-Bissau": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Guinea-Bissau.svg/300px-Flag_of_Guinea-Bissau.svg.png",
  "Guyana": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/250px-Flag_of_Guyana.svg.png",
  "Haiti": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Haiti.svg/250px-Flag_of_Haiti.svg.png",
  "Honduras": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Flag_of_Honduras.svg/300px-Flag_of_Honduras.svg.png",
  "Hungary": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/300px-Flag_of_Hungary.svg.png",
  "Iceland": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/209px-Flag_of_Iceland.svg.png",
  "India": "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/225px-Flag_of_India.svg.png",
  "Indonesia": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/225px-Flag_of_Indonesia.svg.png",
  "Iran": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Flag_of_Iran.svg/263px-Flag_of_Iran.svg.png",
  "Iraq": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/225px-Flag_of_Iraq.svg.png",
  "Ireland": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_Ireland.svg/300px-Flag_of_Ireland.svg.png",
  "Israel": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/206px-Flag_of_Israel.svg.png",
  "Italy": "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/225px-Flag_of_Italy.svg.png",
  "Jamaica": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Jamaica.svg/300px-Flag_of_Jamaica.svg.png",
  "Japan": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/225px-Flag_of_Japan.svg.png",
  "Jordan": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/300px-Flag_of_Jordan.svg.png",
  "Kazakhstan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kazakhstan.svg/300px-Flag_of_Kazakhstan.svg.png",
  "Kenya": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/225px-Flag_of_Kenya.svg.png",
  "Kiribati": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Flag_of_Kiribati.svg/300px-Flag_of_Kiribati.svg.png",
  "Kosovo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Flag_of_Kosovo.svg/210px-Flag_of_Kosovo.svg.png",
  "Kuwait": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Flag_of_Kuwait.svg/300px-Flag_of_Kuwait.svg.png",
  "Kyrgyzstan": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/250px-Flag_of_Kyrgyzstan.svg.png",
  "Laos": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Flag_of_Laos.svg/225px-Flag_of_Laos.svg.png",
  "Latvia": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Latvia.svg/300px-Flag_of_Latvia.svg.png",
  "Lebanon": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Flag_of_Lebanon.svg/225px-Flag_of_Lebanon.svg.png",
  "Lesotho": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_Lesotho.svg/225px-Flag_of_Lesotho.svg.png",
  "Liberia": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Flag_of_Liberia.svg/285px-Flag_of_Liberia.svg.png",
  "Libya": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Libya.svg/300px-Flag_of_Libya.svg.png",
  "Liechtenstein": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Liechtenstein.svg/250px-Flag_of_Liechtenstein.svg.png",
  "Lithuania": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Lithuania.svg/250px-Flag_of_Lithuania.svg.png",
  "Luxembourg": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Flag_of_Luxembourg.svg/250px-Flag_of_Luxembourg.svg.png",
  "Macedonia": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Flag_of_Macedonia.svg/300px-Flag_of_Macedonia.svg.png",
  "Madagascar": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/225px-Flag_of_Madagascar.svg.png",
  "Malawi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/225px-Flag_of_Malawi.svg.png",
  "Malaysia": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/300px-Flag_of_Malaysia.svg.png",
  "Maldives": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Maldives.svg/225px-Flag_of_Maldives.svg.png",
  "Mali": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_Mali.svg/225px-Flag_of_Mali.svg.png",
  "Malta": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Malta.svg/225px-Flag_of_Malta.svg.png",
  "Marshall Islands": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/285px-Flag_of_the_Marshall_Islands.svg.png",
  "Mauritania": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Flag_of_Mauritania.svg/225px-Flag_of_Mauritania.svg.png",
  "Mauritius": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Mauritius.svg/225px-Flag_of_Mauritius.svg.png",
  "Mexico": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Mexico.svg/263px-Flag_of_Mexico.svg.png",
  "Moldova": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Moldova.svg/300px-Flag_of_Moldova.svg.png",
  "Monaco": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Monaco.svg/188px-Flag_of_Monaco.svg.png",
  "Mongolia": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Mongolia.svg/300px-Flag_of_Mongolia.svg.png",
  "Montenegro": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Montenegro.svg/300px-Flag_of_Montenegro.svg.png",
  "Morocco": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/225px-Flag_of_Morocco.svg.png",
  "Mozambique": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/225px-Flag_of_Mozambique.svg.png",
  "Myanmar": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_Myanmar.svg/225px-Flag_of_Myanmar.svg.png",
  "Nagorno-Karabakh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Flag_of_Nagorno-Karabakh.svg/300px-Flag_of_Nagorno-Karabakh.svg.png",
  "Namibia": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/225px-Flag_of_Namibia.svg.png",
  "Nauru": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Flag_of_Nauru.svg/300px-Flag_of_Nauru.svg.png",
  "Nepal": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Flag_of_Nepal.svg/123px-Flag_of_Nepal.svg.png",
  "Netherlands": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/225px-Flag_of_the_Netherlands.svg.png",
  "New Zealand": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/300px-Flag_of_New_Zealand.svg.png",
  "Nicaragua": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/250px-Flag_of_Nicaragua.svg.png",
  "Niger": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/175px-Flag_of_Niger.svg.png",
  "Nigeria": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/300px-Flag_of_Nigeria.svg.png",
  "Niue": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Niue.svg/300px-Flag_of_Niue.svg.png",
  "North_Korea": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/300px-Flag_of_North_Korea.svg.png",
  "Norway": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/206px-Flag_of_Norway.svg.png",
  "Oman": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Oman.svg/300px-Flag_of_Oman.svg.png",
  "Pakistan": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Flag_of_Pakistan.svg/225px-Flag_of_Pakistan.svg.png",
  "Palau": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Palau.svg/240px-Flag_of_Palau.svg.png",
  "Palestine": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Palestine.svg/300px-Flag_of_Palestine.svg.png",
  "Panama": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/225px-Flag_of_Panama.svg.png",
  "Papua New Guinea": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Flag_of_Papua_New_Guinea.svg/200px-Flag_of_Papua_New_Guinea.svg.png",
  "Paraguay": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/273px-Flag_of_Paraguay.svg.png",
  "China": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/225px-Flag_of_the_People%27s_Republic_of_China.svg.png",
  "Peru": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/225px-Flag_of_Peru.svg.png",
  "Philippines": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_the_Philippines.svg/300px-Flag_of_the_Philippines.svg.png",
  "Poland": "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/240px-Flag_of_Poland.svg.png",
  "Portugal": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/225px-Flag_of_Portugal.svg.png",
  "Qatar": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/382px-Flag_of_Qatar.svg.png",
  "Republic of China": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Flag_of_the_Republic_of_China.svg/225px-Flag_of_the_Republic_of_China.svg.png",
  "Republic of the Congo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/225px-Flag_of_the_Republic_of_the_Congo.svg.png",
  "Romania": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/225px-Flag_of_Romania.svg.png",
  "Russia": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/225px-Flag_of_Russia.svg.png",
  "Rwanda": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Rwanda.svg/225px-Flag_of_Rwanda.svg.png",
  "Sahrawi Arab Democratic Republic": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg/300px-Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg.png",
  "Saint Kitts and Nevis": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg/225px-Flag_of_Saint_Kitts_and_Nevis.svg.png",
  "Saint Lucia": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Saint_Lucia.svg/300px-Flag_of_Saint_Lucia.svg.png",
  "Saint Vincent and the Grenadines": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg/225px-Flag_of_Saint_Vincent_and_the_Grenadines.svg.png",
  "Samoa": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Flag_of_Samoa.svg/300px-Flag_of_Samoa.svg.png",
  "San Marino": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Flag_of_San_Marino.svg/200px-Flag_of_San_Marino.svg.png",
  "Sao Tome and Principe": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Sao_Tome_and_Principe.svg/300px-Flag_of_Sao_Tome_and_Principe.svg.png",
  "Saudi Arabia": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/225px-Flag_of_Saudi_Arabia.svg.png",
  "Senegal": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/225px-Flag_of_Senegal.svg.png",
  "Serbia": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Serbia.svg/225px-Flag_of_Serbia.svg.png",
  "Seychelles": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Flag_of_Seychelles.svg/300px-Flag_of_Seychelles.svg.png",
  "Sierra Leone": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Flag_of_Sierra_Leone.svg/225px-Flag_of_Sierra_Leone.svg.png",
  "Singapore": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/225px-Flag_of_Singapore.svg.png",
  "Slovakia": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/225px-Flag_of_Slovakia.svg.png",
  "Slovenia": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Flag_of_Slovenia.svg/300px-Flag_of_Slovenia.svg.png",
  "Solomon_Islands": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Flag_of_the_Solomon_Islands.svg/300px-Flag_of_the_Solomon_Islands.svg.png",
  "Somalia": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Flag_of_Somalia.svg/225px-Flag_of_Somalia.svg.png",
  "Somaliland": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Flag_of_Somaliland.svg/300px-Flag_of_Somaliland.svg.png",
  "South Africa": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/225px-Flag_of_South_Africa.svg.png",
  "South Korea": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/225px-Flag_of_South_Korea.svg.png",
  "South Ossetia": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Flag_of_South_Ossetia.svg/300px-Flag_of_South_Ossetia.svg.png",
  "South Sudan": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_South_Sudan.svg/300px-Flag_of_South_Sudan.svg.png",
  "Spain": "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/225px-Flag_of_Spain.svg.png",
  "Sri Lanka": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Flag_of_Sri_Lanka.svg/300px-Flag_of_Sri_Lanka.svg.png",
  "Sudan": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_Sudan.svg/300px-Flag_of_Sudan.svg.png",
  "Suriname": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Flag_of_Suriname.svg/225px-Flag_of_Suriname.svg.png",
  "Swaziland": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_Swaziland.svg/225px-Flag_of_Swaziland.svg.png",
  "Sweden": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Flag_of_Sweden.svg/240px-Flag_of_Sweden.svg.png",
  "Switzerland": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/150px-Flag_of_Switzerland_%28Pantone%29.svg.png",
  "Syria": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Flag_of_Syria.svg/225px-Flag_of_Syria.svg.png",
  "Tajikistan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Tajikistan.svg/300px-Flag_of_Tajikistan.svg.png",
  "Tanzania": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/225px-Flag_of_Tanzania.svg.png",
  "Thailand": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_Thailand.svg/225px-Flag_of_Thailand.svg.png",
  "The Gambia": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_The_Gambia.svg/225px-Flag_of_The_Gambia.svg.png",
  "Togo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Flag_of_Togo.svg/243px-Flag_of_Togo.svg.png",
  "Tonga": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/300px-Flag_of_Tonga.svg.png",
  "Transnistria": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Transnistria_%28state%29.svg/300px-Flag_of_Transnistria_%28state%29.svg.png",
  "Trinidad and Tobago": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Flag_of_Trinidad_and_Tobago.svg/250px-Flag_of_Trinidad_and_Tobago.svg.png",
  "Tunisia": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/225px-Flag_of_Tunisia.svg.png",
  "Turkey": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/225px-Flag_of_Turkey.svg.png",
  "Turkish Republic of Northern Cyprus": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg/225px-Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg.png",
  "Turkmenistan": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Turkmenistan.svg/225px-Flag_of_Turkmenistan.svg.png",
  "Tuvalu": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tuvalu.svg/300px-Flag_of_Tuvalu.svg.png",
  "Uganda": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Flag_of_Uganda.svg/225px-Flag_of_Uganda.svg.png",
  "Ukraine": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/225px-Flag_of_Ukraine.svg.png",
  "United Arab Emirates": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/300px-Flag_of_the_United_Arab_Emirates.svg.png",
  "United Kingdom": "https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/300px-Flag_of_the_United_Kingdom.svg.png",
  "United States": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/285px-Flag_of_the_United_States.svg.png",
  "Uruguay": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/225px-Flag_of_Uruguay.svg.png",
  "Uzbekistan": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/300px-Flag_of_Uzbekistan.svg.png",
  "Vanuatu": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Vanuatu.svg/250px-Flag_of_Vanuatu.svg.png",
  "Vatican City": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_the_Vatican_City.svg/150px-Flag_of_the_Vatican_City.svg.png",
  "Venezuela": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/225px-Flag_of_Venezuela.svg.png",
  "Vietnam": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/225px-Flag_of_Vietnam.svg.png",
  "Yemen": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Flag_of_Yemen.svg/225px-Flag_of_Yemen.svg.png",
  "Zambia": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/225px-Flag_of_Zambia.svg.png",
  "Zimbabwe": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/300px-Flag_of_Zimbabwe.svg.png"
}

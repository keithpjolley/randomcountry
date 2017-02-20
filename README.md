# Random Country

Based on Alexa Weather Forecaster, as demo to show how to create
an [Amazon Alexa (Echo)
Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit).

## what
This project is a node service that returns, through html/http/alexa,
the name of a random country from a static list of countries originally
from
<a href="https://en.wikipedia.org/wiki/Gallery_of_sovereign_state_flags">
Wikipedia</a>. The first iteration did a pull from 
<a href="http://country.io/data/">country.io</a> but I liked having the
flags and the simplicity of a static list. The downside is that pulling
the data from the other site was cool and put the burden of keeping 
the data up to date on someone else. I don't assume that this list is
authoritative or the best, but they do have a flag. :)


## how
```
% git clone
% cd randomcountry
% npm install
% node .
% test/test2.sh
% curl http://localhost:8889/[index.html|index.json|alexa]
```

## why
An interesting side note (to me). The genesis of this project is
that I was noodling on how to migrate an existing project to
javascript. I was screenscraping using python/beautifulsoup and
wished that there was an API for the data I needed. I was also
working on getting an object from an object of objects when my
daughter walked in and said "Dad! What's the name of a random
country?! Hurry!".

I got the first version online, using express, when I saw that
Amazon was giving away hoodies for new Alexa skills. We have an
Alexa so this seemed like a perfect opportunity.

I originally made a generic node express web page with html and
json output, then extended it to serve Alexa, however, no security
meant it couldn't pass Amazon's certification process.  When I added
security the code became so ugly I rewrote from the Weather Forecaster
base code. It seems verifying the POST is coming from Alexa could
be optional - no state secrets in this particular skill.

### keith
© 2017 -- Jamul Heavy Industries, LLC<br/>
MIT License

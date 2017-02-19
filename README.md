# Random Country

Based on Alexa Weather Forecaster, as demo to show how to create
an [Amazon Alexa (Echo)
Skill](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit).

## Why
I had no problem creating a working Alexa skill. All I did was
extend my existing "Random Country" node script. My first iteration
of "Random Country" already had an API (fancy terminology for "it
returned JSON or HTML") so all I had to do is extend the json output
into something Alexa could use, create the skill with a few phrases,
and voila!, it worked.

However, Amazon wouldn't certify it because they said it wasn't
secure because API requests could come from anywhere, not just from
Amazon. I really didn't care because the API was already open to
anyone anyways.  But, I do want to have it certified so I had to
include checking certs are valid. I'm a big fan of copying other
people's code whenever possible but all of Amazon's examples pushed
you towards using Lambda where that step is done for you. Lamda is
super cool but I didn't want to have yet another service to manage
so I just wanted to run in node on a host with all my other stuff.

To make things more difficult the Alexa Skill self-service testing
doesn't bother testing for valid certs.

## how
```
% cd somewhere
% git clone git@github.com:keithpjolley/randomcountry.git <or whatever>
% cd randomcountry
% npm install
% node .
% curl http://localhost:8889/[index.html|index.json|alexa]
```

I've submitted to the Alexa gods and will report back what they say
and keep iterating until it is accepted.

### keith

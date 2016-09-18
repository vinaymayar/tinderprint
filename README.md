Tinderprint
===========

Tinderprint is a dating app that matches you with people based
on true physical and spiritual compatibility.  For millenia,
handreaders have been using fingerprints to characterize people's
personalities and to predict major life events.  Tinderprint uses
a neural net to analyze the unique qualities of your fingerprint.
We use these qualities to match you with people with compatible
personalities, helping you get to your next major life event <3.

Tinderprint uses a convolutional neural network trained on a public data set
to identify the prominent features of your fingerprint.  According to thousands of years
of fingerprint reading, the presence of loops reveals your
intelligence and demeanor, the presence of whorls indicates your will and conviction,
and the presence of arches
exposes your pragmatism and stubbornness.  We use a similarity metric across
these features and more to help you find partners you'll be compatible with.

## Running the app

To run an instance of Tinderprint, download the latest versions of npm
and mongo.  Run mongo in the background (on port 27107), install the
app's dependencies, and run the app.  You can then access the app at
localhost:3000.  You may have to reinstall some pip packages to run
the classifier.

```
mongod &
npm install
npm start
```

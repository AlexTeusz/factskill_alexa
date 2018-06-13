<h1>Amazon Alexa Fact Skill - Education</h1>

For Educational Use Only



**Helpful Links**

1. [Amazon Alexa Seite](https://developer.amazon.com/de/alexa) 
2. [Was ist ein Custom Skill?](https://developer.amazon.com/de/docs/custom-skills/understanding-custom-skills.html) 
3. [Alexa Cookbook (Node.js Skillbeispiele)](https://github.com/alexa/alexa-cookbook) 
4. [Amazon AWS Console](https://aws.amazon.com/de/console/) 



<h2>Lambda</h2>

**Language Strings**

The variable  <u>languageStrings</u> stores all sentences Alexa should say to the user. The idea is to declare all strings in one variable to give the programmer the possibility to change this stuff easy for the whole program. The second advantage of language strings is the fact that you can declare the sentences for multiple languages in this variable, so that Alexa will understand what she should use if the Skill is published in mulitiple languages.

The <u>languageStrings</u> looks like the following: 

```
const languageStrings = {
    "de": {
        "translation": {
            "WELCOME": "Willkommen im Fakten Skill über platonische Graphen. Frag nach einem platonischen Körper oder lass dein Wissen abfragen. Viel Spaß!",
            "WELCOME_REPROMPT": "Sage zum Beispiel 'Was ist ein Hexaeder' oder 'Frag mich ab'.",
		... 
    },
};
```

The "de" says, that the following strings are made for the german language. In the later code you have to say Alexa which strings she should use for the interaction: 

```
exports.handler = (event, context) => {
	...
    alexa.resources = languageStrings;
	...
};
```



**Intents**

The [Intents](https://www.youtube.com/watch?v=ymixpC53c-s) are implemented in the <u>handlers</u> constant. You can imagine that each Intent is a function in our code which makes a special thing for our user. For example the **LaunchRequest** welcomes the user to our skill and tells him what he can do: 

```
const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t("WELCOME");
        const repromptSpeechOutput = this.t("WELCOME_REPROMPT");
        this.response.speak(speechOutput).listen(repromptSpeechOutput);
        this.emit(":responseReady");
    },
    ...
}
```

Here we see how you use the <u>languageStrings</u> in our code. It looks more difficult than it is because the only functionality behind this code is to say the following: 

*"Willkommen im Fakten Skill über platonische Graphen. Frag nach einem platonischen Körper oder lass dein Wissen abfragen. Viel Spaß!"* 

In english: *Welcome to Fact Skill about planotic bodies. Ask for a platonic body or let me ask you some questions. Have fun!*

The following three [Intents](https://developer.amazon.com/de/docs/custom-skills/create-intents-utterances-and-slots.html#create-intent) are so called [Built-In Intents](https://developer.amazon.com/de/docs/custom-skills/create-intents-utterances-and-slots.html#create-intent) which are made by Amazon to control the interaction between Alexa and the user. You have to implement them to publish your Skill in the [Alexa Skills Store](https://www.amazon.de/b?ie=UTF8&node=10068460031). These Built-In Intents are: 

- AMAZON.HelpIntent
- AMAZON.CancelIntent
- AMAZON.StopIntent

Like the names say these Intents implement what Alexa should say if the user needs help, wants to stop the skill session or wants to cancel a dialog or something else.



<u>FactIntent</u>

This Intent gives the user information about several platonic bodies like the hexaeder. 
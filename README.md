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

This Intent gives the user information about several platonic bodies like the hexaeder. The both variables `thingSlotRaw` and `thingSlot` store the [SlotValue](https://developer.amazon.com/de/docs/custom-skills/define-synonyms-and-ids-for-slot-type-values-entity-resolution.html) of our Slot which we created in the [Interaction Model](https://developer.amazon.com/de/docs/alexa-voice-service/interaction-model.html) (Developer Console). The first variable just stores the raw String like "hexaeder". If we use a synonym like "cube" we have to use the second variable because here we use the method called `revolveCanonical()` which also searches for the synonyms of our slot. To get our fact for the users question, we use `var antwort = getInformation(thingSlot);`.  This method uses a switch clause to find out which answer is the right for our question and just returns the chosen string. If the question isn't in our set of answers, Alexa answers: *"Puh da bin ich aber überfragt."*.  The last part of this intent is to create a conversation with Alexa, so that she says the answer to the user. 



<u>QuizIntent</u>

Our second non built-in Intent is the QuizIntent, which gives the user the possibility to test his or her knowledge about platonic bodies. If the user says *"Alexa, sag fakten wisser frag mich ab."* (eng. "Alexa, say fakten wisser ask me questions.") Alexa generates a random question and asks the user. To generate this question we use the method `var question = getQuestion();` which returns a dictionary. This dictionary looks like this: `{"question": "Be or not to be", "answer": "yes"}`. For every question it gives us the question as a string and the right answer. In the QuizIntent we also just create the conversation to ask the user and wait for the users answer. 

<u>AMAZON.YesIntent / NoIntent</u>

This two Intents are used in the QuizIntent. When Alexa asks a question the user has to answer yes or no. The built-in Intents YesIntent and NoIntent are good handlers for this task. In both Intents we store the answer of the asked question. If the answer is "yes" in the YesIntent the user was right. With `this.emit(":tell", "Richtig! Du hast die Frage richtig beantwortet.")` Alexa says that the user was right. 

<u>UnhandledIntent</u>

This last Intent has just one excercise. If the user says anything incomprehensible, Alexa says that she couldn't understand what he or she said. *"Ich glaube Sie nicht richtig verstanden zu haben. Bitte wiederholen Sie Ihren Befehl."*



<h2>Model</h2>

[Voice User Interface](https://developer.amazon.com/de/alexa-skills-kit/vui) or Interaction Model declares how the user has to interact with Alexa to get what he / she wants. For example, the user has to say *Alexa, frag fakten wisser frag mich ab* to call the QuizIntent. In the <u>de-DE.json</u> this looks like this: 

```
 {
          "name": "QuizIntent",
          "samples": [
            "lass mich mein wissen zeigen",
            "frag mich bitte ab",
            "ich bin bereit für einen test",
            "teste mich",
            "stell mir fragen",
            "frag mich ab",
            "starte das quiz",
            "starte quiz",
            "starte ein quiz"
          ]
        }
```

We have a JSON format that gives Alexa all information. The intent's name and the sample sentences, also called [Utterances](https://developer.amazon.com/de/docs/custom-skills/best-practices-for-sample-utterances-and-custom-slot-type-values.html#sample-utterance-phrasing). In the best case you create 15 or more utterances to give Alexa a large base to machine learn.

<u>SlotType</u>

In the FactIntent we use the slot `thing`. Every slot needs a type for comparing the users text with our list. For the thing slot the type looks like this: 

```
types": [
        {
          "values": [
            {
              "name": {
                "value": "icosaeder",
                "synonyms": [
                  "icosaedern"
                ]
              }
            },
           ...
            {
              "name": {
                "value": "platonische graphen",
                "synonyms": [
                  "platonische körper",
                  "platonischen körpern",
                  "platonischen graphen",
                  "platonischer körper",
                  "platonischer graph"
                ]
              }
            }
          ],
          "name": "plats"
        }
      ]
```



<h2>Contact</h2>

If you have any questions or remars, just contact me.

Mail: teusz.alexander@gmail.com


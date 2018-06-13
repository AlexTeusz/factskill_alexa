"use strict";

const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.a0139d3c-dede-4590-baf3-691eefaeca73";

const languageStrings = {
    "de": {
        "translation": {
            "WELCOME": "Willkommen im Fakten Skill über platonische Graphen. Frag nach einem platonischen Körper oder lass dein Wissen abfragen. Viel Spaß!",
            "WELCOME_REPROMPT": "Sage zum Beispiel 'Was ist ein Hexaeder' oder 'Frag mich ab'.",
            "HELP_MESSAGE": "Mit diesem Skill kansnt du Fakten über platonische Körper lernen und dein Wissen abfragen.",
            "STOP_MESSAGE": "Ciao. Ich wünsche dir noch einen schönen Tag.",
            "UNHANDLED_MESSAGE":"Ich glaube Sie nicht richtig verstanden zu haben. Bitte wiederholen Sie Ihren Befehl.",
            "FAIL":"Leider ist ein Problem aufgetreten. Bitte versuchen Sie es erneut.",
            "ANSWER": "%THING%.",
            "QUESTION": "Okay. Hier ist die Frage. Bitte beachte, dass es sich um eine Ja, Nein Frage handelt. %QUESTION%",
            "QUESTION_REPROMPT": "Ich wiederhole die Ja, Nein Frage. %QUESTION%"
        },
    },
};


const handlers = {
    'LaunchRequest': function () {
        const speechOutput = this.t("WELCOME");
        const repromptSpeechOutput = this.t("WELCOME_REPROMPT");
        this.response.speak(speechOutput).listen(repromptSpeechOutput);
        this.emit(":responseReady");


    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t("HELP_MESSAGE");
        this.response.speak(speechOutput);
        this.emit(":responseReady");

    },
    'AMAZON.CancelIntent': function () {
        const speechOutput = this.t("STOP_MESSAGE");
        this.response.speak(speechOutput);
        this.emit(":responseReady");

    },
    'AMAZON.StopIntent': function () {
        this.emit('AMAZON.CancelIntent');
    },
    'SessionEndedRequest': function () {
        this.emit('AMAZON.CancelIntent');

    },
    'FactIntent': function () {

        let thingSlotRaw = this.event.request.intent.slots.thing.value;
        console.log(thingSlotRaw);
        // Muss genutzt werden, wenn Synonyme genutzt werden!!!
        let thingSlot = resolveCanonical(this.event.request.intent.slots.thing);
        console.log(thingSlot);

        var antwort = getInformation(thingSlot);
        this.response.speak(this.t("ANSWER").replace("%THING%", antwort));
        this.emit(":responseReady");

    },
    'QuizIntent': function () {
        var question = getQuestion();

        // 1. Variante
        //this.emit(':ask', "Okay. Hier ist die Frage. " + question, "Ich wiederhole die Frage. " + question);

        // 2. Variante mit Language Strings
        const speechOutput = this.t("QUESTION").replace("%QUESTION%", question["question"]);
        const repromptSpeechOutput = this.t("QUESTION_REPROMPT").replace("%QUESTION%", question["question"]);
        this.response.speak(speechOutput).listen(repromptSpeechOutput);
        this.emit(":responseReady");
    },
    'AMAZON.YesIntent': function () {
        var answer = getQuestion();
        if (answer["answer"] === "yes"){
            this.emit(":tell", "Richtig! Du hast die Frage richtig beantwortet.")
        }else{
            this.emit(":tell", "Du hast ja gesagt. Das stimmt leider nicht.")
        }
    },
    'AMAZON.NoIntent': function () {
        var answer = getQuestion();
        if (answer["answer"] === "no"){
            this.emit(":tell", "Richtig! Du hast die Frage richtig beantwortet.")
        }else{
            this.emit(":tell", "Du hast nein gesagt. Das stimmt leider nicht.")
        }
    },
    'Unhandled': function () {
        const speechOutput = this.t("UNHANDLED_MESSAGE");
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    },

};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    //alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function getQuestion() {
    return randomPhrase([{"question":"Kann ein Hexaeder mit einem Würfel verglichen werden?", "answer": "yes"}, {"question":"Hat ein Tetraeder 8 Ecken?", "answer": "no"}]);
}
function getInformation(platBody) {
    //Quelle: https://de.wikipedia.org/wiki/Platonischer_K%C3%B6rper
    switch (platBody.toLowerCase()){
        case "hexaeder":
            return "Das Tripel von Quadraten, die eine räumliche Ecke bilden, hat an seinem Rand sechs markante Punkte. An drei von ihnen stoßen vorerst je zwei Quadrate zusammen. Die dazwischen liegenden anderen drei Punkte sind nur je eine Quadrat-Ecke (Flächen-Ecke)";
            break;
        case "tetraeder":
            return "Das Tripel (die 3er-Gruppe) von gleichseitigen Dreiecken, die eine räumliche Ecke bilden, hat an seinem Rand drei Punkte, an denen vorerst je zwei Dreiecke zusammenstoßen. Eine vierte Dreieckfläche passt genau zwischen diese drei Punkte, an denen sie für deren Komplettierung zu räumlichen Ecken die jeweils erforderliche dritte Fläche darstellt. Als geschlossene Flächen-Gruppe ist die Hülle eines Tetraeders entstanden.";
            break;
        case "octaeder":
            return "Das Quadrupel (die 4er-Gruppe) von gleichseitigen Dreiecken, die eine räumliche Ecke bilden, ist die Oberfläche einer vierseitigen Pyramide abzüglich deren Bodenfläche. Der Rand am Boden enthält vier markante Punkte, an denen vorerst nur je zwei Dreiecke zusammenstoßen. An einem dieser Punkte werden zunächst beidseits je ein Dreieck angeschlossen, wodurch eine neue räumliche Ecke entsteht. ";
            break;
        case "icosaeder":
            return "Das Quintupel (die 5er-Gruppe) von gleichseitigen Dreiecken, die eine räumliche Ecke bilden, hat an seinem Rand fünf markante Punkte, an denen vorerst je zwei Dreiecke zusammenstoßen. An diese fünf Punkte lässt sich ein aus zehn Dreiecken bestehender Ring lückenlos und überschneidungsfrei anschließen.";
            break;
        case "dodekaeder":
            return "Das Tripel (die 3er-Gruppe) von gleichseitigen Fünfeckflächen, die eine räumliche Ecke bilden, hat an seinem Rand neun markante Punkte. An diesen neun Punkten kann ein aus sechs Fünfecken bestehender Ring lückenlos und überschneidungsfrei an das Tripel angeschlossen und neun weitere räumliche Ecken gebildet werden. Die Abwicklung dieses Ringes sind die in etwa eine horizontale Reihe bildenden sechs Fünfecke im oben abgebildeten Körpernetz. Der Ring hat an beiden Rändern die mit dem Tripel-Rändern korrespondierenden neun markanten Punkte, sodass ein gegenüber dem ersten Tripel positioniertes zweites Tripel auch an den Ring angeschlossen und eine geschlossene Oberfläche gewonnen werden kann.";
            break;
        case "platonische graphen":
            //Quelle: https://www.fernuni-hagen.de/MATHEMATIK/DMO/mitarbeiter/nickel/talk_steenbeck2005/steenbeck2005.pdf (Folie 9)
            return "Die Knoten des Graphens sind die Ecken eines Polytops, wobei zwei Knoten miteinander verbunden sind, wenn sie auf der Kante eines Polytops liegen. Dabei ist der Eckengraph eines Polytops planar.";
            break;
        default:
            return "Puh da bin ich aber überfragt.";
    }
}

function resolveCanonical(slot){
    //this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
    let canonical;
    try{
        canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }catch(err){
        console.log(err.message);
        canonical = slot.value;
    }
    return canonical;
}
function delegateSlotCollection(){
    console.log("in delegateSlotCollection");
    console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        let updatedIntent= null;
        // updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer

        //this code is necessary if using ASK SDK versions prior to 1.0.9
        if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
            shouldEndSession: false
        });
        this.emit(':responseReady', updatedIntent);

    } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer

        //this code necessary is using ASK SDK versions prior to 1.0.9
        if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', null, null),
            shouldEndSession: false
        });
        this.emit(':responseReady');

    } else {
        console.log("in completed");
        console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
    let slot = request.intent.slots[slotName];
    //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    let slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value.toLowerCase();
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}
# What is this blinky light thing?

The advances in real-time filtering on video and audio content have gotten us scared.  It won't be long before we can't "know" if there is actually a person on the other end of our video conference, or if a "live broadcast" is actually a live-streaming deep fake.  We are't just talking about the deep fakes that are already prevalent in our favorite media outlets, we are talking about interacting with someone who is actually someone else.  If you don't believe how close this is, check out the [adversarial model](link) that Ankur and Patrick have put together.

> [!Important]
> To be clear we are not saying that this technology is bad or even that it is being used with mal-intent, it is an evolution and it can have a lot of benefits - but if it is used to fool people we think that is dangerous.

Our goal with the blinky light thing (technically called the BLT) is to introduce elements of cryptography into the physical environment that is being recorded by audio/video capture devices.  This lets us bake cryptographic messages into the raw video and audio feed of the broadcast which become really difficult to modify later on.  Our intent is prove the broadcast is both
     **Authentic**: the person presenting is who they claim to be, and
     **Contemporaneous**: the broadcast is happening when the presenter claims it is happening

We have a full write up available on how it works and our motivations behind it that you can find [here](https://zeroth.technology/our_writings) on our blog site, but we think a video is much easier to understand.


```
INSERT VIDEO HERE
```

## How it works

The BLT makes heavy use of Ethereum Attestation Services - if you haven't heard about the great work they are doing go check it out at [attest.org](https://attest.org). There are three basic steps *(click on a step for more details)*.

![prepare present close](../assets/img/BLT_img/Prepare_Present_Close.drawio.svg)

```
the tiles above need to be clickable.  on click show a section beneath with more detail
```

### Prepare Text
First you need a BLT - you can build one with a raspberry pi but we prefer to use a lightweight ESP32 paired via blue tooth to our phone - [here](link) is a step by step tutorial.  If you want to skip that step you can buy one [here](link) or you can use your phone as the light source (but it doesn't work as well...).

Start a session by making an attestation using EAS.  This requires that you have a wallet - we have schemas defined for EAS on Etherum mainnet, Arbitrum, and Base.  The wallet will need to be tied to your public identity - there are several ways to do this (gitcoin passport, proof of humanity, worldcoin, etc) and there will continue to be more in the future.

The attestation includes the following data (I've included sample text below):

+ Full_Name: James Canterbury
+ BLT_Message_LED_Color: Blue
+ BLT_Termination_Color: Red
+ BLT_Blink_Rate: 0.05 Seconds
+ ~~BLT_Chirp_Amp: +20 kHz~~
+ Desciption*: "I am making a public statement"

The attestation returns a 64 character hexidecimal string which both serves as a pointer to the attestation and a unique ID that would be impossible to determine ahead of time.

> [!TIP]
> Creating the attestation using your wallet proves that it is the authentic you (assuming you control your keys and have used smme form of proof of personhood). The UID of the attestation uses the time stamp of the Ethereum block in which the attestation is posted - proving that your session is contemporaneous.

EAS returns a QR code that uses the UID to point to your attestation - you are now ready to present.

### Present Text

When you are ready to present make sure your phone is paired to your BLT - the lights should start blinking.  Position the BLT so that the light reflects off of your face, but not in a way that is distracting - your message is being transmitted.  You can now show your audience the QR code. Here you have the option to share the EAS UID QR code directly and let your audience plug it into their verification tool of choice, or you can incorporate it into a link that routes them to a pre-configured verification tool which will accesses the UID and pull in the BLT configurations automatically.  Depending on the tool the audience uses they will see continuous confirmation that the message being broadcast via the blinky light matches the UID.

Our tests show an optimal blink rate of .05 seconds - so you need to present for at least 51 seconds to transmit a full message...

### Close Text

Closing the session is optional, but it puts a nice wrapper around your presentation and lets any future replays verify that the recording has not been tampered with.  To do this the presenter will create a closing attestation on EAS which contains a hash of the recorded media file (we always recommend using the multi-hash format to allow anyone to interpret the hash) and a reference to the session UID (this is done using native EAS functionality). It's pretty simple, it looks like this:

+ Media_Hash: 122041dd7b6443542e75701aa98a0c235951a28a0d851b11564d20022ab11d2589a8
+ Session_UID_Reference: 0x144fec63505680f8f0a6dee7e3b16f0f147715586aa0fe6e7ee65b940d23c570

If you happen to be storing your recordings on a decentralized network such as Filecoin, you the media hash can also be the Content Identifier which can be used to access the video later on.  

Once complete - by just providing the closing attestation UID you can give any potential future viewer of your recorded session the ability to verify that A) it was in fact you B) you made this recording when you stated that you did C) you haven't modified anything about the recording since you posted it.

> [!Tip]
> pretty much everyone wants to make edits post production - if for no other reason that to compress the file for easier sharing.  For this we suggest inputting the closing UID into a tracking methodology such as C2PA.

## Help us prevent live streaming deep fakes
We built the BLT for you to use it.  We will always give options for it's use free of charge (or at least as minimal as the gas fees for making an attestation).  
> If you like it $\rightarrow$ you can buy us a cup of coffee.  
> If you want to incorporate it into your day-to-day $\rightarrow$ we are working on some services to make it super easy for you to use.  
> If you are not into web3 ("crypto wallet what?") $\rightarrow$ we also have services to cover you.

But most importantly we want you to contribute and help BLT evolve.  The code for running a BLT and for verifying it is completely open source.  Check out out github repo [here](link).  Give us feedback, try to break it, help us figure out what's next...
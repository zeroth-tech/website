# Vero: Real-Time Peer-to-Peer Authentication

<div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
  <img src="vero-assets/presenter.gif" alt="Vero Presenter View" width="300">
  <img src="vero-assets/verifier.gif" alt="Vero Verifier View" width="300">
</div>

## Seeing Isn't Always Believing Online

In today's digital world, it's getting harder to know if what you see in a live video is real. Advanced "deepfake" technology can make videos look incredibly convincing, even when they're completely fabricated or impersonating someone else. This makes it tough to trust live streams, whether it's a news report, a business meeting, or a call with a loved one.

**(Suggestion: A simple visual contrasting a real video feed with a deepfaked one.)**

## The Problem with... Fakes

Deepfakes aren't just for fun; they can be used to spread misinformation, commit fraud, or damage reputations. Current ways to detect fakes often rely on complex software that's expensive and might only tell you *after* the fact that a video was fake. Plus, they usually can't confirm if the person in the video is *really* who they claim to be, right now.

## The Problem with... Authentication

Sometimes it seems like we authenticate into a hundred systems every single day - the more time we spend online, the more systems we need to log into. Multi-factor authentication is an important advance in protecting our digital identities. Admittedly this is annoying, but what is a minor hassle for *us* is a major barrier for a *hacker*. Though, even with the most secure login protocols we are always authenticating "into something" - that something is a system or platform that someone else controls. For me to know that I'm talking to you, we both need to trust the system.

## The Problem with... Digital Identity

Authentication and digital identity go hand in hand.  For many years, every system we logged into maintained its own record of our identity. It didn't take too long for us to realize how inefficient this actually is; that's why today you can log in to many sites using "Sign In with Google" or "Log in with Facebook" or "Use Apple PassKey".  While these are convenient, they are clearly not sufficient for all of our identity needs - This is why there are hundreds of individual identity providers, some of which enroll you with government systems some of which are used to prove you are a qualified investor.  These solutions didn't fix the problem, they just consolidated it down to a smaller pool of options.

Web3 wallets, decentralized identities, and verified credentials do offer a solution; but these are often complex and are not widely adopted (yet).   In our roadmap, Vero does it's mart in bringing these technologies mainstream.

## Vero: A Simple Idea for Real-Time Trust

Vero offers a new, straightforward way to prove a live video stream is authentic and happening in real-time.  It is a way of using your available forms of identity to authenticate directly "with someone" not "into something". 

**How it Works:**

Imagine a tiny, secure code embedded directly into the video you're watching. Vero does this using a simple blinking light (like a secret Morse code) reflected off the presenter's face.

1. **Get a Code:** The presenter gets a unique, secure code linked to their identity (they can choose how they prove who they are).
2. **Blink the Code:** A small light source (like an app on their phone or a dedicated device) blinks this code using colors (red, green, blue). This light reflects off their face and is captured by the camera.
3. **Verify Instantly:** Anyone watching can use a simple tool (like a browser extension or a mobile app) to read the blinking light pattern and instantly check if the code matches the presenter's claimed identity.

If you only wish to verify yourself to a specific individual, then that person plays a role in creating the code. And the entire verification process can be encrypted between just you and them. 

**Why It's Hard to Fake:**

- **It's Physical:** The code is part of the real-world scene being filmed, not just digital data added later.
- **It's On Their Face:** The light pattern is mapped directly onto the presenter, making it extremely difficult for a deepfake filter to replicate accurately in real-time.
- **It's Secured:** The code is cryptographically signed, linking it securely to the presenter's identity.

> **Vero makes it incredibly hard to fake a live video feed because the proof of authenticity is literally shining off the presenter's face.**

## Using Vero: Simple for Everyone

Vero is designed for two main roles:

- **Presenters:** Use a light source (a mobile app or a small physical device) to broadcast their unique Vero code during their live stream.
- **Viewers:** Use a tool (a browser extension or mobile app) to easily detect and verify the code in the video they are watching.

**(Suggestion: Simple icons representing a Presenter with a light/phone and a Viewer with a browser/phone.)**

## Built on Trust and Openness

Vero is designed with core principles in mind:

- <img src="vero-assets/peer-to-peer.svg" alt="Peer-to-Peer Icon" width="64" style="vertical-align: middle;"> **Peer-to-Peer:** No central identity storage. Verification happens directly between people.
- <img src="vero-assets/secure.svg" alt="Secure Icon" width="64" style="vertical-align: middle;"> **Secure:** Relies on strong cryptographic methods to keep things safe.
- <img src="vero-assets/byo-identity.svg" alt="BYO Identity Icon" width="64" style="vertical-align: middle;"> **Bring Your Own Identity:** Works with various existing ways people prove their identity online.
- <img src="vero-assets/selective-disclosure.svg" alt="Selective Disclosure Icon" width="64" style="vertical-align: middle;"> **Selective Disclosure** Only share what you want when you want.

## The Future is Authentic

Vero is just the start. We're exploring ways to add more features to enhance trust and prove "humanness" online, like:

- Integrating location or biometric checks (privately, of course!).
- Building Vero directly into popular video conferencing tools.
- Developing ways to build a trustworthy online reputation that works for both humans and AI Agents.

## Conclusion

In an age of easy digital fakes, Vero provides a vital tool for restoring trust in live video. By cleverly using light and cryptography, it offers a simple yet powerful way to know that who you're seeing is real, and what you're watching is live. Vero helps ensure that seeing can once again be believing.


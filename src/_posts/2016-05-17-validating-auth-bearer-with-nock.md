---
layout: post
title: Testing auth bearer headers with nock.
summary: A bit tricker but not impossible.
categories: [Node.js, JavaScript]
header_img: https://c2.staticflickr.com/8/7531/26431307433_fc6fe65ac4_h.jpg
header_img_id: 26431307433
background_position: 0px 80%
---

I'm in the process of writting a client for an api. One of the requirements is that the client can run in both the browser and the back-end (node) and we need to authenticate using [Jason Web Tokens](https://jwt.io/)

I usually like to test against the real API unless there is either a big latency or a security concern on having credentials around.

In this particular case, security is a concern, so the risk to commit credentials is high.

There are several options to test the client but I decided to try [nock](https://github.com/node-nock/nock)

Nock is a library that will intercept HTTP calls and will return pre-defined responses if the request matches a series of criterias.

It can be as simple as matching in domain and resource, or as complicate as include headers and payload as part of the match.

Nock also includes a very neat feature that I haven't use yet but plan in the future and that is to record real interacctions with a back-end, and being able to reuse the responses from that moment on in your tests.

### Testing auth headers for JWT

The JWT can be send in multiple forms but our api is expecting to receive it in the headers, under the auth hearer in the bearer key.

```
auth: {
  bearer: dfdsfHKLUgMBlkhgkjhsd09e1...
}
```

My first with to verify another header a public key that is send in `X-API-KEY` header. That was easy to do.

Once I have to veridy the `bearer` token I started to get into trouble.

Nock didn't match, the problem seems to be that Nock is not expecting anything other than Basic Auth data under the `auth` header.

### Using functions to match headers.

Nock provides the option to match a header exactly, by a regexp or just passing a function as the header key.

The function will receive the headerValue and you can perform any validation inside the function and return `true` or `false` to indicate success or failure.

That sounded promising, so I did pass a function as the value for `auth` while setting up the nock interceptor, but it didn't work.

The value given to the function is given as a String, and since the actual value is a an `Object` I was receiving the infamous `[object Object]`.

### Using a nock event

Nock also emits a few events, the one I care about was the "no match" event.

I decided to give a try and put my expectation inside the event handler for that event.

It worked.

But I had to also clean all event listeners since I run the test in watch mode and subsequent runs will fail (and probably run into the "too many listeners" warning from node).

It's not the most elegant solution but it works. I will dig deeper once I have some time to try to find a better way.

I found a nock plugin or extension published on [npm that seems to work with OAuth](https://www.npmjs.com/package/nock-github-oauth), I will probably take a look at it to see if there is a way to plugin into Nock.

Full code for the test below:

```
  it("should send a request to the baseUrl with the token", (done) => {
    const apiKey = chance.hash(),
      token = chance.hash(),
      headers = {"x-api-key": apiKey, "auth": {"bearer": token}},
      client = new Transport({headers});

    // The "magic" happens here, nasty but effective
    nock.emitter.on("no match", (req) => {
      expect(req._headers.auth.bearer).to.be.eql(token);
      nock.emitter.removeAllListeners("no match");
      done();
    });

    nock(baseUrl, {
      reqheaders: {
        "X-API-KEY": apiKey,
        auth: {
          bearer: token
        }
      }
    })
    .get("/resource")
    .reply(200);

    client.get(`${baseUrl}/resource`);
  });
```

### Conclusion

I like Nock, and even when I run into this issues, the library is very flexible and there is a way around the problems.

With more time using it, I will probably find a better way. I'm particularly looking forward to use the Record/Playback features.

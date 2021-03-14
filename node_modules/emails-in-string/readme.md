# Emails in String ✉️

[![Build Status](https://travis-ci.org/azcn2503/emails-in-string.svg?branch=master)](https://travis-ci.org/azcn2503/emails-in-string)

Extract unique email addresses out of just about any string!

### How to use

```js
import emailsInString from "emails-in-string";

const uniqueEmails = emailsInString(`user@domain.com,
  "User at Domain" <user@domain.com>, user2@domain.com,
  user+something@domain.com`);
// ["user@domain.com", "user2@domain.com", "user+something@domain.com" ]
```

Enjoy!

### Tests

A suite of tests can be found in the [./__tests__](__tests__) directory and can be executed by running `npm run test`.

# Salling Group Jobs SDK
This SDK simplifies the process of querying Salling Group's open job positions.
Salling Group owns Netto, Føtex, Bilka, Salling, and more.
Through this SDK you will be able to find information about open job positions.
The requests are made through the Salling Group API which can be found [here](https://developer.sallinggroup.com/).

You can get your credentials through the [developer portal](https://developer.sallinggroup.com/).

## Getting Started.
The SDK heavily relies on `Traverser`s. You can read more about them [here](https://www.npmjs.com/package/@salling-group/pagination-traverser).

The following example gets names of all Netto job openings in the ZIP code 8200.
You will need to get a JWT secret or Bearer token with access to the Jobs API from the [developer portal](https://developer.sallinggroup.com/). 
```js
const Jobs = require('@salling-group/jobs');
const instance = new Jobs({
  'auth': {
    'token': 'my_token',
    'type': 'bearer',
  },
});

const traverser = instance.beginQuery()
  .ofBrand('netto')
  .inZIP(8200)
  .pick('title', 'address')
  .execute();

traverser.get().then((page) => console.log(page));
``` 
This prints:
```json
[
  {
    "title": "Butiksassistent under 18 år - Aarhus N",
    "address": { 
      "city": "Aarhus N",
      "country": "DK",
      "street": "Finlandsgade 15",
      "zip": "8200"
    }
  },
  {
    "title": "Butiksassistent under 18 år - Aarhus N",
    "address": { 
      "city": "Aarhus N",
      "country": "DK",
      "street": "Randersvej 116-118",
      "zip": "8200"
    }
  },
  {
    "title": "Souschef - Aarhus N",
    "address": 
     { "city": "Aarhus N",
       "country": "DK",
       "street": "Finlandsgade 15",
       "zip": "8200"
     }
  }
]
```

## Documentation
### `constructor(options)`
This initializes a new Jobs SDK object.
`options` must be an object containing an `auth` object with the following contract:

|Property|Value|Required|Description|
|--------|-----|--------|-----------|
|`type`|`'jwt'` or `'bearer'`|Yes|The authentication type. This is either a JWT or a Bearer Token.|
|`token`|`String`|If `type` is `'bearer'`.|The token associared with the bearer token credentials.|
|`email`|`String`|If `type` is `'jwt'`.|The email associated with the JWT credentials.|
|`secret`|`String`|If `type` is `'jwt'`.|The secret associated with the JWT credentials.|

`applicationName` should be set in the `options` object, but this is optional.
(This value will be sent in the UserAgent during requests.)

Example:
```js
const Jobs = require('@salling-group/jobs');
const instance = new Jobs({
  'applicationName': 'My Application v1.0.0',
  'auth': {
    'type': 'jwt',
    'email': 'my_email',
    'secret': 'my_secret'
  },
});
```

### `get(jobID)`
This gets the open job position with the given ID.

Example:
```js
const jobData = await instance.get('3764efcb-4a7a-4d30-a274-7cefa0dce797');
```

### `getAll()`
This  gets all jobs.

Example:
```js
const traverser = instance.getAll();
const page = await traverser.get();
```

### `beginQuery()`
This begins a query for jobs.
This should be followed by a chain of these commands:

|Method|Description|Example|
|------|-----------|-------|
|`pick(field1, field2, ...)`|Only returns the given fields.|`.pick('id', 'name')`|
|`ofBrand(brand)`|Returns jobs from the given brand.|`.ofBrand('netto')`|
|`inCity(city)`|Returns jobs in the given city.|`.inCity('Risskov')`|
|`inZIP(zip)`|Returns jobs located in the given ZIP code.|`.inZIP(8200)`|
|`inCountry(country)`|Returns jobs located in the given country code (ISO 3166-1 alpha-2).|`.inCountry('dk')`|

The chain should be ended with `.execute()`.
This will return a `Traverser` for the query.

Example:
```js
const traverser = instance.beginQuery()
    .ofBrand('netto')
    .inZIP(8200)
    .pick('title', 'id')
    .execute();
// This will return title and ID of Netto jobs in the ZIP code 8200.
const page = await traverser.get();
```
### `query(params = {})`
This queries the Jobs API directly and returns a `Traverser`. (See [this](https://www.npmjs.com/package/@salling-group/pagination-traverser) for more informaton.)
`params` is the search parameters.
This is mostly used internally.

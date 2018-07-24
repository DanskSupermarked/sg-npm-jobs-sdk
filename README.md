# Salling Group Jobs SDK
This SDK simplifies the process of querying Salling Group's open job positions.
Salling Group owns Netto, Føtex, Bilka, Salling, and more.
Through this SDK you will be able to find information about open job positions.
The requests are made through the Salling Group API which can be found [here](https://developer.sallinggroup.com/).

You will need the module `sg-base-sdk` in order to authenticate.
You can get your credentials through the [developer portal](https://developer.sallinggroup.com/).

## Getting Started.
The following example gets names of all Netto job openings in the ZIP code 8200.
You will need to get a JWT secret or Bearer token with access to the Jobs API from the [developer portal](https://developer.sallinggroup.com/). 
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const JobsSDK = require('sg-jobs-sdk');
const instance = new JobsSDK(SallingGroupAPI.bearer('my_token'));

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
### `constructor(api)`
This initializes a new Jobs SDK object.
`api` must be an instance returned by `sg-base-sdk`.

Example:
```js
const { SallingGroupAPI } = require('sg-base-sdk');
const StoresSDK = require('sg-jobs-sdk');
const instance = new StoresSDK(SallingGroupAPI.jwt('my_email', 'my_key'));
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
This queries the Jobs API directly and returns a `Traverser`. 
`params` is the search parameters.
This is mostly used internally.

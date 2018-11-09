# GraphQL
A graphql full stack example on how to connect a UI to an API

# UI 

```
cd ui
npm install
npm start
```

navigate to localhost:4000


# API

```
cd api
npm install
npm start
```

navigate to localhost:4000

example queries:

```
query getLifts {
  allLifts {
    id
    name
    status
  }
}

mutation setLiftStatus {
  setLiftStatus(id:"astra-express" status:HOLD) {
    status
  }
}
```

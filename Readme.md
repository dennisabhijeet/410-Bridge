# 410 Bridge APP API test

## Folder Structure

```
server
  - __test__
  - api
    |- user
      |- user.model
      |- user.helper
      |- user.controller
      |- user.routes
  - config
  - handelers
    |- errorHandler
    |- image
  - images
  - middleware
  - uploades
  - util
    |- db
      |- migration
      |- seed
```

## Project setup

```bash
npm install
```

### Seed Mock Data for Development

```bash
npm run seed:dev
```

### Compiles and hot-reloads for development

```bash
npm run dev
```

### Compiles and minifies for production

```bash
npm start
```

### Run your unit tests

```bash
npm run test
```

\*\* NB: if you are using mySQL >= 5.7.5 please run this code in MySQL console.

```sql
SET GLOBAL sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION";
SET SESSION sql_mode="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION";
```

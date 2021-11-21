# MinishCap Service

A short link service

## Prerequisites

- MongoDB
- Redis
- Node

## Develop

### Step 1

```bash
$ git clone https://github.com/ecmadao/minishcap-service.git
$ cd minishcap-service
$ npm i
```

### Step 2

- Ensure your MongoDB and Redis service is running
- Check the DB storage configuration is correct in `src/config/env/development.yaml` file
- By default, we will use 27017 port for MongoDB and 6379 port for Redis in localhost

### Step 3

```bash
$ npm run start-dev
# Then open browser with URL http://localhost:3334/api/v1/
```

## APIs

### Generate short link

Request

```bash
POST /api/v1/urls
```

Body

```json
{
    "urls": [
        {
            "url": "your URL here",
            "ttlInSeconds": 60 // Time to live in seconds. Set anything < 0 (like -1) if it has no expire time
        }
    ]
}
```

## Deploy

TODO

# Minishcap Service

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

Request:

```bash
POST /api/v1/urls
```

Body:

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

Response:

```json
{
    "success": true,
    "result": [
        {
            "short": "the short url",
            "raw": "the raw url",
            "expiredAt": "expiration datetime"
        }
    ]
}
```

## Deploy

### Prerequisites

Check your configuration in production: `./src/config/env/production.yaml`

### Scheduler

I also build a scheduler to free expired short ids, release them into Redis set.
Thus, everytime before we need to create a new short id, we can check if can use the old one.

You can find the scheduler here: [minishcap-scheduler](https://github.com/ecmadao/minishcap-scheduler), written in pure TypeScript.

Hint: It's totally okay not use the scheduler in your project.

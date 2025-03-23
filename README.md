# my-Tasks-api

This is the frontend module of the `my-Tasks` project, a small _to-do_ App for creating and tracking tasks and managing their status (_To Do_, _In Progress_, _Completed_).

The `my-Tasks` project hast two modules (repositories:

- [`my-Tasks-web`](https://github.com/pawsaw/my-tasks-web): the frontend project, a so called _Single Page App (SPA)_ build with [Vite and the _react-ts_ template](https://vite.dev/guide/#scaffolding-your-first-vite-project), to be deployed to [Amazong S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html).
- `my-Tasks-api`(**this module/ repository**): the _RESTful api_, providing an endpoint for managing tasks (CRUD operations). This module is to be deployed to [AWS Lambda](https://aws.amazon.com/lambda/) with [Amazon API Gateway](https://aws.amazon.com/api-gateway/) in a proxy configuration. The data is stored and managed in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

A live demo version is deployed to: https://5rr3o0vvq1.execute-api.us-east-1.amazonaws.com/api/tasks

## Configuration

### local development

1. Clone the project and install its dependencies:

```sh
git clone https://github.com/pawsaw/my-tasks-api.git
cd my-tasks-api
npm install
```

2. Build in incremental watch mode:

```sh
npm run build:dev
```

You can also try to run the api localy. However, further configuration might be required (like having `java` installed properly).

**Not required:**

```sh
npm run start:dev
```

## Deployment to _AWS_

The following deployes the _RESTful api_ to [AWS Lambda](https://aws.amazon.com/lambda/) with [Amazon API Gateway](https://aws.amazon.com/api-gateway/) in a proxy configuration. The data is stored and managed in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/).

### Sign in to AWS

Sign in through the _AWS Command Line Interface_, as described [here](https://docs.aws.amazon.com/signin/latest/userguide/command-line-sign-in.html).

Hint:
Go to `IAM` in [AWS Console](https://eu-north-1.signin.aws.amazon.com/) to create access keys and than type into the terminal:

```sh
% aws configure
AWS Access Key ID [****************QWIX]:
AWS Secret Access Key [****************yrcD]:
Default region name [eu-north-1]:
Default output format [None]:
```

### Build the distribution

```sh
npm run build
```

### Deploy

```sh
npm run aws:deploy
```

A session typicaly looks like this:

```sh
% npm run aws:deploy

> my-tasks-api@1.0.0 aws:deploy
> serverless deploy


Deploying "my-tasks-api" to stage "dev" (us-east-1)

✔ Service deployed to stack my-tasks-api-dev (73s)

endpoint: ANY - https://5rr3o0vvq1.execute-api.us-east-1.amazonaws.com
functions:
  api: my-tasks-api-dev-api (63 MB)
```

At this point: 🚀 Hurra! We're online. 🎉 🥳

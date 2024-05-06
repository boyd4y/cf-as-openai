## Template: cf-as-openapi

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/boyd4y/cf-as-openai)

This template demonstrates using the [`cf-as-openai`](https://github.com/boyd4y/cf-as-openai) template to expose Cloudflare AI workers with OpenAI API Standard.


## Setup

clone the repo to run:

```sh
$ git clone https://github.com/boyd4y/cf-as-openai.git
$ npm i
# or
$ pnpm i
```

## Local development

Run `wrangler dev` and head to `/docs` our `/redocs` with your browser.

You'll be greeted with an OpenAPI page that you can use to test and call your endpoints.

## Deploy

Once you are ready, you can publish your code by running the following command:

```sh
$ wrangler publish
```
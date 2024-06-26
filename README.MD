## cf-as-openapi

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/boyd4y/cf-as-openai)

This repository demonstrates using the [`cf-as-openai`](https://github.com/boyd4y/cf-as-openai) template to expose Cloudflare AI model workers as OpenAI Standard API.  
Which means you can use Cloudflare beta model for free.

## Local development

[Click here to get CloudFlare API Tokens](https://dash.cloudflare.com/profile/api-tokens)

```
export CLOUDFLARE_API_TOKEN=<your CF api token>
npm run dev
```

You'll be greeted with an OpenAPI page that you can use to test and call your endpoints.

## Manually Deploy
We recommend you just click the button on the top to deploy to CF in seconds.
By the way, you could also deploy manually by your self
Once you repo ready, you can publish your code by running the following command:

```sh
$ git clone https://github.com/boyd4y/cf-as-openai.git
$ npm i
$ npm run deploy
```

## How to use
```
curl <your cf worker endpoint>/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your cf api key>" \
  -d '{
    "model": <your cf model>,
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": true
  }'

```

## Environment
- API_KEY, defined in wrangler.toml, default is cf-123456789.  same like openai api key.
- MODEL_PREFIX, model alias prefix, some tool will only recongize the model name starts with gpt-xxx. the same to embedding and image model
```
API_KEY = "cf-123456789"
TEXT_MODEL_PREFIX = "gpt-3.5-"
IMAGE_MODEL_PREFIX = "dall-e-"
EMBEDDING_MODEL_PREFIX = "text-embedding-"
IMAGE_MODEL_PREFIX = "dall-e-"
EMBEDDING_MODEL_PREFIX = "text-embedding-"
```
please remember update wrangler.toml and deploy again.


## Model
basically we support all models listed [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/models/)

also, we have update.py to fetch the latest models to local ./config/models.json  


you have three ways to access specified model
- by model id: for example @cf/meta/llama-2-7b-chat-fp16
- by model name: llama-2-7b-chat-fp16
- by model openai alias: gpt-3.5-llama-2-7b-chat-fp16 or gpt-3.5-llama-2-7b-chat-fp16-beta

> #### Beta model is **FREE**.
> Workers AI will begin billing for usage on non-beta models after April 1, 2024. Refer to Pricing for more details.

## TODO
- ✅ list models  endpoint: /v1/models
- ✅ chat completions  endpoint: /v1/chat/completions
- ✅ text to image  endpoint: /v1/images/generations
- ❌ text to speech  endpoint: /v1/audio/speech


## Recommend Client
since cf-as-openai follow the standard openai API format, all openai capatable client could use it.

- https://app.nextchat.dev/#/


## Donate
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/boyd4yd)

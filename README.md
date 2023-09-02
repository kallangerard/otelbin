# OTelBin

OTelBin is a configuration tool for OpenTelemetry collectors. See https://opentelemetry.io/docs/collector/ for more information.

## Deployment

 - [Development](https://otelbin.vercel.app)
 - [Production](https://www.otelbin.com)

## Getting Started

```sh
git clone git@github.com:dash0hq/opentelemetry-collector-web.git
cd opentelemetry-collector-web
cp .env.example .env
# Ask a colleague for the contents of .env, especially for DATABASE_URL as it contains secrets. Do 
# not update the .env.example file
npm install
npm run dev
```

## Using the JSON Schema

This repository uses JSON schema from VS-Code's extension [OTEL Validator](https://github.com/nimbushq/otel-validator) in order to provide validation for the configuration file.  

For getting the latest version of the schema, either clone the repository and copy the schema from `assets/schema.json` or directly copy the file from [here](https://github.com/nimbushq/otel-validator/blob/main/assets/schema.json).  

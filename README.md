## Commands

## Environment Variables

You must create a `.env` file in the root folder. If you do not add this file, the application may crash. The `.env` file requires the following environment variables:

- `STRIPE_SECRET_KEY`: the secret Stripe key from https://stripe.com/

### Example

```
STRIPE_SECRET_KEY="my secret key"
```

### Install the packages

```bash
yarn install
```

### Start the server

```bash
yarn develop
```

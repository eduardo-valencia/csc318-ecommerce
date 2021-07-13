## Commands

## Environment Variables

You must create a `.env` file in the root folder. If you do not add this file, the application may crash. The `.env` file requires the following environment variables:

- `STRIPE_SECRET_KEY`: the secret Stripe key from https://stripe.com/

### Example

If you want to test the application, please copy the text from the `.env.example` file and paste it into a `.env` file. Then, start your application.

### Install the packages

```bash
yarn install
```

### Start the server

```bash
yarn develop
```

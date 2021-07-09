"use strict";

const { sanitizeEntity } = require("strapi-utils");
const configureStripe = require("stripe");

const stripe = configureStripe(process.env.STRIPE_SECRET_KEY);

const createOrder = async (ctx, amountInCents) => {
  const { name, products } = ctx.request.body;
  return strapi.services.orders.create({
    name,
    products,
    amountInCents,
  });
};

const validateRequestAndCreateOrder = async (ctx, amountInCents) => {
  let entity;
  if (ctx.is("multipart")) {
    ctx.throw("Multipart requests are not supported.");
  } else {
    entity = await createOrder(ctx, amountInCents);
  }
  return sanitizeEntity(entity, { model: strapi.models.orders });
};

const getNewTotal = (product, quantity, total) => {
  const priceInCents = product.price * 100;
  const priceForQuantity = quantity * priceInCents;
  console.log("priceForQuantity", priceForQuantity);
  return total + priceForQuantity;
};

const findProductAndAddTotal = async (ctx, total, productIndex) => {
  const { quantity, slug: productId } = ctx.request.body.products[productIndex];
  const product = await strapi.services.products.findOne({ slug: productId });
  console.log("product", product);
  if (product) {
    return getNewTotal(product, quantity, total);
  }
  return ctx.throw(`Could not find product ${productId}`);
};

const getTotal = async (ctx) => {
  let totalInCents = 0;
  const { products } = ctx.request.body;
  for (let productIndex = 0; productIndex < products.length; productIndex++) {
    totalInCents = await findProductAndAddTotal(
      ctx,
      totalInCents,
      productIndex
    );
  }
  return totalInCents;
};

const tryCreatingCharge = async (ctx, totalInCents) => {
  try {
    return await stripe.charges.create({
      source: ctx.request.body.token.id,
      amount: totalInCents,
      currency: "USD",
    });
  } catch (error) {
    console.error(error);
    ctx.throw("Sorry, there was a problem processing your payment.");
  }
};

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    const totalInCents = await getTotal(ctx);
    const charge = await tryCreatingCharge(ctx, totalInCents);
    if (charge) {
      return validateRequestAndCreateOrder(ctx, totalInCents);
    }
  },
};

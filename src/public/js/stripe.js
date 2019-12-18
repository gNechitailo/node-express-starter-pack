/* eslint-disable*/
const stripe = Stripe('pk_test_My6hUtQYApFJjpwBd6JCBHcl002QhgjK2I');

const where = window.location.origin

const checkoutButton = document.querySelector('#checkout-button');

checkoutButton.addEventListener('click', function () {
  const email = encodeURIComponent('test5@test')
  stripe.redirectToCheckout({
    items: [{
      // Define the product and SKU in the Dashboard first, and use the SKU
      // ID in your client-side code.
      sku: 'sku_GKkloQvQtX4FOC',
      quantity: 1
    }],
    successUrl: `${where}/payment/end?who=${email}&why=patamuschta`,
    cancelUrl: `${where}/payment/badend?who=${email}`
  });
});
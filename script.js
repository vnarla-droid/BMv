let cart = [];
let total = 0;

// Show the selected section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Add to cart
function addToCart(id, name, price) {
    cart.push({ id, name, price });
    total += price;
    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItems.appendChild(li);
    });
    
    cartTotal.textContent = total;
}

// Toggle payment details visibility
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const creditCardDetails = document.getElementById('credit-card-details');
        if (this.value === 'credit') {
            creditCardDetails.classList.remove('hidden');
        } else {
            creditCardDetails.classList.add('hidden');
        }
    });
});

// Handle checkout
document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const formData = {
        customer: {
            name: this.name.value,
            email: this.email.value,
            phone: this.phone.value,
            address: this.address.value
        },
        paymentMethod: this.payment.value,
        paymentDetails: this.payment.value === 'credit' ? {
            cardNumber: this['card-number'].value,
            cardExpiry: this['card-expiry'].value,
            cardCvc: this['card-cvc'].value
        } : null,
        cart: cart,
        total: total,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(`Thank you for your purchase, ${formData.customer.name}! Total: $${total}`);
            cart = [];
            total = 0;
            updateCart();
            this.reset();
            document.getElementById('credit-card-details').classList.add('hidden');
        } else {
            alert('Error processing order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server. Please try again later.');
    }
});

// Show Home by default on page load
window.onload = function() {
    showSection('home');
};
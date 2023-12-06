document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    let iconCart = document.querySelector('.icon-cart');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.btn-close');
    let iconCartSpan = document.querySelector('.icon-cart span');
    let checkoutButton = document.querySelector('.btn-checkOut');
    var removeCartItemButtons = document.getElementsByClassName('btn-danger');

    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    checkoutButton.addEventListener('click', () => {
        displayCheckoutPopup();
    });

    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    function removeCartItem(event) {
        var buttonClicked = event.target;
        buttonClicked.parentElement.parentElement.remove();
        updateCartTotal();
        saveCartToLocalStorage();
    }

    function quantityChanged(event) {
        var input = event.target;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }
        updateCartTotal();
        saveCartToLocalStorage();
    }

    function addToCartClicked(event) {
        var button = event.target;
        var shopItem = button.parentElement.parentElement;
        var title = shopItem.querySelector('.shop-item-title').innerText;
        var price = shopItem.querySelector('.shop-item-price').innerText;
        var imageSrc = shopItem.querySelector('.shop-item-image').src;

        var quantityInput = shopItem.querySelector('.cart-quantity-input');
        var quantity = quantityInput ? quantityInput.value : 1;

        addItemToCart(title, price, imageSrc, quantity);
        updateCartTotal();
        saveCartToLocalStorage();
    }

    function addItemToCart(title, price, imageSrc, quantity) {
        var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0];
        var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText == title) {
                alert('This item is already added to the cart.');
                return;
            }
        }
        var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column money">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${quantity}">
                <button class="btn btn-danger cart-quantity-button" type="button">REMOVE</button>
            </div><hr>`;
        cartRow.innerHTML = cartRowContents;
        cartItems.append(cartRow);
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
    }

    function updateCartTotal() {
        var cartItemContainer = document.getElementsByClassName('cart-items')[0];
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        var total = 0;
        var itemCount = 0;

        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var priceElement = cartRow.getElementsByClassName('cart-price')[0];
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            var price = parseFloat(priceElement.innerText.replace('₱', ''));
            var quantity = quantityElement.value;
            total = total + price * quantity;
            itemCount += parseInt(quantity);
        }
        
        document.getElementsByClassName('cart-total-price')[0].innerText = '₱' + total;
        iconCartSpan.innerText = itemCount;
        
        return total;
    }
    
    function loadCart() {
        var cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        cartItems.forEach(item => {
            addItemToCart(item.title, item.price, item.imageSrc, item.quantity);
        });
        
        updateCartTotal();
    }
    function generateRandomReceiptNumber() {
        
        const receiptNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        
        return receiptNumber.toString();
    }
    const randomReceiptNumber = generateRandomReceiptNumber();
    console.log('Random Receipt Number:', randomReceiptNumber);
    
    
    function saveCartToLocalStorage() {
        var cartRows = document.getElementsByClassName('cart-row');
        var cartItems = [];
        
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var title = cartRow.querySelector('.cart-item-title').innerText;
            var price = cartRow.querySelector('.cart-price').innerText;
            var imageSrc = cartRow.querySelector('.cart-item-image').src;
            var quantity = cartRow.querySelector('.cart-quantity-input').value;
            
            cartItems.push({
                title: title,
                price: price,
                imageSrc: imageSrc,
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    function closeReceipt(){
        alert('Thanks you for your purchase')
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes()){
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal()
    }
    
    function displayCheckoutPopup() {
        function handleDeliveryTypeChange() {
            let deliveryType = document.getElementById('deliveryType').value;
            let paymentDetailsContainer = document.getElementById('paymentDetailsContainer');
            
            paymentDetailsContainer.innerHTML = '';
            
            if (deliveryType === 'gcash' || deliveryType === 'creditCard') {
                let paymentInput = document.createElement('input');
                paymentInput.type = 'text';
                paymentInput.placeholder = deliveryType === 'gcash' ? 'Enter GCash number' : 'Enter credit card number';
                paymentInput.classList.add('payment-input');
                
                paymentDetailsContainer.appendChild(paymentInput);
            }
        }
        
        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        
        let popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');
        
        let popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
        
        let customerInfoForm = `
        <label for="fullName">Full Name:</label>
        <input type="text" id="fullName" required>
        <label for="address">Address:</label>
        <input type="text" id="address" required>
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        <label for="deliveryAddress">Delivery Address:</label>
        <input type="text" id="deliveryAddress" required>
        <label for="deliveryType">Delivery Type:</label><div id="paymentDetailsContainer"></div>
        <select id="deliveryType">
        <option value="cashOnDelivery">Cash on Delivery</option>
        <option value="creditCard">Credit Card</option>
        <option value="gcash">GCash</option>
        </select>
        `;
        
        let cartItems = document.getElementsByClassName('cart-row');
        let cartItemsHtml = '';
        
        for (let i = 0; i < cartItems.length; i++) {
            let cartItem = cartItems[i];
            let cartItemImage = cartItem.querySelector('.cart-item-image').outerHTML;
            let cartItemTitle = cartItem.querySelector('.cart-item-title').innerText;
            let cartItemPrice = cartItem.querySelector('.cart-price').innerText;
            let cartItemQuantity = cartItem.querySelector('.cart-quantity-input').value;
            
            cartItemsHtml += `
            <div class="cart-item-popup">
            ${cartItemImage}
            <div class="cart-item-details">
            <span>${cartItemTitle}</span>&nbsp&nbsp
            <span>Price: ${cartItemPrice}</span>&nbsp&nbsp&nbsp
            <span>Quantity: ${cartItemQuantity}</span>
            <hr>
            </div>
            </div>
            `;
        }
        let cartInfo = document.getElementsByClassName('cart-row');
        let cartInfoHtml = '';
        
        for (let i = 0; i < cartInfo.length; i++){
            let cartItem = cartInfo[i];
            let cartInfoTitle = cartItem.querySelector('.cart-item-title').innerText;
            let cartInfoPrice = cartItem.querySelector('.cart-price').innerText;
            let cartInfoQuantity = cartItem.querySelector('.cart-quantity-input').value;
            
            cartInfoHtml += `<div class="cart-item-details">
            <span>${cartInfoTitle}</span>&nbsp&nbsp
            <span>Price: ${cartInfoPrice}</span>&nbsp&nbsp&nbsp
            <span>Quantity: ${cartInfoQuantity}</span>
            <hr>
            </div>
            </div>`;
            
        }
        
        let total = updateCartTotal();
        
        popupContent.innerHTML = customerInfoForm + '<div class="cart-items-popup">' + cartItemsHtml + '</div>' +
        '<hr>' +
        '<div class="cart-total-popup">Total: ₱' + total + '</div>';
        
        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        
        let closeButton = document.createElement('button');
        closeButton.classList.add('popup-button-close');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });
        
        let proceedButton = document.createElement('button');
        proceedButton.classList.add('popup-button-proceed');
        proceedButton.innerText = 'Proceed';
        
        proceedButton.addEventListener('click', () => {
            let fullName = document.getElementById('fullName').value;
            let address = document.getElementById('address').value;
            let email = document.getElementById('email').value;
            let deliveryAddress = document.getElementById('deliveryAddress').value;
            let deliveryType = document.getElementById('deliveryType').value;
            
            // Validate that all required fields are filled
            if (!fullName || !address || !email || !deliveryAddress) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create a receipt HTML
            let receiptHtml = `
            <div class="receipt">
            <h2>Receipt #${generateRandomReceiptNumber()}</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
            <p><strong>Delivery Type:</strong> ${deliveryType}</p>
            <hr>
            <div class="cart-itemz-popu">${cartInfoHtml}</div>
            <hr>
            <div class="cart-totalz-popu">Total: ₱${total}</div>
            </div>
            `;
            
            // Display the receipt in a new popup
            let receiptPopup = document.createElement('div');
            receiptPopup.classList.add('popup-containerz');
            receiptPopup.innerHTML = receiptHtml;
            
            let closeButton = document.createElement('button');
            closeButton.classList.add('popupz-button-close');
            closeButton.innerText = 'Close';
            closeButton.addEventListener('click', localStorage.clear());
            closeButton.addEventListener('click', closeReceipt);
            closeButton.addEventListener('click', () => {
                overlay.remove();
            });
            
            let receiptButtonContainer = document.createElement('div');
            receiptButtonContainer.classList.add('button-containerz');
            receiptButtonContainer.appendChild(closeButton);
            
            receiptPopup.appendChild(receiptButtonContainer);
            
            overlay.innerHTML = ''; // Clear the existing content
            overlay.appendChild(receiptPopup);
        });
        
        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(proceedButton);
        
        popupContainer.appendChild(popupContent);
        popupContainer.appendChild(buttonContainer);
        
        overlay.appendChild(popupContainer);
        
        document.body.appendChild(overlay);
        
        document.getElementById('deliveryType').addEventListener('change', handleDeliveryTypeChange);
    }
    
    loadCart();

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabContents.forEach((content) => {
                content.classList.remove('active');
            });

            tabContents[index].classList.add('active');
        });
    });
});


let groceryList = [];
// Event Listener for the Search Button
document.addEventListener('DOMContentLoaded', function() {
    renderGroceryList();
    document.getElementById('searchButton').addEventListener('click', function() {
        const userInput = document.getElementById('searchBox').value;
        if(userInput) {
            search(userInput);
        }

        else {
            alert("Please type something in");
            clearProductContainer();
        }
    })
});

//Event Listener to clear the search area
document.getElementById('clearSearchButton').addEventListener('click', function() {
    clearProductContainer();
    const userInput = document.getElementById('searchBox');
    userInput.value = '';
    userInput.placeholder = 'Search for products...';
})


// Event Listener for decrease quantity button
document.getElementById('manDecreaseButton').addEventListener('click', function () {
    const quantityInput = document.getElementById('productQuantity');
    const currentQuantity = parseInt(quantityInput.value);
    decreaseButtonFunc(quantityInput);

    })

// EventListener for increase button
document.getElementById('manIncreaseButton').addEventListener('click', function () {
    const quantityInput = document.getElementById('productQuantity');
           increaseButtonFunc(quantityInput);
    
        })


// Event Listener for manually adding a product)
document.getElementById('manualAddToListButton').addEventListener('click', function() {
    const foodItem = document.getElementById('productName');
    const food = foodItem.value;
    const quantityInput = document.getElementById('productQuantity');
    const quantityValue = parseInt(quantityInput.value);
    foodItem.value = '';
    if(food){
        if(quantityValue > 0){
       addToGroceryList(food, quantityValue);
    }

    else {
        alert('Please enter a valid quantity');
    }

    }

    else {
        alert('Product Name Empty')
    }


})

// Clears groceryList array and the list
document.getElementById('clearButton').addEventListener('click', function() {
    localStorage.clear();
    renderGroceryList();

})

// Searches the USDA API for grocery products and displays the product's information
async function search (userInput) {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${userInput}&api_key=eUGeLH7Kzwb3LjivB8RPm26XEHZZIlbyhm4tMW3A`;
    const productGridContainer = document.getElementById('productGrid');
    const displayedProducts = new Set();
    clearProductContainer();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network Response Error');
          }
          else {
          const data = await response.json();
        if(data.foods.length > 0) {
          data.foods.forEach(food => {
            const foodName = food.description;
            if (!displayedProducts.has(foodName)) {
                displayedProducts.add(foodName);
                const foodItem = document.createElement('div');
                const quantityInput = document.createElement('input');
                const quantityContainer = document.createElement('div');
                quantityInput.type = 'number';
                quantityInput.className = 'quantityFieldBox';
                quantityInput.min = '1';
                quantityInput.value = '1';
                const decreaseButton = createDecreaseButton();
                decreaseButton.addEventListener('click', () => decreaseButtonFunc(quantityInput));
                const increaseButton = createIncreaseButton();
                increaseButton.addEventListener('click', () => increaseButtonFunc(quantityInput));
                const addToListButton = document.createElement('button');
                addToListButton.className = 'addToListButton';
                addToListButton.textContent = 'Add To List'
                addToListButton.addEventListener('click', function () {
                    const quantityValue = parseInt(quantityInput.value, 10);
                    if (quantityInput.value > 0) {
                    addToGroceryList(foodName, quantityValue);
                    }

                    else {
                        alert('Please enter a valid quantity');
                    }
            })

            foodItem.className = 'foodItem';
            foodItem.innerHTML = `
            <h3>${foodName}</h3>
            `;
            
            quantityContainer.appendChild(decreaseButton);
            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(increaseButton);
            foodItem.appendChild(quantityContainer);
            foodItem.appendChild(addToListButton);
            productGridContainer.appendChild(foodItem);
        }
          });

        }

    else {
        clearProductContainer();
        const noProductFoundMessage = document.createElement('div');
        noProductFoundMessage.innerHTML = 'Product Not Found'
        productGridContainer.appendChild(noProductFoundMessage);
    }
}
        } catch (error) {
          console.error('No Products Found', error);
        }
    }

    // Adds the item to the grocery list
    function addToGroceryList(foodName, quantityValue) {
        let groceryList = JSON.parse(localStorage.getItem('groceryProducts')) || [];
        const existingProductIndex = groceryList.findIndex(product => product.name === foodName);
        if (existingProductIndex !== -1) {
            groceryList[existingProductIndex].quantity += quantityValue;
        } else {
            groceryList.push({ name: foodName, quantity: quantityValue });
        }

        saveToLocalStorage(groceryList);
        renderGroceryList();
    }

    function renderGroceryList() {
            const listContainer = document.getElementById('listContainer');
            listContainer.innerHTML = '';
            const storedProductsString = localStorage.getItem('groceryProducts');
            const storedProducts = JSON.parse(storedProductsString) || [];

                if(storedProducts.length === 0){
                    const emptyListMessage = document.createElement('div');
                    emptyListMessage.textContent = 'List is Empty';
                    listContainer.appendChild(emptyListMessage);

                }

            else {
               const list = document.createElement('ul');
                listContainer.appendChild(list);
                storedProducts.forEach(product => {
                    const listItem = document.createElement('li');
                    const listItemContainer = document.createElement('div');
                    listItemContainer.className = 'listItemContainer';
                    listItem.className = 'listItem';
                    // Creates a label for the custom checkbox
                    const itemCheckbox = document.createElement('label');
                    itemCheckbox.className = 'itemCheckbox';

                    // Creates a hidden checkbox 
                    const hiddenCheckbox = document.createElement('input');
                    hiddenCheckbox.type = 'checkbox';
                    hiddenCheckbox.className = 'hiddenCheckbox';

                    // Creates visual checkbox
                    const checkbox = document.createElement('span');
                    checkbox.className = 'checkbox';

                    //Checkbox event listener
                    checkbox.addEventListener('click', () => {
                        checkbox.classList.toggle('checked');
                    })
        
                    // Product Name and Quantity Spans
                    const productInfoContainer = document.createElement('div');
                    const productNameSpan = document.createElement('span');
                    productNameSpan.className = 'productNameSpan';
                    const quantitySpan = document.createElement('span');
                    quantitySpan.className = 'quantitySpan';
                    productNameSpan.textContent = `${product.name} x `;
                    quantitySpan.textContent = `${product.quantity}`;

                    // Modify and Remove buttons
                    const listButtonContainer = document.createElement('div');
                    listButtonContainer.className = 'listButtonContainer';
                    const modifyButton = document.createElement('button');
                    const removeButton = document.createElement('button');
                    removeButton.className = 'listButtons';
                    modifyButton.className = 'listButtons';
                    removeButton.textContent = 'Remove';
                    modifyButton.textContent = 'Edit';
                    listButtonContainer.appendChild(modifyButton);
                    listButtonContainer.appendChild(removeButton);

                    // Build the checkbox
                    itemCheckbox.appendChild(hiddenCheckbox);
                    itemCheckbox.appendChild(checkbox);

                    // Build the list item

                    productInfoContainer.appendChild(itemCheckbox);
                    productInfoContainer.appendChild(productNameSpan);
                    productInfoContainer.appendChild(quantitySpan);
                    listItemContainer.appendChild(productInfoContainer);
                    listItemContainer.appendChild(listButtonContainer);
                    listItem.appendChild(listItemContainer);
                    list.appendChild(listItem);
                    removeButton.addEventListener('click', function () {
                        removeItem(product.name);
                    })
                    modifyButton.addEventListener('click', function () {
                        const quantityField = document.createElement('input');
                        const saveButton = document.createElement('button');
                        const quantityContainer = document.createElement('div');
                        quantityContainer.className = 'quantityContainer';
                        saveButton.textContent = 'Save';
                        saveButton.className = 'listButtons';
                        quantityField.type = 'number';
                        quantityField.min = '1';
                        quantityField.value = quantitySpan.textContent;
                        quantityField.className = 'editQuantityField';
                        const decreaseButton = createDecreaseButton();
                        const increaseButton = createIncreaseButton();
                        decreaseButton.id = 'decButton';
                        increaseButton.id = 'incButton';
                        decreaseButton.addEventListener('click', () => decreaseButtonFunc(quantityField));
                        increaseButton.addEventListener('click', () => increaseButtonFunc(quantityField));
                        
                        quantityContainer.appendChild(decreaseButton);
                        quantityContainer.appendChild(quantityField);
                        quantityContainer.appendChild(increaseButton);
                        productInfoContainer.replaceChild(quantityContainer, quantitySpan);
                        listButtonContainer.replaceChild(saveButton, modifyButton);
                          
                        /*
                            This create an updated array that uses the map method to create a new array based on the storedProducts array.
                            It them compares the names of each product to find the matching one and updates the quantity with the one entered.
                            The updated array is then saved back to local storage. And displayed once the renderGroceryList function is called.
                        */

                        saveButton.addEventListener('click', function () {
                            const updatedQuantity = parseInt(quantityField.value, 10);
                            if(updatedQuantity > 0) {
                            const updatedProducts = storedProducts.map(p => {
                                if (p.name === product.name) {
                                    return ({...p, quantity: updatedQuantity});
                                }

                                else {
                                    return p;
                                }
                            })
                            saveToLocalStorage(updatedProducts);
                            renderGroceryList();

                        }

                        else if (updatedQuantity === 0) {
                            removeItem(product.name);
                        }

                        else {
                            alert('Quantity cannot be negative.');
                        }
                        })
                    })
            })
            }
        }

    function createDecreaseButton () {
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.className = 'decreaseButton';

        return decreaseButton;
    }

    function createIncreaseButton () {
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.className = 'increaseButton';

        return increaseButton;
    }


    function decreaseButtonFunc (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value);
        if(currentQuantity > 0) {
            quantityInput.value = currentQuantity - 1;
    }
    }

    function increaseButtonFunc (quantityInput) {
        const currentQuantity = parseInt(quantityInput.value);
        quantityInput.value = currentQuantity + 1;
    }
    

    function removeItem (productName) {
        const storedProductsString = localStorage.getItem('groceryProducts');
        const storedProducts = JSON.parse(storedProductsString) || [];
        const updatedGroceryList = storedProducts.filter(p => p.name !== productName);
        saveToLocalStorage(updatedGroceryList);
        renderGroceryList();
    }

    // Clears the product area
    function clearProductContainer () {
        const gridContainer = document.getElementById('productGrid');
        gridContainer.innerHTML = '';
    }

    function saveToLocalStorage(products) {
        localStorage.setItem('groceryProducts', JSON.stringify(products));
    }
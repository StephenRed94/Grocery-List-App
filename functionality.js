const groceryList = [];
let food;
let quantityValue;
let quantityInput;
let foodItem;
let productExists = false;

document.addEventListener('DOMContentLoaded', function() {
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

document.getElementById('manualAddToListButton').addEventListener('click', function() {
    foodItem = document.getElementById('productName');
    food = foodItem.value;
    quantityInput = document.getElementById('productQuantity');
    quantityValue = parseInt(quantityInput.value);
    alert(`${food} and ${quantityValue}`);
})

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
                foodItem = document.createElement('div');
                quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = '1';
                quantityInput.value = '1';
                const addToListButton = document.createElement('button');
                addToListButton.className = 'addToListButton';
                addToListButton.textContent = 'Add To List'
                addToListButton.addEventListener('click', function () {
                    food = foodName;
                    quantityValue = parseInt(quantityInput.value);
                    productExists = false;
                    const listContainer = document.getElementById('listContainer');
                    listContainer.innerHTML = '';
                    const product = {
                        name: food,
                        quantity: quantityValue
                    }
                    for(let i = 0; i < groceryList.length; i++) {
                        if(groceryList[i].name === foodName) {
                            groceryList[i].quantity += quantityValue;
                            productExists = true;
                            break; 
                        }
                    }

                    if(!productExists){
                        groceryList.push(product);
                    }

                    renderGroceryList();
            })

            foodItem.className = 'foodItem';
            foodItem.innerHTML = `
            <h3>Name: ${foodName}</h3>
            `;
            
            foodItem.appendChild(quantityInput);
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

    function renderGroceryList() {
        const listContainer = document.getElementById('listContainer');
        let list = listContainer.querySelector('ul');
        if(!list) {
            list = document.createElement('ul');
            listContainer.appendChild(list);
        }

        else {
            list.innerHTML = '';
        }

        if(groceryList.length > 0) {

         groceryList.forEach((product, index) => {
                        const listItem = document.createElement('li');
                        const removeButton = document.createElement('button');
                        removeButton.addEventListener('click', function () {
                            groceryList.splice(index, 1);
                            renderGroceryList();
                        })
                        removeButton.textContent = 'X';
                        listItem.textContent = `${product.name} X ${product.quantity}`;
                        listItem.appendChild(removeButton);
                        list.appendChild(listItem);
                    })

                }
        else {
            const emptyListMessage = document.createElement('div');
            emptyListMessage.textContent = "List Empty";
            listContainer.appendChild(emptyListMessage);
        }
    }

    function clearProductContainer () {
        const gridContainer = document.getElementById('productGrid');
        gridContainer.innerHTML = '';
    }
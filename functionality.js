const groceryList = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchButton').addEventListener('click', function() {
        const userInput = document.getElementById('searchBox').value;
        if(userInput) {
            search(userInput);
        }

        else {
            alert("Please type something in");
        }
    })
});

async function search (userInput) {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${userInput}&api_key=eUGeLH7Kzwb3LjivB8RPm26XEHZZIlbyhm4tMW3A`;
    const productGridContainer = document.getElementById('productGrid');
    const list = document.getElementById('list');
    const displayedProducts = new Set();
    productGridContainer.innerHTML = '';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network Response Error');
          }

          const data = await response.json();

          data.foods.forEach(food => {
            const foodName = food.description;
            if (!displayedProducts.has(foodName)) {
                displayedProducts.add(foodName);
                const foodItem = document.createElement('div');
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = '1';
                quantityInput.value = '1';
                const addToListButton = document.createElement('button');
                addToListButton.className = 'addToListButton';
                addToListButton.textContent = 'Add To List'
                addToListButton.addEventListener('click', function () {
                    list.innerHTML = '';
                    let food = foodName;
                    let quantityValue = parseInt(quantityInput.value);
                    let productExists = false;
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

                    groceryList.forEach(product => {
                        const listItem = document.createElement('li');
                        const removeButton = document.createElement('button');
                        removeButton.addEventListener('click', function () {
                            
                        })
                        removeButton.textContent = 'X';
                        listItem.textContent = `${product.name} X ${product.quantity}`;
                        listItem.appendChild(removeButton);
                        list.appendChild(listItem);
                    })
                  
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
        } catch (error) {
          console.error('No Products Found', error);
        }


    }
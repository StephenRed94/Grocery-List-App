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
    const groceryList = [];
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
                    let food = foodName;
                    let quantityValue = parseInt(quantityInput.value);
                    const product = {
                        name: food,
                        quantity: quantityValue
                    }
                    
                    groceryList.push(product);
                    console.log(groceryList);
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
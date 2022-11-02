let username;
let data;
let numberOfProduct;
let productList;
let notAddedItems = {};

(() => {
  document
    .getElementById("user_signup")
    .addEventListener("click", displaySignUp);
  document.getElementById("user_login").addEventListener("click", displayLogin);
  document
    .getElementById("login_submit")
    .addEventListener("click", validateLogin);
  document
    .getElementById("signup_submit")
    .addEventListener("click", validateSignup);
  document.getElementById("vegetables").addEventListener("click", () => {
    updateUI("vegetables");
  });
  document.getElementById("fruits").addEventListener("click", () => {
    updateUI("fruits");
  });
  document.getElementById("daily_staples").addEventListener("click", () => {
    updateUI("daily_staples");
  });
  document.getElementById("household").addEventListener("click", () => {
    updateUI("household");
  });
  document
    .getElementById("products")
    .addEventListener("change", displayCardBasedOnSearch);
  document
    .getElementById("search")
    .addEventListener("click", displayCardBasedOnSearch);
  document.getElementById("log-out").addEventListener("click", () => {
    location.reload();
  });
  document
    .getElementById("cart-icon")
    .addEventListener("click", displayCartPage);
  document
    .getElementById("home-icon")
    .addEventListener("click", displayHomePage);
  const checkBox = document.getElementsByClassName("mycheck");
  const select = document.getElementById("deselect-all");
  select.addEventListener("click", () => {
    for (let iterate = 1; iterate < numberOfProduct; iterate++) {
      checkBox[iterate].checked = false;
    }
  });
  document.getElementById("logout").addEventListener("click", () => {
    location.reload();
  });
})();

function displaySignUp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("sign_up").style.display = "block";
  document.getElementById("user_signup").style.boxShadow =
    "0 0 5px 3px #66f2ffeb";
  document.getElementById("user_login").style.boxShadow = "none";
}

function displayLogin() {
  document.getElementById("sign_up").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("user_login").style.boxShadow =
    "0 0 5px 3px #66f2ffeb";
  document.getElementById("user_signup").style.boxShadow = "none";
}

function validateLogin() {
  let userinput = {
    username: userid.value,
    password: password.value,
  };
  userLogin(userinput);
  userid.value = "";
  password.value = "";
}

function validateSignup() {
  if (password1.value === password2.value) {
    let userinput = {
      username: newUserid.value,
      password: password1.value,
    };
    addDataToJSON(userinput);
  } else {
    alert("password mis-match");
  }
  newUserid.value = "";
  password1.value = "";
  password2.value = "";
}

async function addDataToJSON(userinput) {
  let signup = await fetch("http://localhost:7070/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });
  if (signup.ok) {
    alert("User added");
    username = userinput.username;
    displayHomePage();
  } else {
    alert("UserID exist");
  }
  return;
}

async function userLogin(userinput) {
  let login = await fetch("http://localhost:7070/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });
  if (login.ok) {
    alert("login success");
    username = userinput.username;
    displayHomePage();
  } else {
    alert("invalid username or password");
  }
  return;
}

async function updateCartDetails(cartDetails) {
  let cartUpdated = await fetch("http://localhost:7070/update-cart", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(cartDetails),
  });
  if (cartUpdated.ok) {
    alert("Successfully added to cart");
  } else {
    alert("Quantity not available");
  }
  return;
}

function displayHomePage() {
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundColor = "rgb(40,40,39)";
  document.getElementById("login_page").style.display = "none";
  document.getElementById("home-page").style.display = "block";
  document.getElementById("cart-page").style.display = "none";
  document.getElementById("username").innerHTML = username;
  enableSelect();
}

function updateUI(category) {
  document.getElementById("products").value = null;
  createDisplayCard(category);
  document.getElementById(category).style.backgroundColor = "#81ffe8";
  addToCartEvent();
}

function createDisplayCard(category, iterate = 1, condition = "specific") {
  document.getElementById("card-container").style.display = "none";
  for (const productGroup in data) {
    document.getElementById(productGroup).style.backgroundColor = "#F0F0F0";
  }
  const cloneCard = document.getElementById("append-card");
  const card = document.querySelector(".product-card");
  const productIcon = document.getElementsByClassName("product-icon");
  const productName = document.getElementsByClassName("product-name");
  const productCost = document.getElementsByClassName("product-cost");
  const productCategory = document.getElementsByClassName("product-category");
  if (iterate == 1) {
    cloneCard.replaceChildren();
  }
  let productNumber = 0;
  let costUnit = category === "household" ? " Rs" : " Rs/kg";
  for (const product in data[category]) {
    cloneCard.appendChild(card.cloneNode(true));
    productIcon[iterate].src = `./assets/${category}/${
      Object.keys(data[category])[productNumber]
    }.jpg`;
    productName[iterate].innerHTML = data[category][product].name;
    productCost[iterate].innerHTML = data[category][product].cost + costUnit;
    if (condition == "all") {
      productCategory[iterate].innerHTML = category;
    }
    iterate = iterate + 1;
    productNumber = productNumber + 1;
  }
  return iterate;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key]["name"] === value);
}

function createSingleCard(selectedProduct, categoryOfSelect) {
  for (const productGroup in data) {
    document.getElementById(productGroup).style.backgroundColor = "#F0F0F0";
  }
  const cloneCard = document.getElementById("append-card");
  cloneCard.replaceChildren();
  const card = document.querySelector(".product-card");
  cloneCard.appendChild(card.cloneNode(true));
  let costUnit = categoryOfSelect === "household" ? " Rs" : " Rs/kg";
  document.getElementsByClassName(
    "product-icon"
  )[1].src = `./assets/${categoryOfSelect}/${selectedProduct}.jpg`;
  document.getElementsByClassName("product-name")[1].innerHTML =
    data[categoryOfSelect][selectedProduct].name;
  document.getElementsByClassName("product-cost")[1].innerHTML =
    data[categoryOfSelect][selectedProduct].cost + costUnit;
  document.getElementsByClassName("product-category")[1].innerHTML =
    categoryOfSelect;
}

function displayCardBasedOnSearch() {
  let selectedValue = document.getElementById("products").value;
  if (selectedValue) {
    let includesValue = 0;
    let cardNumber = 1;
    for (const productGroup in data) {
      if (getKeyByValue(data[productGroup], selectedValue)) {
        includesValue = 1;
        createSingleCard(
          getKeyByValue(data[productGroup], selectedValue),
          productGroup
        );
        break;
      }
    }
    if (!includesValue) {
      alert("'" + selectedValue + "' product name not found");
      for (const productGroup in data) {
        cardNumber = createDisplayCard(productGroup, cardNumber, "all");
      }
      document.getElementById("products").value = "";
    }
    addToCartEvent();
  }
}

async function addToCartEvent() {
  let elements = document.getElementsByClassName("add-cart");
  let productKey;
  for (let iterate = 1; iterate < elements.length; iterate++) {
    elements[iterate].addEventListener("click", async () => {
      let productDetails;
      let selectedValue =
        document.getElementsByClassName("product-name")[iterate].innerHTML;
      for (const productGroup in data) {
        if (getKeyByValue(data[productGroup], selectedValue)) {
          productKey = getKeyByValue(data[productGroup], selectedValue);
          productDetails = {
            key: productKey,
            username: username,
            details: {
              name: selectedValue,
              productGroup: productGroup,
              quantity:
                document.getElementsByClassName("quantity-input")[iterate]
                  .value,
              cost: parseInt(
                document.getElementsByClassName("product-cost")[iterate]
                  .innerHTML
              ),
              stock: data[productGroup][productKey].stock,
            },
          };
        }
      }
      await updateCartDetails(productDetails);
      if (document.getElementById("cart-page").style.display == "grid") {
        await displayCartUI();
      }
    });
  }
}

async function enableSelect() {
  let listOfItems = [];
  data = await fetchProductData();
  data = await data.json();
  for (const productGroup in data) {
    for (const product in data[productGroup]) {
      const options = document.createElement("OPTION");
      options.value = data[productGroup][product].name;
      listOfItems.push(product);
      document.getElementById("item-list").appendChild(options);
    }
    notAddedItems[productGroup] = listOfItems;
    listOfItems = [];
  }
  updateUI("vegetables");
  return;
}

async function fetchProductData() {
  let data = await fetch("http://localhost:7070/product-list", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  return data;
}

async function displayCartPage() {
  document.getElementById("cart-page").style.display = "grid";
  document.getElementById("home-page").style.display = "none";
  document.getElementById("user-name").innerHTML = username;
  await displayCartUI();
  document
    .getElementById("proceed-to-buy")
    .addEventListener("click", updateStock);
}

async function displayCartUI() {
  const checkBox = document.getElementsByClassName("mycheck");
  await displayCartProductCard();
  for (let iterate = 1; iterate < numberOfProduct; iterate++) {
    checkBox[iterate].addEventListener("click", displayTotalCost);
  }
  displayTotalCost();
  displaySimilarProduct();
  await addToCartEvent();
}

async function displayCartProductCard() {
  const itemCategory = document.getElementsByClassName("item-category");
  const itemIcon = document.getElementsByClassName("item-icon");
  const itemName = document.getElementsByClassName("item-name");
  const itemCost = document.getElementsByClassName("item-cost");
  const itemQuantity = document.getElementsByClassName("item-quantity");
  const checkBox = document.getElementsByClassName("mycheck");
  const card = document.querySelector(".cart-card");
  const cloneCard = document.getElementById("items-in-cart");
  cloneCard.replaceChildren();
  productList = await fetchSelectedProductList();
  productList = await productList.json();
  let iterate = 1;
  for (const product in productList) {
    cloneCard.appendChild(card.cloneNode(true));
    checkBox[iterate].checked = "true";
    itemCategory[iterate].innerHTML = productList[product].productGroup;
    let costUnit =
      productList[product].productGroup === "household" ? " Rs" : " Rs/kg";
    itemIcon[
      iterate
    ].src = `./assets/${productList[product].productGroup}/${product}.jpg`;
    itemName[iterate].innerHTML = productList[product].name;
    itemCost[iterate].innerHTML = productList[product].cost + costUnit;
    itemQuantity[iterate].innerHTML = productList[product].quantity;
    iterate++;
    notAddedItems[productList[product].productGroup] = notAddedItems[
      productList[product].productGroup
    ].filter((item) => {
      return item !== product;
    });
  }
  numberOfProduct = iterate;
}

function displayTotalCost() {
  const checkBox = document.getElementsByClassName("mycheck");
  const itemCost = document.getElementsByClassName("item-cost");
  const itemQuantity = document.getElementsByClassName("item-quantity");
  let totalCost = 0;
  let selectedCount = 0;
  for (let iterate = 1; iterate < numberOfProduct; iterate++) {
    if (checkBox[iterate].checked == true) {
      totalCost +=
        parseFloat(itemCost[iterate].innerHTML) *
        parseFloat(itemQuantity[iterate].innerHTML);
      selectedCount += 1;
    }
  }
  document.getElementById("purchase-cost").innerHTML = totalCost.toFixed(2);
  document.getElementById("number-of-items").innerHTML = selectedCount;
}

async function updateStock() {
  let productKey;
  let quantity;
  let productFound = 0;
  const itemCategory = document.getElementsByClassName("item-category");
  const checkBox = document.getElementsByClassName("mycheck");
  const itemName = document.getElementsByClassName("item-name");
  for (let iterate = 1; iterate < numberOfProduct; iterate++) {
    if (checkBox[iterate].checked == true) {
      productFound = 1;
      productKey = getKeyByValue(productList, itemName[iterate].innerHTML);
      quantity =
        parseInt(productList[productKey].stock) -
        parseInt(productList[productKey].quantity) +
        "";
      quantity =
        itemCategory[iterate].innerHTML == "household"
          ? quantity
          : quantity + " Kg";
      data[itemCategory[iterate].innerHTML][productKey].stock = quantity;
      delete productList[productKey];
    }
  }
  if (productFound) {
    let updatedData = {
      username: username,
      details: productList,
    };
    await updateCartAfterShopping(updatedData);
    await updateWareHouseStock({ data: data });
    await displayCartProductCard();
    displayTotalCost();
  } else {
    alert("Items not added for purchase");
  }
}

function displaySimilarProduct() {
  const duplicate = document.getElementById("append-card");
  duplicate.replaceChildren();
  const card = document.querySelector(".product-card");
  const cloneCard = document.getElementById("clone-card");
  cloneCard.replaceChildren();
  if (numberOfProduct > 1) {
    document.getElementById("similar-display").style.display = "flex";
    cloneCard.appendChild(card.cloneNode(true));
    let selectedCategory =
      document.getElementsByClassName("item-category")[1].innerHTML;
    let costUnit = selectedCategory === "household" ? " Rs" : " Rs/kg";
    document.getElementsByClassName(
      "product-icon"
    )[1].src = `./assets/${selectedCategory}/${notAddedItems[selectedCategory][0]}.jpg`;
    document.getElementsByClassName("product-name")[1].innerHTML =
      data[selectedCategory][notAddedItems[selectedCategory][0]].name;
    document.getElementsByClassName("product-cost")[1].innerHTML =
      data[selectedCategory][notAddedItems[selectedCategory][0]].cost +
      costUnit;
    document.getElementsByClassName("product-category")[1].innerHTML =
      selectedCategory;
  } else {
    document.getElementById("similar-display").style.display = "none";
  }
}

async function fetchSelectedProductList() {
  let data = await fetch(
    `http://localhost:7070/selected-productlist/?user=${username}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return data;
}

async function updateCartAfterShopping(cartDetails) {
  await fetch("http://localhost:7070/edit-cart", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(cartDetails),
  });
  return;
}

async function updateWareHouseStock(data) {
  let stockUpdate = await fetch("http://localhost:7070/update-warehouse", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (stockUpdate.ok) {
    alert("Purchase successful");
  } else {
    alert("Purchase not successful");
  }
  return;
}

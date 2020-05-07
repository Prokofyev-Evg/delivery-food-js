'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const cardInfo = document.querySelector('.card-info');

let login = localStorage.getItem('gloDeliveryLogin');

const getData = async function(url){
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }
  return await response.json();
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function authorized() {

  function logOut() {
    login = null;
    localStorage.removeItem('gloDeliveryLogin');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('Авторизован');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function nonAuthorized() {
  console.log('Не авторизован');

  function logIn(event){
    event.preventDefault();
    if (!loginInput.value) {
      loginInput.style.borderColor = 'red';
      loginInput.focus();
      return;
    }
    else{
      loginInput.style.borderColor = '';
    }

    login = loginInput.value;
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
    localStorage.setItem('gloDeliveryLogin', login);
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}

function checkAuth(){
  if (login) {
    authorized();
  } else {
    nonAuthorized();
  }
}

function createRestaurant(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;
  
  const card = `
    <a class="card card-restaurant" data-products="${products}" data-name="${name}" data-rating="${stars}" data-price="${price}" data-category="${kitchen}">
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood(goods) {

  const { description, id, image, name, price} = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {

  const target = event.target;
  const restaurant = target.closest('.card-restaurant');
  
  if (restaurant) {
    if (!login) {
      toggleModalAuth();
    }else {
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      updateRestaurantInfo(restaurant.dataset);
      getData(`./db/${restaurant.dataset.products}`).then(function(data){
        data.forEach(createCardGood);
      });
      
    }
  }
}

function updateRestaurantInfo(data) {
  const {name, rating, price, category} = data;
  restaurantTitle.textContent = name;
  cardInfo.innerHTML = `
    <div class="rating">${rating}</div>
		<div class="price">От ${price} ₽</div>
		<div class="category">${category}</div>
  `;
}

function init(){
  getData('./db/partners.json').then(function(data){
    data.forEach(createRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
  })
}

init();
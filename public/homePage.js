"use strict";

// Выход из личного кабинета

const logout = new LogoutButton();

logout.action = () =>
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });

// Получение информации о пользователе

ApiConnector.current((r) => {
  if (r.data) {
    ProfileWidget.showProfile(r.data);
  }
});

// Рефреш интерфейса

const refresh = (result, message, func, where) => {
    if (result.success) {
        func(result.data);
        where.setMessage(false, message);
    } else {
        where.setMessage(true, result.data);
    }
}

// Получение текущих курсов валюты

function getStocks() {
  ApiConnector.getStocks((r) => {
    if (r.success) {
        rates.clearTable()
        rates.fillTable(r.data)
    }
  });
}

const rates = new RatesBoard();
getStocks();
setInterval(getStocks, 60000);

// Операции с деньгами

const money = new MoneyManager();
const fav = new FavoritesWidget();

money.addMoneyCallback = data => {
    ApiConnector.addMoney(data, r => {
        refresh(r, `Пополнили баланс на ${data.amount} ${data.currency}`, ProfileWidget.showProfile, money)
    })
}

//






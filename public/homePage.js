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
};

// Получение текущих курсов валюты

const getStocks = () => {
  ApiConnector.getStocks((r) => {
    if (r.success) {
      rates.clearTable();
      rates.fillTable(r.data);
    }
  });
};

const rates = new RatesBoard();
getStocks();
setInterval(getStocks, 60000);

// Операции с деньгами

const money = new MoneyManager();

// Пополнение

money.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (r) => {
    refresh(
      r,
      `Пополнили баланс на ${data.amount} ${data.currency}`,
      ProfileWidget.showProfile,
      money
    );
  });
};

// Конвертация

money.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (r) => {
    refresh(
      r,
      `Конвертировали ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`,
      ProfileWidget.showProfile,
      money
    );
  });
};

// Перевод

money.sendMoneyCallback = (data) => {
  if (data.amount > 0 && data.currency) {
    // проверяем, чтобы не 0, и чтобы валюта была выбрана (так как api пропускает 0)
    ApiConnector.transferMoney(data, (r) => {
      refresh(
        r,
        `Перевели ${data.amount} ${data.currency} пользователю с ID ${data.to}`,
        ProfileWidget.showProfile,
        money
      );
    });
  } else {
    money.setMessage(true, 'Будьте внимательнее :-)');
  }
};

// Избранное

const fav = new FavoritesWidget();

const updateFav = (list) => {
  fav.clearTable();
  fav.fillTable(list);
  money.updateUsersList(list);
};

ApiConnector.getFavorites((r) => {
  if (r.success) {
    updateFav(r.data);
  }
});

fav.addUserCallback = () => {
  const user = fav.getData();
  if (parseInt(user.id)) {
  ApiConnector.addUserToFavorites(user, (r) =>
    refresh(
      r,
      `Пользователь ${user.name} с ID ${user.id} добавлен в избранное`,
      updateFav,
      fav
    )
  );
  } else {
    fav.setMessage(true, 'Корявый ID');
  }
};

fav.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (r) => {
    refresh(r, `Пользователь c ID ${id} удален из избранного`, updateFav, fav);
  });
};

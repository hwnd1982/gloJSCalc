'use strict';

let money,
// Проверка являются ли полученные данные числом
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
// Запрашивает уровень дохода у пользователя и сохраняет в переменную money
  start = function() {
    do {
      money = prompt('Ваш месячный доход?');
    } while (!isNumber(money));
  },
  appData = {
    budget: 0,
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    mission: 50000,
    period: 12,
    budgetMonth: 0,
    expensesMonth: 0,
    budgetDay: 0,
    asking: function() {
      let userResponse = prompt('Перечислите возможные расходы через запятую:') || '';
      
      appData.budget = money;
      if (userResponse) {
        appData.addExpenses = userResponse.toLowerCase().split(',');
      }
      appData.deposit = confirm('Есть ли у вас депозит в банке?');
      for (let i = 0; i < 2; i++) {
        let amount, expenses = prompt('Введите обязательную статью расходов:');
        
        while (appData.expenses[expenses]) {
          expenses = prompt('Статьи не должны называтся одинаково! Повторите ввод:');
        }
        do {
          amount = prompt('Во сколько это обойдется?');
        } while (!isNumber(amount));
        appData.expenses[expenses] = amount;
      }
      appData.getExpensesMonth();
      appData.getBudget();
      appData.getTargetMonth();
      appData.getTargetMonth();
    },
    getExpensesMonth: function() {
      let summ = 0;
      for (let key in appData.expenses) {
        summ += +appData.expenses[key];
      }
      appData.expensesMonth = summ;
    },
    getBudget: function() {
      appData.budgetMonth = appData.budget - appData.expensesMonth;
      appData.budgetDay = Math.floor(appData.budgetMonth / 30, 0);
    },
    getTargetMonth: function() {
      appData.period = Math.ceil(appData.mission / appData.budgetMonth);
    },
    getStatusIncome: function() {
      if (appData.budgetDay > 1200) {
        return('У вас высокий уровень дохода');
      } else {
        if (appData.budgetDay <= 1200 && appData.budgetDay >= 600) {
          return('У вас средний уровень дохода');
        } else {
          if (appData.budgetDay < 600 &&  appData.budgetDay > 0){
            return('К сожалению у вас уровень дохода ниже среднего');
          } else {
            return('Что то пошло не так');
          }
        }
      }
    }
  };

start();
appData.asking();

const
// Возращает строку для вывода "значение + единицы измерения"
// В зависимости от значение выбирается нужное склонение единиц измерения
  getDeclensionOfStringByNumber = function(num, expressions) { 
    switch (true) {
      case +((num += '').substr(-2)) > 10  &&  
        +((num += '').substr(-2)) <= 20 : 
          return num  + ' ' + expressions[2];
      case num % 10 === 0: return num  + ' ' + expressions[2];
      case num % 10 === 1: return num  + ' ' + expressions[0];
      case num % 10 < 5: return num  + ' ' + expressions[1];
      default: return num  + ' ' + expressions[2];
    }
  };

console.log(`Расходы за месяц: ${appData.expensesMonth}`);

console.log( `${appData.period > 0 &&  appData.period !== Infinity ?
  `Цель будет достигнута за: ${getDeclensionOfStringByNumber(appData.period, ['месяц', 'месяца', 'месяцев'])}` :
  'Цель не будет достигнута!'}`);
console.log(appData.getStatusIncome(appData.budgetDay));

console.log(`Наша программа включает в себя данные:`);
for (let key in appData) {
  if (typeof appData[key] !== 'function') {
    console.log('\t Свойство', key, ': ', appData[key]);
  } else {
    console.log('\t Метод:', key);
  }
}
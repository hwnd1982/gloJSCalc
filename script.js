'use strict';

let money;
// Проверка являются ли полученные данные числом
const
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  checkSpaces = function(str) {
    return !str ? str : str.trim() !== '';
  },
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
  },
// Запрашивает уровень дохода у пользователя и сохраняет в переменную money
  start = function() {
    do {
      money = prompt('Ваш месячный доход?', 50000);
    } while (!isNumber(money));
  },
  appData = {
    budget: 0,
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    mission: 50000,
    period: 12,
    budgetMonth: 0,
    expensesMonth: 0,
    budgetDay: 0,
    asking: function() {
      if (confirm('Есть ли у Вас дополнительный источник заработока?')) {
        let itemIncome, cashIncome;
        
        do {
          itemIncome = prompt('Какой у Вас дополнительный заработок?', 'Пеку хлеб');
        } while(isNumber(itemIncome) || !checkSpaces(itemIncome));

        do {
          cashIncome = prompt('Сколько в месяц зарабатываете на этом?', 5000);
        } while(!isNumber(cashIncome));
        appData.income[itemIncome] = cashIncome;
      }
      
      let userResponse = prompt('Перечислите возможные расходы через запятую:', 
        'Интернет, Такси, Коммунальные расходы') || '';
      
      appData.budget = money;
      if (userResponse) {
        appData.addExpenses = userResponse.toLowerCase().split(',').reduce((formatArray, item) => {
          if (item.trim()) {
            formatArray.push(item.trim());
          }
  
          return formatArray;
        },[]);
      }
      appData.deposit = confirm('Есть ли у вас депозит в банке?');
      appData.getInfoDeposit();
      for (let i = 0; i < 2; i++) {
        let amount, expenses;
        do {
          if (appData.expenses[expenses]) {
            expenses = prompt('Статьи не должны называтся одинаково! Повторите ввод:');
          } else {
            expenses = prompt('Введите обязательную статью расходов:');
          }
        } while (isNumber(expenses) || appData.expenses[expenses] || !checkSpaces(expenses));
        do {
          amount = prompt('Во сколько это обойдется?');
        } while (!isNumber(amount));
        appData.expenses[expenses] = amount;
      }
      appData.getExpensesMonth();
      appData.getBudget();
    },
    getExpensesMonth: function() {
      for (let key in appData.expenses) {
        appData.expensesMonth += +appData.expenses[key];
      }
    },
    getBudget: function() {
      appData.budgetMonth = appData.budget - appData.expensesMonth;
      appData.budgetDay = Math.floor(appData.budgetMonth / 30, 0);
    },
    getTargetMonth: function() {
      return Math.ceil(appData.mission / appData.budgetMonth);
    },
    getStatusIncome: function() {
      switch (true) {
        case appData.budgetDay > 1200:
          return('У вас высокий уровень дохода');
        case appData.budgetDay <= 1200 && appData.budgetDay >= 600:
          return('У вас средний уровень дохода');
        case appData.budgetDay < 600 &&  appData.budgetDay > 0:
          return('К сожалению, ваш уровень дохода ниже среднего');
        default:
          return('Что то пошло не так');
      }
    },
    getInfoDeposit: function() {
      if (appData.deposit) {
        do {
          appData.percentDeposit = prompt('Какой годовой процент,', 4);
        } while(!isNumber(appData.percentDeposit));
        do {
          appData.moneyDeposit = prompt('Какая сумма заложена?', 150000);
        } while(!isNumber(appData.moneyDeposit));
        
      }
    }, 
    calcSavedMoney: function() {
      return appData.budgetMonth * appData.period;
    },
    getAddExpenses: function() {
      return appData.addExpenses.reduce((addExpensesAll, expenses) => {
        return addExpensesAll ? 
          addExpensesAll + ', ' + expenses[0].toUpperCase() + expenses.slice(1) : 
            expenses[0].toUpperCase() + expenses.slice(1);
      }, '');
    }
  };

start();
appData.asking();

console.log(`Расходы за месяц: ${appData.expensesMonth}`);
console.log( `${appData.getTargetMonth() > 0 &&  appData.getTargetMonth() !== Infinity ?
  `Цель будет достигнута за: ${getDeclensionOfStringByNumber(
      appData.getTargetMonth(), ['месяц', 'месяца', 'месяцев']
    )}` : 'Цель не будет достигнута!'}`);
console.log(appData.getStatusIncome(appData.budgetDay));
console.log(`Наша программа включает в себя данные:`);
for (let key in appData) {
  if (typeof appData[key] !== 'function') {
    console.log('\t Свойство', key, ': ', appData[key]);
  } else {
    console.log('\t Метод:', key);
  }
}
console.log('Возможные расходы:', appData.getAddExpenses());
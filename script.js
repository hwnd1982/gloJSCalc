'use strict';

let expenses = [];

const
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },   
  start = function() {
    let money;

    do {
      money = prompt('Ваш месячный доход?');
    } while (!isNumber(money));
    return money;
  },
  money = start(),
  income = 'Рента', 
  addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:') || '',
  deposit = confirm('Есть ли у вас депозит в банке?'), 
  mission = 500021, 
  showTypeOf = function(data) {
    console.log(`тип данных: ${typeof data};\nзначение: ${data || 'Данные введены некорректно!'};`);
  },
  getStatusIncome = function(budgetDay) {
    if (budgetDay > 1200) {
      return('У вас высокий уровень дохода');
    } else {
      if (budgetDay <= 1200 && budgetDay >= 600) {
        return('У вас средний уровень дохода');
      } else {
        if (budgetDay < 600 &&  budgetDay > 0){
          return('К сожалению у вас уровень дохода ниже среднего');
        } else {
          return('Что то пошло не так');
        }
      }
    }
  },
  getExpensesMonth = function() {
    let summ = 0;

    for (let i = 0; i < 2; i++) {
      expenses[i] = prompt('Введите обязательную статью расходов:');
      let amount;
      do {
        amount = prompt('Во сколько это обойдется?');
      } while (!isNumber(amount));
      summ += +amount;
    }
    return summ;
  },
  expensesAmount = getExpensesMonth(),
  getAccumulatedMonth = function(incomes, expenses) {
    return incomes - expenses;
  },
  accumulatedMonth = getAccumulatedMonth(money, expensesAmount),
  budgetDay = Math.floor(accumulatedMonth / 30, 0),
  getTargetMonth = function(means, target) {
    return Math.ceil(target / means);
  },
  period = getTargetMonth(accumulatedMonth, mission),
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

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

console.log(`Расходы за месяц: ${expensesAmount}`);
console.log(`Список дополнительных рассходов (addExpenses): 
  ${addExpenses.toLocaleLowerCase().split(',').length === 1 && 
  !addExpenses.toLocaleLowerCase().split(',')[0] ? 
  'список пуст...' : 
  addExpenses.toLocaleLowerCase().split(',')}`);

console.log( `${period > 0 &&  period !== Infinity ?
  `Цель будет достигнута за: ${getDeclensionOfStringByNumber(period, ['месяц', 'месяца', 'месяцев'])}` :
  'Цель не будет достигнута!'}`);

console.log(`Дневной бюджет: ${getDeclensionOfStringByNumber(budgetDay, ['рубль', 'рубля', 'рублей'])}`);
console.log(getStatusIncome(budgetDay));
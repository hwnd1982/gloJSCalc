'use strict';

const money = +prompt('Ваш месячный доход?'), 
  income = 'Рента', 
  addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:') || '',
  deposit = confirm('Есть ли у вас депозит в банке?'), 
  mission = 500021, 
  expenses1 = prompt('Введите обязательную статью расходов:'),
  amount1 = +prompt('Во сколько это обойдется?'),
  expenses2 = prompt('Введите обязательную статью расходов:'),
  amount2 = +prompt('Во сколько это обойдется?'),
  showTypeOf = function(data) {
    console.log(`тип данных: ${typeof data};
значение: ${data || 'Данные введены некорректно!'};`);
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
  getExpensesMonth = function(...theArgs) {
    return theArgs.reduce(function(summ, arg) {
      return summ + (arg && typeof arg === 'number' ? arg : 0);
    });
  },
  getAccumulatedMonth = function(incomes, expenses) {
    return incomes - expenses;
  },
  accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amount1, amount2)),
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

console.log(`Расходы за месяц: ${getExpensesMonth(amount1, amount2)}`);
console.log(`Список дополнительных рассходов (addExpenses): 
  ${addExpenses.toLocaleLowerCase().split(',').length === 1 && 
  !addExpenses.toLocaleLowerCase().split(',')[0] ? 
  'список пуст...' : 
  addExpenses.toLocaleLowerCase().split(',')}`);

console.log( `${period > 0 &&  period !== Infinity ?
  `Удастся накопить за: ${getDeclensionOfStringByNumber(period, ['месяц', 'месяца', 'месяцев'])}` :
  'К сожалению, с текущим уровнем доходов данная цель не достижима!'}`);

console.log(`Дневной бюджет: ${getDeclensionOfStringByNumber(budgetDay, ['рубль', 'рубля', 'рублей'])}`);
console.log(getStatusIncome(budgetDay));
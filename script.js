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
  showTypeOf = (data) => {
    console.log(`тип данных: ${typeof data};\nзначение: ${data || 'Данные введены некорректно!'};`);
  },
  getStatusIncome = (budgetDay) => {
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
  getExpensesMonth = (...theArgs) => {
    return theArgs.reduce((summ, arg) => {
      return summ + (arg && typeof arg === 'number' ? arg : 0);
    });
  },
  getAccumulatedMonth = (incomes, expenses) => {
    return incomes - expenses;
  },
  accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amount1, amount2)),
  budgetDay = Math.floor(accumulatedMonth / 30, 0),
  getTargetMonth = (means, target) => {
    return Math.ceil(target / means);
  },
  period = getTargetMonth(accumulatedMonth, mission);

showTypeOf(money);
showTypeOf(income);
showTypeOf(deposit);

console.log(`Расходы за месяц: ${getExpensesMonth(amount1, amount2)}`);
console.log(`Список дополнительных рассходов (addExpenses): 
  ${addExpenses.toLocaleLowerCase().split(',').length === 1 && 
  !addExpenses.toLocaleLowerCase().split(',')[0] ? 
  'список пуст...' : 
  addExpenses.toLocaleLowerCase().split(',')}`);

console.log(`${period > 0 &&  period !== Infinity ? `Удастся накопить за: ${period} месяц${period % 10 === 1 ?
  '' : period % 10 !== 0 && period % 10 < 5 ? 'а' : 'ев'}` : 
'К сожалению, с текущим уровнем доходов данная цель не достижима!'}`);

console.log(`Дневной бюджет: ${budgetDay}`);
console.log(getStatusIncome(budgetDay));
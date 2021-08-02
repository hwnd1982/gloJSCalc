'use strict';

const money = +prompt('Ваш месячный доход?'), 
  income = 'рента', 
  addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:') || '',
  deposit = confirm('Есть ли у вас депозит в банке?'), 
  mission = 500021, 
  expenses1 = prompt('Введите обязательную статью расходов:'),
  amount1 = +prompt('Во сколько это обойдется?'),
  expenses2 = prompt('Введите обязательную статью расходов:'),
  amount2 = +prompt('Во сколько это обойдется?'),
  budgetMonth = money - amount1 - amount2,
  budgetDay = Math.floor(budgetMonth / 30, 0),
  period = Math.ceil(mission / budgetMonth, 0);

console.log(`Переменная (money):
  тип данных: ${typeof money};
  значение: ${money || 'Данные введены некорректно!'};
Переменная (income):
  тип данных: ${typeof income};
  значение: ${income};
Переменная (deposit):
  тип данных: ${typeof deposit};
  значение: ${deposit};`);

console.log(`Длина строки (addExpenses): ${addExpenses.length}`);

console.log(`Цель заработать ${mission} рубл${mission % 10 === 1 ?
  'ь' : mission % 10 !== 0 && mission % 10 < 5 ?
  'я' : 'ей'}`);

console.log(`Удастся накопить за: ${period} месяц${period % 10 === 1 ?
  '' : period % 10 !== 0 && period % 10 < 5 ? 'а' : 'ев'}`);

console.log(`Список дополнительных рассходов (addExpenses): 
  ${addExpenses.toLocaleLowerCase().split(',').length === 1 && 
  !addExpenses.toLocaleLowerCase().split(',')[0] ? 
  'список пуст...' : 
  addExpenses.toLocaleLowerCase().split(',')}`);
console.log(`Бюджет на месяц: ${budgetMonth}`);
console.log(`Дневной бюджет: ${budgetDay}`);

if (budgetDay > 1200) {
  console.log('У вас высокий уровень дохода');
} else {
  if (budgetDay <= 1200 && budgetDay >= 600) {
    console.log('У вас средний уровень дохода');
  } else {
    if (budgetDay < 600 &&  budgetDay >= 0){
      console.log('К сожалению у вас уровень дохода ниже среднего');
    } else {
      console.log('Что то пошло не так');
    }
  }
}

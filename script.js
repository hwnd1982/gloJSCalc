const money = 150000, 
  income = 'рента', 
  addExpenses = 'Образование, Автомобиль, Дети, Отдых', 
  deposit = true, 
  mission = 500021, 
  period = 21;
let budgetDay = money / 30;

console.log('Переменная (money):\n\tтип данных:', 
  typeof money, '\n\tзначение:', money,
  '\n\nПеременная (income):\n\tтип данных:', 
  typeof income, '\n\tзначение:', income,
  '\n\nПеременная (deposit):\n\tтип данных:', 
  typeof deposit, '\n\tзначение:', deposit);

console.log('Длина строки (addExpenses):', addExpenses.length);

console.log(`Период равен ${period} месяц${period % 10 === 1 ?
   '' : period % 10 !== 0 && period % 10 < 5 ? 'а' : 'ев'}`);

console.log(`Цель заработать ${mission} рубл${mission % 10 === 1 ?
   'ь' : mission % 10 !== 0 && mission % 10 < 5 ?
    'я' : 'ей'}`);

 console.log('Список дополнительных рассходов (addExpenses):\n\t', 
  addExpenses.toLocaleLowerCase().split(', '));
  
console.log('Дневной бюджет: ', budgetDay);

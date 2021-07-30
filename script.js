let money = 150000, 
  income = 'рента', 
  addExpenses = 'Образование, Автомобиль, Дети, Отдых', 
  deposit = true, 
  mission = 500000, 
  period = 3;

console.log('Переменная (money):\n\tтип данных:', 
  typeof money, '\n\tзначение:', money,
  '\n\nПеременная (income):\n\tтип данных:', 
  typeof income, '\n\tзначение:', income,
  '\n\nПеременная (deposit):\n\tтип данных:', 
  typeof deposit, '\n\tзначение:', deposit);

console.log('Длина строки (addExpenses):', addExpenses.length);

console.log(`Период равен ${period} месяц${period === 1 ?
   '' : period !== 0 && period < 5 ? 'а' : 'ев'}`);

console.log(`Цель заработать ${mission} рубл${mission % 10 === 1 ?
   'ь' : mission % 10 !== 0 && mission % 10 < 5 ?
    'я' : 'ей'}`);

addExpenses = addExpenses.toLocaleLowerCase();
 console.log('Список дополнительных рассходов (addExpenses):\n\t', addExpenses.split(', '));



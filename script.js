const money = 150000, 
  income = 'рента', 
  addExpenses = 'Образование, Автомобиль, Дети, Отдых', 
  deposit = true, 
  mission = 500021, 
  period = 21,
  budgetDay = money / 30;

console.log(`Переменная (money):
  тип данных: ${typeof money};
  значение: ${money};
Переменная (income):
  тип данных: ${typeof income};
  значение: ${income};
Переменная (deposit):
  тип данных: ${typeof deposit};
  значение: ${deposit};`);

console.log(`Длина строки (addExpenses): ${addExpenses.length}`);

console.log(`Период равен ${period} месяц${period % 10 === 1 ?
  '' : period % 10 !== 0 && period % 10 < 5 ? 'а' : 'ев'}`);

console.log(`Цель заработать ${mission} рубл${mission % 10 === 1 ?
  'ь' : mission % 10 !== 0 && mission % 10 < 5 ?
  'я' : 'ей'}`);

console.log(`Список дополнительных рассходов (addExpenses): 
  ${addExpenses.toLocaleLowerCase().split(',')}.`);
  
console.log(`Дневной бюджет: ${budgetDay}`);

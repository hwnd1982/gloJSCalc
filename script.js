'use strict';

// 1. Объявление переменный

// Константы
const 
  income = 'Рента', 
  mission = 500021;

// Переменные
let money,
  addExpenses,
  deposit,
  expenses = [],
  expensesAmount,
  accumulatedMonth,
  period,
  budgetDay;

// Функции
const
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
// Выводит значение и тип данных
  showTypeOf = function(data) {
    console.log(`тип данных: ${typeof data};\nзначение: ${data || 'Данные введены некорректно!'};`);
  },
// В зависимости от значения уровень доходов
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
// Запрашивает у пользователя статьи расходов и суммы, 
// назвение сохраняте в expenses, возвращует общую сумму расзодов
  getExpensesMonth = function(count = 2) {
    let summ = 0;

    for (let i = 0; i < count; i++) {
      expenses[i] = prompt('Введите обязательную статью расходов:');
      let amount;
      do {
        amount = prompt('Во сколько это обойдется?');
      } while (!isNumber(amount));
      summ += +amount;
    }
    return summ;
  },
// Возвращает остаток свободных средств в месяц
  getAccumulatedMonth = function(incomes, expenses) {
    return incomes - expenses;
  },
// Возвращает за сколько месяцев будет достигнута цель
  getTargetMonth = function(means, target) {
    return Math.ceil(target / means);
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
  };

// 2. Присвоение значений переменным
start();
addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую:') || '';
deposit = confirm('Есть ли у вас депозит в банке?');
expensesAmount = getExpensesMonth();
accumulatedMonth = getAccumulatedMonth(money, expensesAmount);
period = getTargetMonth(accumulatedMonth, mission);
budgetDay = Math.floor(accumulatedMonth / 30, 0);

// 3. Вывод даенных
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
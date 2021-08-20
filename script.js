'use strict';

let
  expensesItems = document.querySelectorAll('.expenses-items'),
  incomeItems = document.querySelectorAll('.income-items');
const
  start = document.getElementById('start'),
  addIncomeBlockButton = document.querySelector('.income').getElementsByTagName('button')[0], 
  addExpensesBlockButton = document.querySelector('.expenses').getElementsByTagName('button')[0],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
  budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
  budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
  expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
  additionalIncomeValue  = document.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
  targetMonthValue = document.getElementsByClassName('target_month-value')[0],
  salaryAmount = document.querySelector('.salary-amount'),
  incomeTitle = document.querySelector('input.income-title'),
  expensesTitle = document.querySelector('input.expenses-title'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  isNumber = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  checkSpaces = function(str) {
    return !str ? str : str.trim() !== '';
  },
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
  appData = {
    budget: 0,
    income: {},
    incomeMonth: 0,
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposit: 0,
    moneyDeposit: 0,
    budgetMonth: 0,
    expensesMonth: 0,
    budgetDay: 0,
    start: function() {
      appData.budget = +salaryAmount.value;
      appData.getIncome();
      appData.getExpenses();
      appData.getAddExpenses();
      appData.getIncomeMonth();
      appData.getExpensesMonth();
      appData.getAddIncome();
      appData.getBudget();
      appData.showResult();
    },
    checkSalaryAmount: function() {
      if (isNumber(salaryAmount.value)) {
        start.removeAttribute("disabled");
        start.addEventListener('click', appData.start);
      } else {
        salaryAmount.value = salaryAmount.value.slice(0, -1);
        alert('Ошибка, корректно заполните поле "Месячный доход"!');
      }
    },
    addExpensesBlock: function() {
      expensesItems[0].parentNode.insertBefore(expensesItems[0].cloneNode(true), addExpensesBlockButton);
      expensesItems = document.querySelectorAll('.expenses-items');
      if (expensesItems.length === 3) {
        addExpensesBlockButton.style.display = 'none';
      }
    },
    addIncomeBlock: function() {
      incomeItems[0].parentNode.insertBefore(incomeItems[0].cloneNode(true), addIncomeBlockButton);
      incomeItems = document.querySelectorAll('.income-items');
      if (incomeItems.length === 3) {
        addIncomeBlockButton.style.display = 'none';
      }
    },
    changePeriod: function() {
      document.querySelector('.period-amount').textContent = periodSelect.value;
    },
    getExpenses: function() {
      expensesItems.forEach(function(item) {
        let 
          itemExpenses = item.querySelector('.expenses-title').value, 
          cashExpenses = item.querySelector('.expenses-amount').value;

          if (itemExpenses !== '' && cashExpenses !== '') {
            appData.expenses[itemExpenses] = cashExpenses;
          }
      });
    },
    getIncome: function() {
      incomeItems.forEach(function(item) {
        let 
          itemIncome = item.querySelector('.income-title').value, 
          cashIncome = item.querySelector('.income-amount').value;

          if (itemIncome !== '' && cashIncome !== '') {
            appData.income[itemIncome] = cashIncome;
          }
      });
    },
    showResult: function() {
      budgetMonthValue.value = appData.budgetMonth;
      budgetDayValue.value = appData.budgetDay;
      expensesMonthValue.value = appData.expensesMonth;
      additionalExpensesValue.value = appData.addExpenses.join(', ');
      additionalIncomeValue.value = appData.addIncome.join(', ');
      targetMonthValue.value = appData.getTargetMonth();
      
      periodSelect.addEventListener('input', appData.showResult);
    },
    getAddExpenses: function() {
      let addExpenses = additionalExpensesItem.value.split(',');
      
      addExpenses.forEach(function(item) {
        item = item.trim();
        if (item !== '') {
          appData.addExpenses.push(item);
        }
      });
    },
    getAddIncome: function() {
      additionalIncomeItems.forEach(function(item) {
        let itemValue = item.value.trim();

        if (itemValue !== '') {
          appData.addIncome.push(itemValue);
        }
      });
    },
    getExpensesMonth: function() {
      for (let key in appData.expenses) {
        appData.expensesMonth += +appData.expenses[key];
      }
    },
    getIncomeMonth: function() {
      for (let key in appData.income) {
        appData.incomeMonth += +appData.income[key];
      }
    },
    getBudget: function() {
      appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
      appData.budgetDay = Math.floor(appData.budgetMonth / 30, 0);
    },
    getTargetMonth: function() {
      return Math.ceil(targetAmount.value / appData.budgetMonth);
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
      return appData.budgetMonth * periodSelect.value;
    },
  };

start.setAttribute("disabled", true);
salaryAmount.addEventListener('input', appData.checkSalaryAmount);
addExpensesBlockButton.addEventListener('click', appData.addExpensesBlock);
addIncomeBlockButton.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', appData.changePeriod);
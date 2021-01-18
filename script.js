'use strict';

class Account {
  userName;

  constructor(owner, movements, interestRate, pin) {
    this.owner = owner;
    this.movements = movements;
    this.interestRate = interestRate; // %
    this.pin = pin;
  }
}

const account1 = new Account(
  'Gaetan Bloch',
  [200, 450, -400, 3000, -650, -130, 70, 1300],
  1.2,
  1111,
);

const account2 = new Account(
  'Jessica Davis',
  [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  1.5,
  2222,
);

const account3 = new Account(
  'Steven Thomas Williams',
  [200, 450, -400, 3000, -650, -130, 70, 1300],
  0.7,
  3333,
);

const account4 = new Account(
  'Sarah Smith',
  [430, 1000, 700, 50, 90],
  1,
  4444,
);

const accounts = [account1, account2, account3, account4];

// Elements
const app = document.querySelector('.app');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////
// Functions
////////////////////

// Movements
const displayMovements = (movements) => {
  // Clear the movements
  containerMovements.innerHTML = '';
  movements.forEach((movement, i) => {
    const type = movement < 0 ? 'withdrawal' : 'deposit';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${movement} €</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Balance
const displayBalance = movements =>
  labelBalance.textContent = movements.reduce((acc, cur) => acc + cur) + ' €';

// Statistics
const displaySum = (movements, label, filter) =>
  label.textContent = Math.abs(movements
    .filter(mov => filter(mov))
    .reduce((acc, mov) => acc + mov)) + ' €';

//// IN
const displayIn = movements =>
  displaySum(movements, labelSumIn, mov => mov > 0);

//// OUT
const displayOut = movements =>
  displaySum(movements, labelSumOut, mov => mov < 0);

//// Interests
const displayInterests = account => {
  labelSumInterest.textContent = account
    .movements
    .filter(mov => mov > 0)
    .map(mov => mov * account.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int) + ' €';
};

// Login

//// User names
const createUserName = user =>
  user
    .trim()
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');

const createUserNames = accounts =>
  accounts.forEach(account => account.userName = createUserName(account.owner));

//// Credentials

const getCredentials = () => {
  const account = accounts.find(account => {
      console.log(account.userName, inputLoginUsername.value);
      return account.userName === inputLoginUsername.value;
    },
  );
  console.log(account);
  return account && account.pin === Number(inputLoginPin.value)
    ? account
    : undefined;
};

const login = (event) => {
  // Prevent the page to be reloaded on form submit
  event.preventDefault();

  const account = getCredentials();
  if (!account) {
    alert('Wrong credentials!');
    return;
  }
  app.style.opacity = '1';
  const owner = account.owner;
  labelWelcome.textContent = 'Good Day, ' + owner.slice(0, owner.indexOf(' '));

  displayMovements(account.movements);
  displayBalance(account.movements);
  displayIn(account.movements);
  displayOut(account.movements);
  displayInterests(account);
};

// Initialize
const init = () => {
  createUserNames(accounts);
  btnLogin.addEventListener('click', login);
};

init();
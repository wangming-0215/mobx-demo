# TypeScript 整洁之道

## 变量

### 变量名要有意义

做有意义的区分, 让读者更容易理解变量的含义。

**Bad**

```ts
function between<T>(a1: T, a2: t, a3: T): boolean {
  return a2 <= a1 && a1 <= a3;
}
```

**Good**

```ts
function between<T>(value: T, left: T, right: T): boolean {
  return left <= value && value <= right;
}
```

### 变量可拼读

如果你不能读出它，你在讨论它时听起来就会像个白痴

**Bad**

```ts
type DtaRcrd102 = {
  genymdhms: Date;
  modymdhms: Date;
  pszqint: number;
};
```

**Good**

```ts
type Customer = {
  generationTimestamp: Date;
  modificationTimestamp: Date;
  recordId: number;
};
```

### 对功能一致的变量采用统一的命名

**Bad**

```ts
function getUserInfo(): User;
function getUserDetails(): User;
function getUserData(): User;
```

**Good**

```ts
function getUser(): User;
```

### 使用可检索的名字

我们读代码要比写的多，所以易读性和可检索非常重要。如果不命名那些对理解程序有意义的变量，那么就坑了读代码的人。代码要可检索，像 TSLint 这样的工具可以帮助识别未命名的变量。

**Bad**

```ts
// 86400000 到底是什么 ????
setTimeout(restart, 86400000);
```

**Good**

```ts
// 将它们生命为大写的命名常量
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

setTimeout(restart, MILLISECONDS_IN_A_DAY);
```

### 使用自解释的变量名

**Bad**

```ts
declare const users: Map<string, User>;

for (const keyValue of users) {
  // do something
}
```

**Good**

```ts
declare const users: Map<string, User>;

for (const [id, user] of users) {
  // do something
}
```

### 避免心理映射

显式由于隐式。*明确*才是王道

**Bad**

```ts
const u = getUser();
const s = getSubscription();
const t = charge(u, s);
```

**Good**

```ts
const user = getUser();
const subscription = getSubsctiption();
const transaction = charge(user, subscription);
```

### 不要添加无用的上下文

如果你的类/类型/对象的名字已经表达了某些信息， 那么在内部的变量名中就不要在再重复表达

**Bad**

```ts
type Car = {
  carMake: string;
  carModel: string;
  carColor: string;
};

function print(car: Car): void {
  console.log(`${car.carMake} ${car.carModel} ${car.carColor}`);
}
```

**Good**

```ts
type Car = {
  make: string;
  model: string;
  color: string;
};

function print(car: Car): void {
  console.log(`${car.make} ${car.model} ${car.color}`);
}
```

### 使用默认参数，而不是短路或者条件判断

通常，默认参数比短路更简洁

**Bad**

```ts
function loadPages(count?: number) {
  const loadCount = count !== undefined ? count : 10;
  // do something else;
}
```

**Good**

```ts
function loadPages(count: number = 10) {
  // do something else;
}
```

## 函数

### 函数参数越少越好，理想情况下不超过 2 个

限制函数参数的个数很重要，因为这样函数测试会更容易。超过 3 个参数，在传参时就会有多种不同组合，需要对每个参数的不同场景进行测试，增加复杂度。

理想情况，只有一两个参数。如果有两个以上的参数，那么您的函数可能就太过复杂了。

如果需要很多参数，请您考虑使用对象。

为了使函数的属性更清晰，可以使用解构，它有以下优点：

1. 当有人查看函数签名时，会立即清楚使用了哪些属性。

2. 解构对传递给函数的参数对象做深拷贝，这可预防副作用。(注意：不会克隆从参数对象中解构的对象和数组)

3. TypeScript 会对未使用的属性显示警告

**Bad**

```ts
function createMenu(
  title: string,
  body: string,
  buttonText: string,
  cancellable: boolean
) {
  // do something
}

createMenu('Foo', 'Bar', 'Baz', true);
```

**Good**

```ts
function createMenu(options: {
  title: string;
  body: string;
  buttonText: string;
  cancellable: boolean;
}) {
  // do something;
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
});
```

[type aliases](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases)可以进一步提高可读性。

```ts
type MenuOptions = {
  title: string;
  body: string;
  buttonText: string;
  cancellable: boolean;
};

function createMenu(options: MenuOptions) {
  // do something
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
});
```

### 只做一件事

这是迄今为止软件工程中最重要的规则。如果函数做了不止一件事情，它将难以组合、测试以及理解。相反，如果函数只做一件事情，它就更易于重构，代码也会更加清晰。如果您只从本指南中了解到这一点，那么您就领先多数程序员了。

**Bad**

```ts
function emailClients(clients: Client[]) {
  clients.forEach(client => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```

**Good**

```ts
function emailClients(clients: Client[]) {
  clients.filter(isActiveClient).forEach(email);
}

function isActiveClient(client: Client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

### 函数名应该表达出它要做的事情

**Bad**

```ts
function addToDate(data: Date, month: number): Date {
  // do something;
}

const date = new Date();

// It's hard to tell from the function name what is added
addToDate(date, 1);
```

**Good**

```ts
function addMonthToDate(date: date, month: number): Date {
  // do something;
}

const date = new Date();
addMonthToDate(date, 1);
```

### 函数应该只有一个抽象级别

当你的函数有多个抽象级别时，这个函数做了太多的事情。拆分函数以便复用，也让测试更容易。

**Bad**

```ts
function parseCode(code: string) {
  const REGEXES = [
    /* ... */
  ];
  const statements = code.split(' ');
  const tokens = [];

  REGEXES.forEach(regex => {
    statements.forEach(statement => {
      // ...
    });
  });

  const ast = [];
  tokens.forEach(token => {
    // lex...
  });

  ast.forEach(node => {
    // parse...
  });
}
```

**Good**

```ts
const REGEXES = [
  /* ... */
];

function parseCode(code: string) {
  const tokens = tokenize(code);
  const syntaxTree = parse(tokens);

  syntacTree.forEach(node => {
    // parse
  });
}

function tokenize(code: string): Token[] {
  const statements = code.split(' ');
  const tokens: Token[] = [];

  REGEXES.forEach(regex => {
    statement.forEach(statement => {
      tokens.push(/* ... */);
    });
  });

  return tokens;
}

function parse(tokens: Token[]): SyntaxTree {
  const syntaxTree: SyntaxTree[] = [];
  tokens.forEach(token => {
    syntaxTree.push(/* ... */);
  });
  return syntaxTree;
}
```

### 移除重复（冗余）代码

竭尽全力避免重复代码。重复代码是不好的。因为它意味着当你需要修改一些逻辑时，会有多个地方需要修改。

通常，存在重复代码是因为有两个或两个以上很相似的功能，他们共享了大部分逻辑。但是它们的不同之处迫使你使用两个或者更多独立的函数来处理大量相同的逻辑。移除重复代码意味着创建一个抽象，这个抽象通过函数/类/模块就可以处理这组不同的东西。

合理的抽象至关重要，这就是为什么你要遵循`SOLID原则`。糟糕的抽象可能还不如重复代码，所以要小心。话虽如此，还是要做好抽象，尽量不要重复。

**Bad**

```ts
function showDeveloperList(developers: Developer[]) {
  developers.forEach(developer => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();

    const data = {
      expectedSalary,
      experience,
      githubLink
    };

    render(data);
  });
}

function showManagerList(managers: Manager[]) {
  managers.forEach(manager => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();
  });

  const data = {
    expectedSalary,
    experience,
    portfolio
  };

  render(data);
}
```

**Good**

```ts
class Developer {
  // ...
  getExtraDetails() {
    return {
      githubLink: this.githubLink
    };
  }
}

class Manager {
  // ...
  getExtraDetails() {
    return {
      portfolio: this.portfolio
    };
  }
}

function showEmployeeList(employee: Developer | Manager) {
  employee.forEach(employee => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();
    const extra = employee.getExtraDetails();

    const data = {
      expectedSalary,
      experience,
      extra
    };

    render(data);
  });
}
```

有时，在重复代码和引入不必要的抽象而增加复杂度之间，需要作出平衡。如果两个来自不同领域的模块，它们的实现看起来很相似，这个时候，重复是可以接受的，而且要比抽离公共代码好一点。这种情况下，抽离公共代码会导致这两个模块产生间接的依赖关系。

### 使用`Object.assign()`或者`解构`来设置默认对象

**Bad**

```ts
type MenuConfig = {
  title?: string;
  body?: string;
  buttonText?: string;
  cancellable?: boolean;
};

function createMenu(config: MenuConfig) {
  config.title = config.title || 'Foo';
  config.body = config.body || 'Bar';
  config.buttonText = config.buttonText || 'Baz';
  config.cancellable =
    config.cancellable !== undefined ? config.cancellable : true;

  // ....
}

createMenu({ body: 'Bar; });
```

**Good**

```ts
type MenuConfig = {
  title?: string;
  body?: string;
  buttonText?: string;
  cancellable?: boolean;
};

function createMenu(config: MenuConfig) {
  const menuConfig = Object.assign(
    {},
    {
      title: 'Foo',
      body: 'Bar',
      buttonText: 'Baz',
      cancellable: true
    },
    config
  );
  // ....
}

createMenu({ body: 'Bar' });
```

或者，可以使用带有默认值的解构

```ts
type MenuConfig = {
  title?: string;
  body?: string;
  buttonText?: string;
  cancellable?: boolean;
};

function createMenu({ title = 'Foo', body = 'Bar', buttonText: 'Baz', cancellable = true }: MenuConfig) {
  // do something
}

createMenu({ body: 'Bar' });
```

### 不要使用 flag 参数

Flag 参数告诉用户，这个函数不止做了一件事情。如果函数使用布尔值实现不同的代码逻辑，请考虑拆分它们。

**Bad**

```ts
function createFile(name: string, temp: boolean) {
  if (temp) {
    fs.create(`./temp/${name}`);
  } else {
    fs.create(name);
  }
}
```

**Good**

```ts
function createTempFile(name: string) {
  createFile(`./temp/${name}`);
}

function createFile(name: string) {
  fs.create(name);
}
```

### 避免副作用（part1）

但函数产生除了“一个输入一个输出”之外的行为时，这个函数就产生了副作用。比如写文件、修改全局变量或者把你的钱全部转给陌生人。

某些情况下，程序确实需要副作用。就像之前的例子中，你可能需要写文件。这时应该将这些功能集中在一起，不要用几个函数/类去写某个文件。用且只用一个`service`去完成这个功能。

重点是避免常见的陷阱。比如：在无结构对象之间共享状态，使用可变数据类型，以及不确定副作用产生的位置。

**Bad**

```ts
// Global variable referenced by following function
let name = 'Robert C. Martin';

function toBase64() {
  name = btoa(name);
}

toBase64();

// If we had another function that used this name, now it'd be a Base64 value;

console.log(name); // expected to print 'Robert C. Martin' but instead 'Um9iZXJ0IEMuIE1hcnRpbg=='
```

**Good**

```ts
const name = 'Robert C. Martin';

function toBase64(text: string): string {
  return btoa(text);
}

const encodedName = toBase64(name);
console.log(name);
```

### 避免副作用（part2）

在 JavaScript 中，原始数据类型值传递，对象/数组引用传递。

有这样一种情况，如果您的函数修改了购物车数组，用来添加购买的商品，那么其他使用该 cart 数组的函数都将受此添加操作的影响。想象一个糟糕的情况:

用户点击“购买”按钮，该按钮调用 purchase 函数，函数请求网络并将 cart 数组发送到服务器。由于网络连接不好，购买功能必须不断重试请求。恰巧在网络请求开始前，用户不小心点击了某个不想要的项目上的“Add to Cart”按钮，该怎么办？而此时网络请求开始，那么 purchase 函数将发送意外添加的项，因为它引用了一个购物车数组，addItemToCart 函数修改了该数组，添加了不需要的项。

一个很好的解决方案是 addItemToCart 总是克隆 cart，编辑它，并返回克隆。这确保引用购物车的其他函数不会受到任何更改的影响。

注意两点:

1. 在某些情况下，可能确实想要修改输入对象，这种情况非常少见。且大多数可以重构，确保没副作用！

2. 性能方面，克隆大对象代价确实比较大。还好有一些很好的库，它提供了一些高效快速的方法，且不像手动克隆对象和数组那样占用大量内存。

**Bad**

```ts
function addItemToCart(cart: CartItem[], item: Item): void {
  cart.push({ item: date: Date.now() });
}
```

**Good**

```ts
function addItemToCart(cart: CartItem[], item: Item): cartItem[] {
  return [...cart, { item, date: Date.now() }];
}
```

### 不要写全局函数

在 JavaScript 中污染全局的做法非常糟糕。这可能导致与其他库冲突，而使用你 API 的用户在代码抛出异常之前，对这一情况都一无所知。

**Bad**

```ts
declare global {
  interface Array<T> {
    diff(other: T[]): Array<T>;
  }
}

if (!Array.prototype.diff) {
  Array.prototype.diff = function<T>(other: T[]): T[] {
    const hash = new Set(other);
    return this.filter(elem => !hash.has(elem));
  };
}
```

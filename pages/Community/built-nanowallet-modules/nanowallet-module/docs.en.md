---
title: 'How to build a module for Nano Wallet'
parent: 'Community Wallet Modules'
grand_parent: Community
taxonomy:
    category:
        - docs
---

> This is a restored forum post.
> [Originally posted](https://web.archive.org/web/20210814074405/https://forum.nem.io/t/how-to-build-a-module-for-nano-wallet/2976)
> on Nov 2, 2016 by
> [Quantum_Mechanics](https://web.archive.org/web/20210814074405/https://forum.nem.io/u/Quantum_Mechanics)
{:.alert-info}

{% raw %}
In this tutorial, you'll learn how to build a module that allows a user to send XEM from the NanoWallet, easily, in a few lines of JavaScript code. All you need is a basic understanding of this programming language, the rest will be explained, so no worries if you never used AngularJS or ES6.

## I) Getting started

Download the source from: [https://github.com/NemProject/NanoWallet](https://github.com/NemProject/NanoWallet)

```bash
git clone https://github.com/NemProject/NanoWallet.git
```

Install **npm** and **gulp** if you don't have them

```bash
sudo apt-get install npm
npm install -g gulp-cli
```

Open a console and go to the path of the source folder where your gulpfile and package.json are.

Install all the needed dependencies from package.json:

```bash
npm install
```

When installation is finished, build the app:

```bash
gulp
```

It'll create a build folder with the functional version in it. We'll build using `gulp` every time we change something in the code and want to see the result.

## II) Adding a module

All modules have 4 similar files:

- **index.js**: Declare your module
- **myModule.config.js**: Declare route and other config of your module
- **myModule.controller.js**: The module core
- **myModule.html**: The module view

You can download a blank module here: [https://github.com/QuantumMechanics/NW-Module-Template](https://github.com/QuantumMechanics/NW-Module-Template)
It also contains the final module of this tutorial (example folder).

Move the blank module into the modules folder: `src/app/modules` and rename every `myModule` occurrences (in file's name and file's content) as you wish.

Open `src/app/app.js` and declare your module with others

```javascript
    import './modules/home';
    import './modules/dashboard';
    import './modules/signup';
    ...
    import './modules/portal';
    import './modules/apostille';
    import './modules/myModule';
```

Then add it in requires

```javascript
    const requires = [
        'ui.router',
        'templates',
        'app.dashboard',
        'app.transferTransaction',
        'app.createMultisig',
        'app.editMultisig',
        ...
        'ngToast',
        'ngStorage',
        'chart.js',
        'pascalprecht.translate',
        'app.lang',
        'app.changelly',
        'app.myModule'
    ];
```

Now that your module is added to the app, we need to add access to it in the portal module (it could also be accessed directly from the url you set in the config)

Open `src/app/modules/portal/portal.html` and add a panel

```html
    <div class="col-sm-4">
              <div class="panel-heading row">
                <div class="col-sm-3">
                  <i class="fa fa-4x">&#xf2bb; </i>
                </div>
                <div class="col-sm-9">
                  <h5>Module name</h5>
                </div>
              </div>
              <div class="panel-body">
                <p>Module presentation</p>
              </div>
              <div class="panelFooter">
                <button class="btn" ui-sref="app.myModule">MyModule</button>
              </div>
    </div>
```

Replace things according to your module, and you can then use gulp to build

```bash
gulp
```

Open Nano located in your `build/` folder, log into your wallet, go to services and you'll see your panel.

If you open your module, it'll do nothing so let's send some XEM from there!

## III) Writing module core: JavaScript with classes and two-way data binding

Open your controller `src/app/modules/myModule/myModule.controller.js`

In this controller, you can see a simple class with a constructor.

The constructor is called every time you access your module, so there we want to initialize our properties (or variables) that'll be used in the controller and the view. We can also use class methods, but we'll see that later.

Let's look at its content and start adding things into it. At first, you see that the constructor can take parameters. It is the `services` that we want to `inject`. If you want to add a service from our services folder or an angular service like `$q`, `$timeout`, etc., you need to call it as a parameter of the constructor and declare it or it can't be used outside of the constructor.

To send transactions we'll need the `Transactions` service, so add it next to the 3 default services in your controller:

```javascript
        // Set services as constructor parameter
        constructor($location, Alert, Wallet, Transactions) {
              'ngInject';

              // Declare services here
              this._location = $location;
              this._Alert = Alert;
              this._Wallet = Wallet;
              this._Transactions = Transactions;

              ....
        }
```

> **Note**: If you never used `this` before, you only need to remember that all variables declared with a `this` can be used anywhere in the controller and the view.

Below services I added a wallet check so nobody can load the module without it

```javascript
    // If no wallet show alert and redirect to home
    if (!this._Wallet.current) {
      this._Alert.noWalletLoaded();
      this._location.path('/');
      return;
    }
```

And then we're going to initialize our properties

```javascript
     /**
     * Default simple transfer properties
     */
      this.formData = {}
      this.formData.recipient = '';
      this.formData.amount = 0;
      this.formData.message = '';
      this.formData.encryptMessage = false;
      this.formData.fee = 0;

      // To store our password and decrypted/generated private key
      this.common = {
        "password": "",
        "privateKey": ""
      }

      // Multisig data, we won't use it but it is needed anyway
      this.formData.innerFee = 0;
      this.formData.isMultisig = false;
      this.formData.multisigAccount = '';

      // Mosaic data, we won't use it but it is needed anyway
      this.formData.mosaics = null;
      this.mosaicsMetaData = null;

      // To lock our send button if a transaction is not finished processing
      this.okPressed = false;
```

Now we have everything needed to build the transaction.

> **Note**: For now you'd have to dig the transaction service or transfer transaction module to know that... I'll work on documentation as soon as possible.

Let's go to our view, open `myModule.html` and create a panel with a form to place our data bindings

```html
    <div class="col-md-6" style="margin-top:10px">
          <div class="panel panel-default">
          <div class="panel-heading" style="background-color: rgb(68, 68, 68); color: white;border-radius: 0px;">
            <i class="fa fa-chevron-right"></i> Send a simple transfer
          </div>
          <div class="panel-body">
          <label>Password</label>
          <br>
          <input type="password" class="form-control" ng-model="$ctrl.common.password"/>
          <br>
          <label>Recipient</label>
          <br>
          <input type="text" class="form-control" ng-model="$ctrl.formData.recipient"/>
          <br>
          <label>Amount</label>
          <br>
          <input type="number" class="form-control" ng-model="$ctrl.formData.amount" min="0" ng-change="$ctrl.updateFee();"/>
          <br>
          <label>Message</label>
          <br>
          <textarea class="form-control" ng-model="$ctrl.formData.message" rows="4" ng-change="$ctrl.updateFee();"></textarea>
          <br>
          <label>Fee</label>
          <br>
          <span>{{ $ctrl.formData.fee / 1000000 }}</span>
          <br>
          <button ng-click="$ctrl.send()" ng-disabled="$ctrl.okPressed">Send</button>
        </div>
      </div>
    </div>
```

Let's analyze this, we have:

```html
    <input type="password" ng-model="$ctrl.common.password"/>
    <input type="text" ng-model="$ctrl.formData.recipient"/>
```

Simple HTML inputs. We use `ng-model` to bind a variable to an element. Note that we use `$ctrl` in the view instead of `this`.

For the amount and message

```html
    <input type="number" ng-model="$ctrl.formData.amount" min="0" ng-change="$ctrl.updateFee();"/>
    <textarea class="form-control" ng-model="$ctrl.formData.message" rows="4" ng-change="$ctrl.updateFee();"></textarea>
```

You can see that we have `ng-change`, it is used to fire a function on `ng-model` value changes.

For the fee we use `{{ $ctrl.formData.fee / 1000000 }}`, curly brackets are needed if the variable is used outside of the angular scope, you can do basic operations on the variables like dividing by 1000000 as I do.

> **Note**: If you look closely you see that ng-change (part of angular) doesn't need those brackets but a placeholder element will need it. To illustrate:
>
> ```html
> <input type="text" ng-model="someVar" placeholder="{{ someVar }}" />
> ```

Finally we have:

```html
<button ng-click="$ctrl.send()" ng-disabled="$ctrl.okPressed">Send</button>
```

`ng-click` is for functions that we want to fire on click, and `ng-disabled` will lock the button if `okPressed` is `true`.

> **Note**: While you can only use one variable into `ng-model`, you can use as many functions as you want in `ng-click` and `ng-change`, for example
>
> `ng-click="this.someFunction();this.aBoolean = false;this.anotherFunction();"`
>
> Also, you can set conditions into `ng-disabled`, for example to disable if still processing or if user has not put any password:
>
> `ng-disabled="$ctrl.okPressed || !$ctrl.common.password"`

Let's get further now.  As you can see, we'll use `updateFee()` and `send()` methods so let's write those

Open your controller; our methods must be declared after the constructor

```javascript
    /**
     * updateFee() Update transaction fee
     */
      updateFee() {
        let entity = this._Transactions.prepareTransfer(this.common, this.formData, this.mosaicsMetaData);
        this.formData.fee = entity.fee;
      }
```

Our first method! You can see that there is no parameter into the function, we are using `this` properties directly as it's global.

> **Note**: `let` is almost like `var`, both are global if not in a block, but `var` is scoped to the nearest function block and `let` is scoped to the nearest enclosing block, which can be smaller than a function block.

`prepareTransfer` from the `Transactions` service return the `entity` of our transfer transaction, it contains the fee that interests us. Every time the amount or message will change by user input, the `ng-change` will trigger `updateFee()` and we'll get the actualized fee in our view.

To update the fee at the start of your module you need to call that method into the class constructor.
 Below the `default module properties` you need to add:

```javascript
  this.updateFee();
```

Now for our last method `send()`, we need the `CryptoHelpers` util and for that we are going to use the import feature of ES6:

```javascript
  import CryptoHelpers from '../../utils/CryptoHelpers';
```

This must be set at the top of your controller, before the class. It is then possible to use it anywhere in the controller.

> **Note**: If you want to use an util ***in the view***, you need to declare it in the constructor like services and properties, for example:
>
> ```javascript
>     import someUtil from 'path/to/utils/someUtil';
>
>     class TransferTransactionCtrl {
>       constructor($location, Wallet, Alert, Transactions) {
>             'ngInject';
>
>             // Declare services here
>             this._location = $location;
>             this._Wallet = Wallet;
>             this._Alert = Alert;
>             this._Transactions = Transactions;
>             this._someUtil = someUtil;
>             ....
>       }
>       ...
>     }
> ```
>
> But it is not for our case as `CryptoHelpers` is only needed in the controller.

## IV) Getting user private key and send transactions

`CryptoHelpers` util contains the functions to decrypt/generate the private key of a wallet account and check it's validity

```javascript
    /**
     * send() Build and broadcast the transaction to the network
     */
    send() {
      // Disable send button;
      this.okPressed = true;

      // Decrypt/generate private key and check it. Returned private key is contained into this.common
      if (!CryptoHelpers.passwordToPrivatekeyClear(this.common, this._Wallet.currentAccount, this._Wallet.algo, true)) {
        this._Alert.invalidPassword();
        // Enable send button
        this.okPressed = false;
        return;
      } else if (!CryptoHelpers.checkAddress(this.common.privateKey, this._Wallet.network, this._Wallet.currentAccount.address)) {
        this._Alert.invalidPassword();
        // Enable send button
        this.okPressed = false;
        return;
      }

      .....
    }
```

The above will use user password to get his private key.  Then it'll check that the returned private key (in `this.common`) generates the same address as his current account address stored in the wallet service. Otherwise, in the case of brain wallets, it'd generate an invalid private key if the password is wrong.

The second part of the method is building the `entity` (like in `updateFee()`) and use the `Transactions` service to serialize and announce the transaction.

```javascript
    /**
     * send() Build and broadcast the transaction to the network
     */
    send() {
      // Disable send button;
      this.okPressed = true;

      // Decrypt/generate private key and check it. Returned private key is contained into this.common
      if (!CryptoHelpers.passwordToPrivatekeyClear(this.common, this._Wallet.currentAccount, this._Wallet.algo, true)) {
        this._Alert.invalidPassword();
        // Enable send button
        this.okPressed = false;
        return;
      } else if (!CryptoHelpers.checkAddress(this.common.privateKey, this._Wallet.network, this._Wallet.currentAccount.address)) {
        this._Alert.invalidPassword();
        // Enable send button
        this.okPressed = false;
        return;
      }

      // Build the entity to serialize
      let entity = this._Transactions.prepareTransfer(this.common, this.formData, this.mosaicsMetaData);

      // Construct transaction byte array, sign and broadcast it to the network
      return this._Transactions.serializeAndAnnounceTransaction(entity, this.common).then((res) => {
        // Check status
        if (res.status === 200) {
          // If code >= 2, it's an error
          if (res.data.code >= 2) {
            this._Alert.transactionError(res.data.message);
          } else {
            this._Alert.transactionSuccess();
          }
        }
        // Enable send button
        this.okPressed = false;
        // Delete private key in common
        this.common.privateKey = '';
      },
      (err) => {
        // Delete private key in common
        this.common.privateKey = '';
        // Enable send button
        this.okPressed = false;
        this._Alert.transactionError('Failed ' + err.data.error + " " + err.data.message);
      });
    }
```

We pass the `entity` (transaction object) and `this.common` (containing the private key) in `serializeAndAnnounceTransaction`, the method of the `Transactions` service. It'll serialize the transaction object, sign it and broadcast it to the network.

After it is sent, we receive data in the callback, and we simply analyze it to know the result, then we clean sensitive data.

Now you have both needed methods, that's it. Use `gulp` to build and try your module with a testnet wallet, it should send transactions!

Feel free to play with this example, add methods, inject services, import utils and try functions it contains.... I am going to work on a detailed documentation to help you.
{% endraw %}

Not everyone wants to understand the REST HTTPS protocol in use, and even those who do don't want to have to manually handle HTTP requests when trying to implement high level business logic. Therefore client side sdks exist which handle making requests of the CRM server, which in turns handles querying the database(s) and any processing. Client SDKs exist for Javascript, python and PHP. The API for each SDK is almost the same; adjusted only slightly to account for different language feature sets and styles.

### Getting Started

#### Javascript

    <script type="text/javascript" src="unitix.js"></script>

This creates the javascript object `MERCHI`, which packages all the functionality of the CRM API.

#### Python

use the `unitix` package and import classes from modules as needed. For example:

    from unitix.users import Users

#### PHP

**this section is yet to be written**


### Creating a new Entity

Let's say we want to create a new User in the CRM. We may do so as follows:

#### Javascript

    var user = new MERCHI.User();

At this point we have a javascript object representing a user, but it does not yet exist on the server. We may first some parameters of the user as follows:

    user.name('fred');
    user.passsword('fredrules');
    user.email('fred@hotmail.com');

This illustrates one of the conventions used in the MERCHI module: calling 'setter' methods with an argument will set that parameter and return the modified object. For example `user.name('fred')` sets the users name to fred and evaluates to the user object. 

Calling the getter method without an argument returns the value of that parameter. For example `user.name()` will now evaluate to `"fred"`.

We may now ask the server to create the entry. This will try to send a HTTPS request:

    function onCreated (user) {
        console.log('Created a new user with id ', user.id());
    }

    function onError (e) {
        console.log("Could not create new user: ', e.message);
    }

    user.create(onCreated, onError);

The request happens asynchronously. That is, the call to user.create() does not block and wait for the user to be created, but rather, returns immediately so that you may perform other processing and not hang the page. Later, when server confirms that the user was created, onCreated will be called so that you may handle the creation event. 

Since user.create() has already returned by the time we get a response, it is difficult for it to throw an exception. Therefore if an error is detected, the onError continuation is called to report the error instead.

#### Python

**this section is yet to be written**

#### PHP

**this section is yet to be written**

### Getting a list of entities

#### Javascript

    var users = MERCHI.users.get();

`users` is now an array of `MERCHI.User` objects.

#### Python 
**this section is yet top be written**

#### PHP
** this section is yet to be written**

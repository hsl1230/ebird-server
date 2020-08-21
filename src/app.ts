import express from 'express';
import bodyParser from 'body-parser';
import lodash from 'lodash';
import { Customer } from './models/customer';
import ShippingOrder, { ShippingOrders } from './models/shipping-order';
import TargetAddress, { TargetAddresses } from './models/target-address';

const app = express();
var router = express.Router();

// for forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

/**

Next we need to define our API end points - we need to be able to perform basic CRUD operations on the following resources: `users`, `categories`, and `posts`.


### Users

 - `GET    /users`    - fetch all users
 - `POST   /user`     - create a new user
 - `GET    /user/:id` - fetch a single user
 - `PUT    /user/:id` - update user
 - `DELETE /user/:id` - delete user


 - `PUT    /category/:id` - update category
 - `DELETE /category/:id` - delete category


### Posts

 - `GET    /posts`    - fetch all posts
 - `POST   /post`     - create a new post
 - `GET    /post/:id` - fetch a single post
 - `PUT    /post/:id` - update post
 - `DELETE /post/:id` - delete post

 - `GET    /posts/category/:id` - fetch all posts from a single category
 - `GET    /posts/tags/:slug`   - fetch all posts from a single tag us


All is set, now we can go ahead and start setting up our api routes. First up we'll create a users route, every post created will require a user.
**/


router.route('/customers')
  // create a customer
  .post(function (req, res) {
    Customer.forge<Customer>({
      name: req.body.name,
      email: req.body.email
    })
    .save()
    .then(function (customer) {
      res.json({error: false, data: {id: customer.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
  });

router.route('/customers/:id')
  // fetch customer
  .get(function (req, res) {
    Customer.forge<Customer>({id: req.params.id})
    .fetch()
    .then(function (customer) {
      if (!customer) {
        res.status(404).json({error: true, data: {error: 'consumer not found!'}});
      }
      else {
        res.json({error: false, data: customer.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // update customer details
  .put(function (req, res) {
    Customer.forge<Customer>({id: req.params.id})
    .fetch({require: true})
    .then(function (customer) {
      customer.save({
        name: req.body.name || customer.get('name'),
        email: req.body.email || customer.get('email')
      })
      .then(function () {
        res.json({error: false, data: {message: 'User details updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // delete a customer
  .delete(function (req, res) {
    Customer.forge<Customer>({id: req.params.id})
    .fetch({require: true})
    .then(function (customer) {
      customer.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'User successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });


router.route('/customers/:id/shipping-orders')
  // fetch all shipping-orders
  .get(function (req, res) {
    ShippingOrders.forge<ShippingOrders>({customer_id: req.params.id})
    .fetch()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // create a new category
  .post(function (req, res) {
    ShippingOrder.forge<ShippingOrder>({name: req.body.name})
    .save()
    .then(function (shippingOrder) {
      res.json({error: false, data: {id: shippingOrder.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
  });

router.route('/customers/:customer_id/shipping-orders/:order_id')
  // fetch a shipping-order
  .get(function (req, res) {
    ShippingOrder.forge<ShippingOrder>({id: req.params.order_id, customer_id: req.params.customer_id})
    .fetch()
    .then(function (shippingOrder) {
      if(!shippingOrder) {
        res.status(404).json({error: true, data: {}});
      }
      else {
        res.json({error: false, data: shippingOrder.toJSON()});
      }
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })   

  // update a category
  .put(function (req, res) {
    ShippingOrder.forge<ShippingOrder>({id: req.params.id})
    .fetch({require: true})
    .then(function (shippingOrder) {
      shippingOrder.save({name: req.body.name || shippingOrder.get('name')})
      .then(function () {
        res.json({error: false, data: {message: 'shippingOrder updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

  // delete a category
  .delete(function (req, res) {
    ShippingOrder.forge<ShippingOrder>({id: req.params.id})
    .fetch({require: true})
    .then(function (shippingOrder) {
      shippingOrder.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'shippingOrder successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

router.route('/customers/:id/target-addresses')
  // fetch all posts
  .get(function (req, res) {
    TargetAddresses.forge<TargetAddresses>({customer_id: req.params.id})
    .fetch()
    .then(function (collection) {
      res.json({error: false, data: collection.toJSON()});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })
  .post(function (req, res) {
    TargetAddress.forge<TargetAddress>({
      customer_id: req.params.id,
      address: req.body.address
    })
    .save()
    .then(function (targetAddress) {
      res.json({error: false, data: {id: targetAddress.get('id')}});
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    }); 
  });


router.route('/customers/:id/target-addresses/:address_id')
  // fetch a post by id
  .delete(function (req, res) {
    TargetAddress.forge<TargetAddress>({customer_id: req.params.id, id: req.params.address_id})
    .fetch({require: true})
    .then(function (targetAddress) {
      targetAddress.destroy()
      .then(function () {
        res.json({error: true, data: {message: 'targetAddress successfully deleted'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  });

app.use('/api', router);

app.listen(3002, function() {
  console.log("✔ Express server listening on port %d in %s mode", 3002, app.get('env'));
});

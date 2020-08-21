var Schema = {
  customers: {
    id: {type: 'bigIncrements', nullable: false, primary: true},
    email: {type: 'string', maxlength: 254, nullable: false, unique: true},
    name: {type: 'string', maxlength: 150, nullable: false}
  },

  shipping_orders: {
    id: {type: 'bigIncrements', nullable: false, primary: true},
    customer_id: {type: 'bigInteger', nullable: false, unsigned: true},
    from_address: {type: 'string', maxlength: 250, nullable: false},
    to_address: {type: 'string', maxlength: 250, nullable: false},
    from_latitude: {type: 'double', nullable: false, unsigned: false},
    from_longitude: {type: 'double', nullable: false, unsigned: false},
    to_latitude: {type: 'double', nullable: false, unsigned: false},
    to_longitude: {type: 'double', nullable: false, unsigned: false},    
    name:  {type: 'string', maxlength: 100, nullable: false},
    length:  {type: 'double', nullable: false, unsigned: true},
    width:  {type: 'double', nullable: false, unsigned: true},
    height:  {type: 'double', nullable: false, unsigned: true},
    weight: {type: 'double', nullable: false, unsigned: true},
    value: {type: 'double', nullable: true, unsigned: true},
    deliver_fee:  {type: 'double', nullable: true, unsigned: true},
    status: {type: 'enum', nullable: false, values: ['created', 'taken', 'cancelled', 'processing', 'finished']},
    index: [
      {columns: ['from_latitude', 'from_longitude']},
      {columns: ['customer_id']}
    ]
  },

  holding_orders: {
    customer_id: {type: 'bigInteger', nullable: false, unsigned: true},
    shipping_order_id: {type: 'bigInteger', nullable: false, unsigned: true},
    primary: {columns: ['customer_id', 'shipping_order_id']}
  },

  target_adresses: {
    id: {type: 'bigIncrements', nullable: false, primary: true},
    customer_id: {type: 'bigInteger', nullable: false, unsigned: true},
    address: {type: 'string', maxlength: 250, nullable: false},
    index: [{columns: ['customer_id']}]
  }
};


module.exports = Schema;
const {Router} = require('express');
const pool = require('../db');
const { getOrder, 
        getUser, 
        getAllOrders, 
        getAllOrdersAlmacen, 
        acceptOrder, 
        denyOrder, 
        atendOrder, 
        getProduct, 
        shipOrder, 
        getAllOrdersRepartidor, 
        getAllProducts, 
        putSendOrder, 
        putSendDetailOrder, 
        addProduct, 
        getAllSucursales,
        getAllProductsStock,
        getAllUsers  } = require('../controllers/tasks.controllers')
//const { getAllOrders } = require('../controllers/tasks.controllers')

const router = Router();

router.get('/user/:usuario/:contrasena', getUser)
router.get('/allsucursales', getAllSucursales)
router.get('/allusers', getAllUsers)
router.get('/allproductstock', getAllProductsStock)
router.get('/allorders', getAllOrders)
router.get('/allordersalmacen', getAllOrdersAlmacen)
router.get('/allordersrepartidor', getAllOrdersRepartidor)
router.get('/allproducts', getAllProducts)
router.get('/order/:id', getOrder)
router.get('/product/:id', getProduct)
router.get('/acceptorder/:id', acceptOrder)
router.get('/denyorder/:id', denyOrder)
router.get('/atendorder/:id', atendOrder)
router.get('/shiporder/:id', shipOrder)
router.get('/putorder/:idproducto/:cantidad/:sucursal', putSendOrder)
router.get('/putdetailorder/:idOrden/:idProducto/:cantidad/:sucursal', putSendDetailOrder)
router.get('/addProduct/:nombre/:precio/:stock', addProduct)

router.get('/ordsser/:id', (req,res) => {
    res.send("retorna una sola tarea");
})

router.post('/task', (req,res) => {
    res.send("creando una nueva tarea");
})

router.delete('/task', (req,res) => {
    res.send("eliminando una tarea");
})

router.put('/task', (req,res) => {
    res.send("actualizando una tarea");
})

module.exports = router;
const pool = require('../db')

const getUser = async (req,res,next) => {
    try{
    const {usuario, contrasena} = req.params;
    const signin = await pool.query("SELECT id_sucursal, nombre_sucursal, direccion_sucursal, telefono_sucursal, usuario_sucursal, contrasena_sucursal, descripcion FROM public.sucursales INNER JOIN tipo_usuario ON id_tipo_usuario_sucursal = id_tipo_usuario where usuario_sucursal = $1 and contrasena_sucursal = $2",[usuario, contrasena]);
    console.log(signin);
    if (signin.rows.length === 0) return res.status(404).json({
        message: 'Usuario y/o contraseña incorrecta',
    });
    return res.json(signin.rows[0]);
    }catch(error){
        next(error);
    }
}

const addProduct = async (req,res,next) => {
    try{
    const {nombre, precio, stock} = req.params;
    console.log(nombre, precio, stock)

    const productoAgregado = await pool.query("INSERT INTO public.producto (nombre_producto, precio_producto) VALUES ($1, $2) RETURNING id_producto",[nombre, precio]);
    //console.log(productoAgregado.rows[0].id_producto)
    await pool.query("INSERT INTO public.stock_product (id_product_stock, stock_product, fecha_actualizacion_stock) VALUES ($1, $2, CURRENT_DATE)",[productoAgregado.rows[0].id_producto, stock]);
    if (productoAgregado.rows.length === 0) return res.status(404).json({
        message: 'Error en agregar producto',
    });
    //console.log(ordenGenerada.rows[0].id_orden)
    return res.json(ordenGenerada.rows[0].id_orden);
    }catch(error){
        next(error);
    }
}

const putSendOrder = async (req,res,next) => {
    try{
    const {idproducto,cantidad,sucursal} = req.params;
    //console.log(req.params)
    //console.log(idproducto,cantidad,sucursal)
    /*let newArray = orders.map((item) => {
        //console.log(allProducts)
        console.log(item.key, item.value)
        return (item.key, item.value)
      })*/
    //const signin = await pool.query("SELECT id_sucursal, nombre_sucursal, direccion_sucursal, telefono_sucursal, usuario_sucursal, contrasena_sucursal, descripcion FROM public.sucursales INNER JOIN tipo_usuario ON id_tipo_usuario_sucursal = id_tipo_usuario where usuario_sucursal = $1 and contrasena_sucursal = $2",[usuario, contrasena]);
    //console.log(signin);
    //if (signin.rows.length === 0) return res.status(404).json({
    //    message: 'Error Orden Vacia',
    //});
    //return res.json(signin.rows[0]);
    const ordenGenerada = await pool.query("INSERT INTO public.orden (fecha_orden, id_sucursal_orden, id_estado_orden ) VALUES (current_timestamp, $1, 1) RETURNING id_orden",[sucursal]);
    if (ordenGenerada.rows.length === 0) return res.status(404).json({
        message: 'Error en generar orden',
    });
    //console.log(ordenGenerada.rows[0].id_orden)
    return res.json(ordenGenerada.rows[0].id_orden);
    }catch(error){
        next(error);
    }
}

const putSendDetailOrder = async (req,res,next) => {
    try{
    const {idOrden,idProducto,cantidad,sucursal} = req.params;
    //console.log(idOrden,idProducto,cantidad,sucursal)

    //console.log(req.params)
    //console.log(req.params)
    //console.log(idproducto,idProducto,cantidad)
    /*let newArray = orders.map((item) => {
        //console.log(allProducts)
        console.log(item.key, item.value)
        return (item.key, item.value)
      })*/
    //const signin = await pool.query("SELECT id_sucursal, nombre_sucursal, direccion_sucursal, telefono_sucursal, usuario_sucursal, contrasena_sucursal, descripcion FROM public.sucursales INNER JOIN tipo_usuario ON id_tipo_usuario_sucursal = id_tipo_usuario where usuario_sucursal = $1 and contrasena_sucursal = $2",[usuario, contrasena]);
    //console.log(signin);
    //if (signin.rows.length === 0) return res.status(404).json({
    //    message: 'Error Orden Vacia',
    //});
    //return res.json(signin.rows[0]);
    await pool.query("INSERT INTO public.detalle_orden (id_orden_detalle, id_producto_detalle, cantidad_producto, subtotal_producto) VALUES ($1, $2, $3, 0) RETURNING cantidad_producto;",[idOrden,idProducto,cantidad]);
    const currentStock = await pool.query("SELECT stock_product FROM public.stock_product WHERE id_product_stock = $1",[idProducto]);
    console.log(currentStock.rows[0].stock_product)
    let updateStock = currentStock.rows[0].stock_product - cantidad
    console.log(updateStock)
    await pool.query("UPDATE stock_product SET stock_product = $1, fecha_actualizacion_stock = CURRENT_DATE WHERE id_product_stock = $2",[updateStock,idProducto]);
    return res.send("Detalle Orden Realizada con Exito");
    }catch(error){
        next(error);
    }
}

const getAllOrders = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden, nombre_sucursal, estado FROM public.orden INNER JOIN sucursales ON id_sucursal_orden = id_sucursal INNER JOIN estado_orden ON id_estado_orden = id_estado WHERE id_estado_orden != 4 AND id_estado_orden != 5 ORDER BY id_orden");
    if (allOrders.rows.length === 0) return res.status(404).json({
        message: 'No existen pedidos para la sucursal',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allOrders.rows);
    }catch(error){
        next(error);
    }
}

const getAllUsers = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allOrders = await pool.query("SELECT * FROM public.sucursales INNER JOIN public.tipo_usuario ON id_tipo_usuario_sucursal = id_tipo_usuario");
    if (allOrders.rows.length === 0) return res.status(404).json({
        message: 'No existen usuarios',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allOrders.rows);
    }catch(error){
        next(error);
    }
}

const getAllSucursales = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allSucursales = await pool.query("SELECT * FROM public.sucursales");
    if (allSucursales.rows.length === 0) return res.status(404).json({
        message: 'No existen sucursales',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allSucursales.rows);
    }catch(error){
        next(error);
    }
}

const getAllProductsStock = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allSucursales = await pool.query("SELECT * FROM public.producto INNER JOIN public.stock_product ON id_producto = id_product_stock ORDER BY id_producto");
    if (allSucursales.rows.length === 0) return res.status(404).json({
        message: 'No existen productos',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allSucursales.rows);
    }catch(error){
        next(error);
    }
}

const getAllOrdersAlmacen = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden, nombre_sucursal, id_estado, estado FROM public.orden INNER JOIN sucursales ON id_sucursal_orden = id_sucursal INNER JOIN estado_orden ON id_estado_orden = id_estado WHERE id_estado = 1 ORDER BY id_orden");
    if (allOrders.rows.length === 0) return res.status(404).json({
        message: 'No existen solicitudes de pedidos para el Almacen',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allOrders.rows);
    }catch(error){
        next(error);
    }
}

const getAllOrdersRepartidor = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden, nombre_sucursal, id_estado, estado FROM public.orden INNER JOIN sucursales ON id_sucursal_orden = id_sucursal INNER JOIN estado_orden ON id_estado_orden = id_estado WHERE id_estado = 3 ORDER BY id_orden");
    if (allOrders.rows.length === 0) return res.status(404).json({
        message: 'No existen pedidos en tránsito',
    });
    //console.log(res.json(allOrders.rows[0]))
    //return res.json([allOrders])
    //return res.json(allOrders.rows[0]);
    //console.log(allOrders)
    return res.json(allOrders.rows);
    }catch(error){
        next(error);
    }
}

const getAllProducts = async (req,res,next) => {
    try{
    //const allOrders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_estado_orden FROM public.orden");
    const allOrders = await pool.query("SELECT * FROM public.producto");
    if (allOrders.rows.length === 0) return res.status(404).json({
        message: 'No existen productos',
    });
    //console.log(allOrders)
    return res.json(allOrders.rows);
    }catch(error){
        next(error);
    }
}

const getOrder = async (req,res,next) => {
    try{
    const { id } = req.params;
    console.log(id)
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden FROM public.orden where id_orden = $1",[id]);
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, nombre_sucursal FROM public.orden INNER JOIN public.sucursales ON id_sucursal_orden = id_sucursal where id_orden = $1",[id]);
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_producto_detalle, cantidad_producto, nombre_producto, nombre_sucursal from public.orden INNER JOIN public.detalle_orden ON id_orden_detalle = id_orden INNER JOIN public.producto ON id_producto_detalle = id_producto INNER JOIN public.sucursales ON id_sucursal_orden = id_sucursal where id_orden = $1",[id]);
    const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_producto_detalle, cantidad_producto, nombre_producto, nombre_sucursal from public.orden INNER JOIN public.detalle_orden ON id_orden_detalle = id_orden INNER JOIN public.producto ON id_producto_detalle = id_producto INNER JOIN public.sucursales ON id_sucursal_orden = id_sucursal where id_orden = $1",[id]);
    //console.log(Orders)
    if (Orders.rows.length === 0) return res.status(404).json({
        message: 'No existe pedido',
    });
    //return res.json(Orders.rows[0]);
    return res.json(Orders.rows);
    }catch(error){
        console.log('entro catch backend')
        next(error);
    }
}

const getProduct = async (req,res,next) => {
    try{
    const { id } = req.params;
    console.log(id)
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden FROM public.orden where id_orden = $1",[id]);
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, nombre_sucursal FROM public.orden INNER JOIN public.sucursales ON id_sucursal_orden = id_sucursal where id_orden = $1",[id]);
    //const Orders = await pool.query("SELECT id_orden, fecha_orden, id_sucursal_orden, id_producto_detalle, cantidad_producto, nombre_producto, nombre_sucursal from public.orden INNER JOIN public.detalle_orden ON id_orden_detalle = id_orden INNER JOIN public.producto ON id_producto_detalle = id_producto INNER JOIN public.sucursales ON id_sucursal_orden = id_sucursal where id_orden = $1",[id]);
    const Orders = await pool.query("SELECT * FROM public.producto INNER JOIN public.stock_product ON id_producto = id_product_stock WHERE id_producto = $1",[id]);
    //console.log(Orders)
    if (Orders.rows.length === 0) return res.status(404).json({
        message: 'No existe producto',
    });
    //return res.json(Orders.rows[0]);
    return res.json(Orders.rows);
    }catch(error){
        console.log('entro catch backend')
        next(error);
    }
}


const acceptOrder = async (req,res,next) => {
    try{
    const { id }  = req.params;
    console.log(req.params) 
    await pool.query("UPDATE orden SET id_estado_orden = 4 WHERE id_orden = $1",[id]);
    //console.log(or)
    return res.send("Aceptado");
    //return res.sendStatus(204);
    }catch(error){
        //console.log('entro catch backend')
        next(error);
    }
}

const shipOrder = async (req,res,next) => {
    try{
    const { id }  = req.params;
    console.log(req.params) 
    await pool.query("UPDATE orden SET id_estado_orden = 3 WHERE id_orden = $1",[id]);
    //console.log(or)
    return res.send("En Ruta");
    //return res.sendStatus(204);
    }catch(error){
        //console.log('entro catch backend')
        next(error);
    }
}

const atendOrder = async (req,res,next) => {
    try{
    const { id }  = req.params;
    console.log(req.params) 
    await pool.query("UPDATE orden SET id_estado_orden = 2 WHERE id_orden = $1",[id]);
    //console.log(or)
    return res.send("Atendido");
    //return res.sendStatus(204);
    }catch(error){
        //console.log('entro catch backend')
        next(error);
    }
}

const denyOrder = async (req,res,next) => {
    try{
    const { id }  = req.params;
    console.log(req.params) 
    await pool.query("UPDATE orden SET id_estado_orden = 5 WHERE id_orden = $1",[id]);
    //console.log(or)
    return res.send("Rechazado");
    //return res.sendStatus(204);
    }catch(error){
        //console.log('entro catch backend')
        next(error);
    }
}


module.exports = {
    getUser,
    getAllOrders,
    getOrder,
    acceptOrder,
    denyOrder,
    getAllOrdersAlmacen,
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
    getAllUsers,
}
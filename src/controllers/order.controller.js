import Order from "../models/order.model.js";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get All Orders
|--------------------------------------------------------------------------
*/

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer", "name email phone")
            .populate("items.product", "name thumbnail price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get Single Order
|--------------------------------------------------------------------------
*/

export const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "name email phone")
            .populate("items.product", "name thumbnail price");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order updated successfully.",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Delete Order
|--------------------------------------------------------------------------
*/

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        await order.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
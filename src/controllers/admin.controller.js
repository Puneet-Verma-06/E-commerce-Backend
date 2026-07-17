import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/*
|--------------------------------------------------------------------------
| Admin Analytics
|--------------------------------------------------------------------------
*/

export const getAnalytics = async (req, res) => {
    try {
        const [
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalProducts,
            ordersByStatus,
            recentOrders,
            topProducts,
            revenueByMonth,
        ] = await Promise.all([
            // Total orders
            Order.countDocuments(),

            // Total revenue from delivered/confirmed orders
            Order.aggregate([
                { $match: { orderStatus: { $in: ["Delivered", "Confirmed", "Shipped", "Processing"] } } },
                { $group: { _id: null, total: { $sum: "$total" } } },
            ]),

            // Total customers
            User.countDocuments({ role: "customer" }),

            // Total products
            Product.countDocuments(),

            // Orders by status
            Order.aggregate([
                { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
            ]),

            // Recent 10 orders
            Order.find()
                .populate("customer", "name email phone")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

            // Top 5 selling products by order count
            Order.aggregate([
                { $unwind: "$items" },
                { $group: { _id: "$items.product", name: { $first: "$items.name" }, totalSold: { $sum: "$items.quantity" }, revenue: { $sum: "$items.total" } } },
                { $sort: { totalSold: -1 } },
                { $limit: 5 },
            ]),

            // Revenue grouped by month (last 6 months)
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
                        orderStatus: { $nin: ["Cancelled"] },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        revenue: { $sum: "$total" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
        ]);

        const statusMap = {};
        ordersByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    totalCustomers,
                    totalProducts,
                    pendingOrders: statusMap["Pending"] || 0,
                    cancelledOrders: statusMap["Cancelled"] || 0,
                },
                ordersByStatus: statusMap,
                recentOrders,
                topProducts,
                revenueByMonth,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/*
|--------------------------------------------------------------------------
| Get All Users (Customers)
|--------------------------------------------------------------------------
*/

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find({ role: "customer" })
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments({ role: "customer" }),
        ]);

        // Attach order count per user
        const userIds = users.map(u => u._id);
        const orderCounts = await Order.aggregate([
            { $match: { customer: { $in: userIds } } },
            { $group: { _id: "$customer", count: { $sum: 1 }, spent: { $sum: "$total" } } },
        ]);
        const orderMap = {};
        orderCounts.forEach(o => { orderMap[o._id.toString()] = { count: o.count, spent: o.spent }; });

        const enriched = users.map(u => ({
            ...u,
            orderCount: orderMap[u._id.toString()]?.count || 0,
            totalSpent: orderMap[u._id.toString()]?.spent || 0,
        }));

        return res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            users: enriched,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/*
|--------------------------------------------------------------------------
| Get Customer Orders (Admin view for a specific customer)
|--------------------------------------------------------------------------
*/

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.params.userId })
            .populate("items.product", "name thumbnail")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

import db from "./db";

export const getOrderById = async (id: string) => {
  const order = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};
export const getOrders = async (storeId: string) => {
  const orders = await db.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};

export const getTotalRevanue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevanue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + Number(item.product.price);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevanue;
};
export const getSalesCount = async (storeId: string) => {
  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};

interface IGraphData {
  name: string;
  total: number;
}
export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevanue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += Number(item.product.price);
    }

    monthlyRevanue[month] = (monthlyRevanue[month] || 0) + revenueForOrder;
  }

  const graphData: IGraphData[] = [
    {
      name: "Jan",
      total: 0,
    },
    {
      name: "Feb",
      total: 0,
    },
    {
      name: "Mar",
      total: 0,
    },
    {
      name: "Apr",
      total: 0,
    },
    {
      name: "May",
      total: 0,
    },
    {
      name: "Jun",
      total: 0,
    },
    {
      name: "Jul",
      total: 0,
    },
    {
      name: "Aug",
      total: 0,
    },
    {
      name: "Sep",
      total: 0,
    },
    {
      name: "Oct",
      total: 0,
    },
    {
      name: "Nov",
      total: 0,
    },
    {
      name: "Dec",
      total: 0,
    },
  ];

  for (const month in monthlyRevanue) {
    graphData[parseInt(month)].total = monthlyRevanue[parseInt(month)];
  }

  return graphData;
};

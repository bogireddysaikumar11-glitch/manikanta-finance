const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Manikanta Finance database...");

  // Clean existing
  await prisma.auditLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.bike.deleteMany();
  await prisma.user.deleteMany();

  // 1. Admin User
  const hashedPassword = await bcrypt.hash("manikanta04", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@manikantafinance.com",
      phone: "9876543210",
      name: "Manikanta Reddy",
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
      twoFactorSecret: "202600",
      twoFactorEnabled: true,
    },
  });
  console.log("Admin user created:", admin.email);

  // 2. Bikes
  const bike1 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0001",
      brand: "Honda",
      model: "Activa 6G Deluxe",
      year: 2022,
      regNo: "AP29BZ4821",
      engineNo: "JF91E8839210",
      chassisNo: "ME4JF9139N829104",
      purchasePrice: 42000,
      repairCost: 3500,
      totalInvestment: 45500,
      expectedSellingPrice: 56000,
      status: "AVAILABLE",
      primaryPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
      sellerName: "Chandraiah G.",
      sellerPhone: "9848123456",
      notes: "Single owner, neat condition, new battery fitted",
    },
  });

  const bike2 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0002",
      brand: "Bajaj",
      model: "Pulsar 150 Twin Disc",
      year: 2021,
      regNo: "TS08EA1945",
      engineNo: "DHGBTC928172",
      chassisNo: "MD2DS150NZ892182",
      purchasePrice: 48000,
      repairCost: 4200,
      totalInvestment: 52200,
      expectedSellingPrice: 64000,
      status: "AVAILABLE",
      primaryPhoto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
      sellerName: "K. Narsimha",
      sellerPhone: "9440987654",
      notes: "Rear tyre replaced, full engine service done",
    },
  });

  const bike3 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0003",
      brand: "Hero",
      model: "Splendor Plus i3S",
      year: 2023,
      regNo: "AP29CD8812",
      engineNo: "HA10EJ882912",
      chassisNo: "MBLHA10EJN829102",
      purchasePrice: 52000,
      repairCost: 1800,
      totalInvestment: 53800,
      expectedSellingPrice: 65000,
      actualSellingPrice: 65000,
      status: "SOLD",
      primaryPhoto: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=600&q=80",
      sellerName: "B. Ramulu",
      sellerPhone: "9123891234",
      notes: "Very high mileage, excellent paint condition",
    },
  });

  const bike4 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0004",
      brand: "TVS",
      model: "Apache RTR 160 4V",
      year: 2022,
      regNo: "TS05FK7102",
      engineNo: "CE4BF9281029",
      chassisNo: "MD625CE4BN829104",
      purchasePrice: 65000,
      repairCost: 6000,
      totalInvestment: 71000,
      expectedSellingPrice: 85000,
      status: "IN_REPAIR",
      primaryPhoto: "https://images.unsplash.com/photo-1571188654248-7a89213915f7?auto=format&fit=crop&w=600&q=80",
      sellerName: "D. Srinivas",
      sellerPhone: "9988112233",
      notes: "Clutch plate and fork oil seal replacement in progress",
    },
  });

  const bike5 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0005",
      brand: "Royal Enfield",
      model: "Classic 350 Stealth Black",
      year: 2021,
      regNo: "AP28DF3390",
      engineNo: "UCE350N829102",
      chassisNo: "ME3UCE350MN829102",
      purchasePrice: 115000,
      repairCost: 7500,
      totalInvestment: 122500,
      expectedSellingPrice: 148000,
      status: "AVAILABLE",
      primaryPhoto: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80",
      sellerName: "M. Rajesh Kumar",
      sellerPhone: "9701234567",
      notes: "Original exhaust, alloys, single owner",
    },
  });

  const bike6 = await prisma.bike.create({
    data: {
      bikeCode: "MF-2026-0006",
      brand: "Yamaha",
      model: "FZ-S V3 FI",
      year: 2021,
      regNo: "TS07GH9021",
      engineNo: "G3J1E8291029",
      chassisNo: "ME1G3J13MN829102",
      purchasePrice: 58000,
      repairCost: 2500,
      totalInvestment: 60500,
      expectedSellingPrice: 72000,
      actualSellingPrice: 72000,
      status: "SOLD",
      primaryPhoto: "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=600&q=80",
      sellerName: "Y. Venkanna",
      sellerPhone: "9391001122",
      notes: "Clean paper transfer done",
    },
  });

  // 3. Customers
  const cust1 = await prisma.customer.create({
    data: {
      name: "K. Suresh Reddy",
      phone: "9848022338",
      alternatePhone: "9440112299",
      aadharNo: "4829-1029-3829",
      address: "H.No 4-12, Sagar Road, Miryalaguda",
      city: "Miryalaguda",
      notes: "Regular customer, runs dairy business",
    },
  });

  const cust2 = await prisma.customer.create({
    data: {
      name: "Md. Ismail Khan",
      phone: "9988776655",
      alternatePhone: "9944332211",
      aadharNo: "7721-9928-1102",
      address: "Clock Tower Center, Nalgonda",
      city: "Nalgonda",
      notes: "Prompt payer, pays via PhonePe/GPay",
    },
  });

  const cust3 = await prisma.customer.create({
    data: {
      name: "P. Venkat Rao",
      phone: "9440112233",
      address: "Main Bazar, Haliya",
      city: "Haliya",
    },
  });

  // 4. Sales
  const sale1 = await prisma.sale.create({
    data: {
      invoiceNo: "INV-2026-0001",
      bikeId: bike3.id,
      customerId: cust1.id,
      saleDate: new Date(),
      agreedPrice: 65000,
      downPayment: 35000,
      pendingAmount: 25000, // 65000 - 35000 - 5000 payment = 25000
      paymentType: "EMI",
      emiMonths: 5,
      emiMonthlyAmount: 5000,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      notes: "5 monthly EMIs of Rs. 5000 due on 10th of every month",
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      invoiceNo: "INV-2026-0002",
      bikeId: bike6.id,
      customerId: cust2.id,
      saleDate: new Date(),
      agreedPrice: 72000,
      downPayment: 50000,
      pendingAmount: 22000,
      paymentType: "EMI",
      emiMonths: 4,
      emiMonthlyAmount: 5500,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
      notes: "Balance 22,000 in 4 EMIs",
    },
  });

  // 5. Payments
  await prisma.payment.create({
    data: {
      receiptNo: "REC-2026-0001",
      saleId: sale1.id,
      customerId: cust1.id,
      amount: 35000,
      paymentDate: new Date(),
      paymentMode: "CASH",
      notes: "Down payment on delivery",
      recordedBy: "Admin",
    },
  });

  await prisma.payment.create({
    data: {
      receiptNo: "REC-2026-0002",
      saleId: sale1.id,
      customerId: cust1.id,
      amount: 5000,
      paymentDate: new Date(),
      paymentMode: "UPI",
      referenceNo: "UPI/62910281920/PhonePe",
      notes: "1st EMI installment advance",
      recordedBy: "Admin",
    },
  });

  await prisma.payment.create({
    data: {
      receiptNo: "REC-2026-0003",
      saleId: sale2.id,
      customerId: cust2.id,
      amount: 50000,
      paymentDate: new Date(),
      paymentMode: "UPI",
      referenceNo: "UPI/82910482910/GPay",
      notes: "Down payment for Yamaha FZ",
      recordedBy: "Admin",
    },
  });

  // 6. Expenses
  await prisma.expense.create({
    data: {
      title: "Shop Rent (Current Month)",
      category: "SHOP_RENT",
      amount: 15000,
      expenseDate: new Date(),
      paymentMode: "UPI",
      notes: "Paid to shop owner Mr. Narayana",
      recordedBy: "Admin",
    },
  });

  await prisma.expense.create({
    data: {
      title: "Mechanic Wages & Service Tools",
      category: "MECHANIC_WAGES",
      amount: 4500,
      expenseDate: new Date(),
      paymentMode: "CASH",
      notes: "Weekly wages for Raju mechanic",
      recordedBy: "Admin",
    },
  });

  await prisma.expense.create({
    data: {
      title: "Splendor Battery & Chain Sprocket",
      category: "REPAIR_PARTS",
      amount: 2800,
      expenseDate: new Date(),
      paymentMode: "CASH",
      bikeId: bike4.id,
      notes: "Exide battery with 2-year warranty card",
      recordedBy: "Admin",
    },
  });

  await prisma.expense.create({
    data: {
      title: "Customer Refreshments / Chai",
      category: "TEA_SNACKS",
      amount: 350,
      expenseDate: new Date(),
      paymentMode: "CASH",
      notes: "Daily tea and snacks for visitors and staff",
      recordedBy: "Admin",
    },
  });

  // 7. Audit Logs
  await prisma.auditLog.create({
    data: {
      entityType: "AUTH",
      entityId: String(admin.id),
      action: "LOGIN",
      performedBy: "Admin",
      description: "Admin logged in with 2FA verification",
      newValue: JSON.stringify({ ip: "127.0.0.1", user: admin.email }),
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "SALE",
      entityId: String(sale1.id),
      action: "CREATE",
      performedBy: "Admin",
      description: "Created sale invoice INV-2026-0001 for Hero Splendor Plus (AP29CD8812)",
      newValue: JSON.stringify({ agreedPrice: 65000, downPayment: 35000, customer: cust1.name }),
    },
  });

  console.log("Database successfully seeded with Manikanta Finance data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

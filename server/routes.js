const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Stripe = require('stripe');
const User = require('./models/user');
const Product = require('./models/product');
const Image = require('./models/image');
const ProductSizes = require('./models/productsizes');
const RentalItems = require('./models/rentalitems');
const Rental = require('./models/rental');
const Cart = require('./models/cart');
const CartItem = require('./models/cartitem');
const ShippingDetails = require('./models/shippingdetails');
const Feedback = require('./models/feedback');

const sendReminderEmail = require('./utils/mailer')
const { sequelize } = require('./db-config');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const stripe = new Stripe(process.env.Stripe_Pssw);

const router = express.Router(); 

//Routes definitions
router.post("/auth", async(req, res) => {
    console.log(req.body);
    console.log(req.body.Email);
    try{
        emailUser = req.body.Email;
        const existingUser = await User.findOne({where:{Email: emailUser}}); //cautam userul in bd daca exista
        if(existingUser){
            return res.status(400).json({message:" Acest email este deja folosit!"});
        }
        //cu criptare parola
        const hashPassword = await bcrypt.hash(req.body.Password, 10);
        const newUser = await User.create({
            UserLastName: req.body.UserLastName,
            UserFirstName: req.body.UserFirstName,
            UserAge: req.body.UserAge,
            Email: req.body.Email,
            Password: hashPassword, 
            UserGender: req.body.UserGender,
            Phone: req.body.Phone,
            Role: "CLIENT"
        });

        res.status(201).json({message: "Utilizatori creat cu succes!"});

    }
    catch(err){
        res.status(500).json({message: "Eroare creare utilizator" + err.message});
    }
});


router.post("/login", async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
    
    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json(
              { message: "Utilizatorul nu există!" });
        }
        const isPssw = await bcrypt.compare(password, user.Password);
        if(!isPssw) {
            return res.status(401).json(
              { message: "Parolă incorectă!" });
        }
  
        const token = jwt.sign(
            { id: user.id, email: user.Email, role: user.Role },
            JWT_SECRET,
            { expiresIn: '2h' } 
        );

        res.status(200).json({ message: "Autentificare reușită!", 
          token, userId : user.UserId, role:user.Role});

    } catch (err) {
        res.status(500).json({ message: "Eroare la autentificare: " + err.message });
    }
});


router.get("/users/:id", async (req, res) => {
  try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "Utilizatorul nu a fost găsit!"});
      }
      res.json(user.dataValues);
  } catch (err) {
      res.status(500).json({ message: "Eroare la preluarea utilizatorului: " + err.message });
  }
});


router.get('/products', async (req, res) => { //preluare toate produsele dupa categorie - gender
    const { category } = req.query;
    try {
      const products = await Product.findAll({
        where: { Category: category },
        include: [
          {
            model: Image, 
            attributes: ['Url'], 
          },
          {
            model: ProductSizes,
            attributes: ['Size', 'Stock']
          }
        ]
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Eroare la preluarea produselor' });
    }
  });

router.get('/productsub', async (req, res) => { 
    const { subcategory } = req.query;
    try {
      const products = await Product.findAll({
        where: { Subcategory: subcategory },
        include: [
          {
            model: Image, 
            attributes: ['Url'], 
          },
          {
            model: ProductSizes,
            attributes: ['Size', 'Stock']
          }
        ]
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Eroare la preluarea produselor' });
    }
  });

router.get('/products/:id', async (req, res) => { //preluare produs dupa id
  const product = await Product.findByPk(req.params.id, {
    include: [Image, ProductSizes]
  });

  if (!product) {
    return res.status(404).json({ message: "Produsul nu a fost găsit." });
  }
  res.json(product);
});

router.get('/rentals/blocked-dates', async (req, res) => { //preluam datele produsului in care acesta e inchiriat
  const { variantId } = req.query;

  try {
    const rentals = await RentalItems.findAll({
      where: {
        SizeId: variantId,
        Status: ['confirmata', 'plasata','la-client','returnata']
      },
      attributes: ['StartDate', 'EndDate']
    });

    const blockedDates = [];

    rentals.forEach(rental => {
      let current = new Date(rental.StartDate);
      const end = new Date(rental.EndDate);

      while (current <= end) {
        blockedDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    res.json(blockedDates);
  } catch (err) {
    res.status(500).json({ error: "Eroare la preluarea datelor ocupate." });
  }
});

router.post("/cart/add", async (req, res) => { //creare cos activ pt utilizator si adaugare produs in cos
  const userId = req.body.UserId;
  const sizeId = req.body.SizeId;
  const startDate = req.body.StartDate;
  const endDate = req.body.EndDate;
  const itemPrice = req.body.ItemPrice;

  try {
     const cart = await Cart.findOne({
      where: { UserId: userId, Status: 'active' }
    });

    if (!cart) {
      cart = await Cart.create({
        UserId: userId,
        Status: 'active',
        CreatedAt: new Date(),
        TotalPrice: 0
      });
    }

    // Adaugă produsul în coș
    await CartItem.create({
      CartId: cart.CartId,
      SizeId: sizeId,
      StartDate: startDate,
      EndDate: endDate,
      ItemPrice: itemPrice 
    });

    res.status(200).json({ message: "Produs adăugat în coș!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la adăugarea în coș." });
  }
});

router.get('/cart/:userId/active', async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { UserId: req.params.userId, Status: 'active' },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: ProductSizes,
              include: [
                {
                  model: Product,
                  include: [Image]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!cart) 
      return res.json({ cartItems: [] });
    
    res.json({ cartItems: cart.CartItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la preluarea coșului." });
  }
});

router.delete('/cart/:itemId', async (req, res) => {
  try {
    await CartItem.destroy({ where: { CartItemId: req.params.itemId } });
    res.json({ message: 'Produs șters cu succes'});
  } catch (err) {
    res.status(500).json({ message: 'Eroare la ștergere' });
  }
});

router.put('/cart/:userId/total', async (req, res) => {
  const { totalPrice } = req.body;
  try {
    const cart = await Cart.findOne({ where: { UserId: req.params.userId } });

    if (!cart) return res.status(404).json({ error: 'Cart inexistent' });

    cart.TotalPrice = totalPrice;
    await cart.save();

    res.json({ message: "Total actualizat cu succes" });
  } catch (error) {
    console.error("Eroare actualizare total:", error);
    res.status(500).json({ error: "Eroare la actualizare total" });
  }
});


//ruta plata stripe - plata card
router.post('/create-checkout-session', async (req, res)=> {
  const { userId, clientData, useSavedAddress } = req.body;

  try {
    const cart = await Cart.findOne({
      where : {UserId : userId, Status: "active"}});
    if (!cart) {
      return res.status(404).json({ error: "Cos de cumparaturi inexistent pentru utilizator." });
    }
    const cartItems = await CartItem.findAll({
      where: { CartId: cart.CartId}, 
      include: [
        {
          model: ProductSizes,
          include: [
            {
              model: Product
            }
          ]
        }
      ]
    });
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "ron",
        product_data: {
          name: item.ProductSize.Product.ProductName,
        },
        unit_amount: Math.round((item.ItemPrice || 0) * 100 
        + (item.ProductSize.Product.Deposit || 0) * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: 'en',
      line_items,
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/declined",
      metadata: {
        userId: userId.toString(),
        useSavedAddress: useSavedAddress ? "true" : "false",
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        street: clientData.street,
        block: clientData.block,
        city: clientData.city,
        postalCode: clientData.postalCode
    },});
      res.json({ url: session.url });
    } catch (err) {
      console.error("Eroare la Stripe:", err);
      res.status(500).json({ error: "Eroare la creare sesiune Stripe" });
    }
  });

//plata card
router.get('/confirm-payment/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Plata nu este finalizată" });
    }

    const userId = session.metadata.userId;

    const cart = await Cart.findOne({ where: { UserId: userId }, include: CartItem });
    if (!cart) return res.status(404).json({ error: "Cart inexistent" });

    //=dacă comanda a fost deja salvată
    const existing = await Rental.findOne({ where: { StripeSessionId: sessionId } });

    if (existing) {
      return res.json({ success: true, message: "Comanda deja procesată." });
    }

    const rental = await Rental.create({
      UserId: userId,
      TotalPrice: cart.TotalPrice,
      CreatedAt: new Date(),
      StripeSessionId: sessionId 
    });

const useSavedAddress = session.metadata.useSavedAddress === "true";

    if (!useSavedAddress) {
      await ShippingDetails.create({
        RentalId: rental.RentalId,
        FirstName: session.metadata.firstName,
        LastName: session.metadata.lastName,
        Email: session.metadata.email,
        Phone: session.metadata.phone,
        Street: session.metadata.street,
        Block: session.metadata.block,
        City: session.metadata.city,
        PostalCode: session.metadata.postalCode
      });
    };

    const cartItems = await CartItem.findAll({
      where: { CartId: cart.CartId },
      include: [{ model: ProductSizes, include: [Product] }]
    });

    for (const item of cartItems) {
      await RentalItems.create({
        RentalId: rental.RentalId,
        SizeId: item.SizeId,
        StartDate: item.StartDate,
        EndDate: item.EndDate,
        Status: "confirmata",
        Price: item.ItemPrice
      });

      const productSize = item.ProductSize;
      productSize.Stock = Math.max(0, productSize.Stock - 1);
      await productSize.save();
    }

    await CartItem.destroy({ where: { CartId: cart.CartId } });

    res.json({ success: true });
  } catch (error) {
    console.error("Eroare confirmare plată:", error);
    res.status(500).json({ error: "Eroare la confirmare plată" });
  }
});

//plata ramburs
router.post('/cash-order', async(req, res) => {
    const { userId, clientData, useSavedAddress } = req.body;

    try {
      const cart = await Cart.findOne({
        where: {UserId: userId, Status:'active'},
        include: [CartItem]
      });


      if(!cart) {
        return res.status(404).json({error: "Coș inexistent"});
      }

      const rental = await Rental.create({
        UserId: userId,
        TotalPrice: cart.TotalPrice,
        CreatedAt: new Date()
      });

      if (!useSavedAddress) {
        await ShippingDetails.create({
          RentalId: rental.RentalId,
          FirstName: clientData.firstName,
          LastName: clientData.lastName,
          Email: clientData.email,
          Phone: clientData.phone,
          Street: clientData.street,
          Block: clientData.block,
          City: clientData.city,
          PostalCode: clientData.postalCode
        });
      }
      
      const cartItems = await CartItem.findAll({
        where: { CartId: cart.CartId },
        include: [{ model: ProductSizes }]
      });

      for (const item of cartItems) {
        await RentalItems.create({
          RentalId: rental.RentalId,
          SizeId: item.SizeId,
          StartDate: item.StartDate,
          EndDate: item.EndDate,
          Status: "confirmata", 
          Price: item.ItemPrice
        });
        
        const productSize = item.ProductSize;
        productSize.Stock = Math.max(0, productSize.Stock - 1);
        await productSize.save();
      }
      await CartItem.destroy({ where: { CartId: cart.CartId } });

      res.json({ success: true, message: "Comandă plasată cu ramburs!" });
    } catch (error) {
      console.error("Eroare finalizare ramburs:", error);
      res.status(500).json({ error: "Eroare la finalizare comandă." });
    }
});

//afisare produse la profil
router.get("/rentals/user/:uid", async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      where: { UserId: req.params.uid },
      include: [
        {
          model: RentalItems,
          include: [{ model: ProductSizes, include: [Product] }]
        }
      ]
    });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: "Eroare la încărcarea comenzilor" });
  }
});

router.get('/shipping/:userId', async (req, res) => {
 try {
    const shippingDetails = await ShippingDetails.findAll({
      include: {
        model: Rental,
        where: { userId: req.params.userId },
        attributes: [] 
      }
    });

    res.json(shippingDetails);
  } catch (err) {
    console.error("Eroare la preluarea adreselor:", err);
    res.status(500).json({ message: "Eroare la preluarea adreselor." });
  }
});


//RUTE PENTRU ADMIN
router.get("/rentals/all", async (req, res) => {
  try {
    const allRentals = await Rental.findAll({
      include: [
        {
          model: RentalItems,
          include: [{ model: ProductSizes, include: [Product] }]
        }
      ],
      order: [['createdAt', 'DESC']] 
    });
    res.json(allRentals);
  } catch (err) {
    res.status(500).json({ error: "Eroare la preluarea tuturor comenzilor" });
  }
});

//schimbare status de admin si returnare garantie
router.put('/rental-item/:id/status', async (req, res) => {
  const { status, refundDeposit, aId } = req.body;
  const itemId = req.params.id;

  try {
    const admin = await User.findByPk(aId);

    const item = await RentalItems.findByPk(itemId, {
      include: [
        {
          model: ProductSizes,
          include: [Product]
        },
        {
          model: Rental,
          include: [User]
        }
      ]
    });

    if (!item) return res.status(404).json({ message: "Item inexistent." });

    item.Status = status;
    await item.save();

    if (refundDeposit === true && status === 'incheiata') {
      const user = item.Rental.User;
      const deposit = item.ProductSize.Product.Deposit;
      const productName = item.ProductSize.Product.ProductName;

      user.Credit = (parseFloat(user.Credit) || 0) + parseFloat(deposit);
      admin.Credit =  (parseFloat(admin.Credit) || 0) + parseFloat(item.Price);
      await user.save();
      await admin.save();

      await sendReminderEmail(
        user.Email,
        '💸 Garanția ți-a fost returnată cu succes',
        `Bună, ${user.UserFirstName}!

          Îți mulțumim că ai ales serviciul nostru de închirieri. 🌟
          Vrem să te informăm că garanția pentru produsul ${productName} a fost returnată cu succes în contul tău.

          Ne bucurăm că ai făcut parte din comunitatea noastră și sperăm să te revedem curând!

         Cu prietenie,
        👜 Echipa RentTheLook`
      );
    }
    if (!refundDeposit && status === 'incheiata') {
      const deposit = item.ProductSize.Product.Deposit;
      const user = item.Rental.User;
      const productName = item.ProductSize.Product.ProductName;
      admin.Credit = (parseFloat(admin.Credit) || 0) + parseFloat(deposit);
      admin.Credit =  (parseFloat(admin.Credit) || 0) + parseFloat(item.Price);
      await admin.save();

    await sendReminderEmail(
        user.Email,
        '⚠️ Informații despre garanția ta',
        `Bună, ${user.UserFirstName}!

      Îți mulțumim pentru închirierea produsului ${productName}.

      După evaluarea returului, am constatat că, din păcate, garanția nu poate fi returnată în acest caz, conform termenilor și condițiilor agreați.

      Dacă ai întrebări sau dorești mai multe detalii, te încurajăm să ne contactezi — suntem aici pentru tine!

      Cu prietenie,
      👜 Echipa RentTheLook`
      );
    }
    if (status === 'incheiata') { //creste stocul inapoi
      const productSize = item.ProductSize;
      productSize.Stock = (parseInt(productSize.Stock) || 0) + 1;
      await productSize.save();
    }

    res.json({ message: "Status actualizat cu succes." });
  } catch (err) {
    console.error("Eroare actualizare status:", err);
    res.status(500).json({ error: "Eroare la actualizarea statusului." });
  }
});


//feedback
router.post("/feedback", async (req, res) => {
  const { userId, sizeId, description, rating } = req.body;

  try {
    const existing = await Feedback.findOne({
      where: {
        UserId: userId,
        SizeId: sizeId
      }
    });

    if (existing) {
      return res.status(409).json({ message: "Feedback deja oferit." });
    }

    const feedback = await Feedback.create({
      UserId: userId,
      SizeId: sizeId,
      FeedbackDescription: description,
      Rating: rating,
    });

    res.status(201).json({ message: "Feedback salvat cu succes", feedback });
  } catch (err) {
    console.error("Eroare la salvare feedback:", err);
    res.status(500).json({ error: "Eroare la salvarea feedback-ului." });
  }
});

router.get('/feedback/product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const feedbacks = await Feedback.findAll({ where : { '$ProductSize.Product.ProductId$': productId},
      include: [
        {
          model: ProductSizes,
          include: {
            model: Product, 
          }
        },
        {
          model: User,
          attributes: ['UserFirstName', 'UserLastName'] 
        }
      ],
      order: [['createdAt', 'DESC']] 
    });

    res.json(feedbacks);
  } catch (err) {
    console.error("Eroare la preluarea feedbackurilor:", err);
    res.status(500).json({ error: "Eroare server la feedbackuri" });
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const rentals = await RentalItems.findAll({
      include: {
        model: ProductSizes,
        include: Product,
      },
    });

    const counts = {};
    rentals.forEach(item => {
      const name = item.ProductSize?.Product?.ProductName || "necunoscut";
      counts[name] = (counts[name] || 0) + 1;
    });

    const topProducts = Object.entries(counts)
      .map(([name, total_sales]) => ({ name, total_sales }))
      .sort((a, b) => b.total_sales - a.total_sales)
      .slice(0, 10);

    res.json(topProducts);
  } catch (err) {
    console.error("Eroare top produse (JS):", err);
    res.status(500).json({ error: "Eroare la calculul top produselor" });
  }
});

router.get("/monthly-sales", async (req, res) => {
  try {
    const items = await RentalItems.findAll({
      attributes: ["StartDate"]
    });

    const monthlySales = {};

    items.forEach(item => {
      const startDate = item.StartDate;
      if (!startDate) return;

      const month = new Date(startDate).toISOString().substring(0, 7); // ex: "2025-07"

      monthlySales[month] = (monthlySales[month] || 0) + 1;
    });

    const result = Object.entries(monthlySales)
      .map(([month, total_rentals]) => ({ month, total_rentals }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (err) {
    console.error("Eroare la vânzări lunare (StartDate):", err);
    res.status(500).json({ error: "Eroare la vânzările lunare" });
  }
});



module.exports = router;


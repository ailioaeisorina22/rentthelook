//main pt  partea de server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./db-config');

require('dotenv').config();
const cron = require('node-cron');
const sendReminderEmail = require('./utils/mailer');
const { Op } = require('sequelize');

const User = require("./models/user");
const Product = require("./models/product");
const Image = require("./models/image");
const ProductSizes = require("./models/productsizes");
const Cart = require("./models/cart");
const CartItem = require("./models/cartitem");
const RentalItems = require("./models/rentalitems");
const Rental = require("./models/rental");
const ShippingDetails = require('./models/shippingdetails');
const Feedback = require('./models/feedback');

const app = express();
app.use(cors());
app.use(express.json());

//imaginile static
app.use('/images', express.static(path.join(__dirname, 'images')));


const routes = require("./routes");
//middleware - generice cu use function sau cele create de noi - rutele
app.use('/api', routes); //rutele sunt adaugate ca middleware in app.js


//BAZA DE DATE 
sequelize.authenticate()
            .then(() => console.log('Conexiunea la MySQL a fost realizată cu succes!'))
            .catch(err => console.error('Eroare la conectare:', err));


sequelize.sync({ force: false })  // Creează tabelele în baza de date
            .then(() => console.log('Modelele au fost sincronizate cu baza de date!'))
            .catch(err => console.error('Eroare la sincronizare:', err));


cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const inTwoDays = new Date(today);
  inTwoDays.setDate(today.getDate() + 2);

  try {
    const items = await RentalItems.findAll({
      where: {
        EndDate: {
          [Op.between]: [today, inTwoDays]
        },
        Status: 'la-client'
      },
      include: [
        {
          model: Rental,
          include: [
            {
              model: User,
              attributes: ['Email', 'UserFirstName']
            }
          ]
        },
        {
          model: ProductSizes,
          include: [{ model: Product, attributes: ['ProductName'] }]
        }
      ]
    });

    for (const item of items) {
      const email = item.Rental.User.Email;
      const name = item.Rental.User.UserFirstName;
      const product = item.ProductSize.Product.ProductName;

      const message = `
        Salut, ${name} 👋

        Îți mulțumim că ai închiriat de la noi produsul ${product}! Sperăm că ți-a fost util și că te-ai bucurat de el. 😊

        Vrem doar să-ți reamintim că perioada de închiriere se apropie de final. Te rugăm să returnezi produsul până la data de **${new Date(item.EndDate).toLocaleDateString()}**.

        Cu prietenie,  
        👜 Echipa RentTheLook
        `;


      await sendReminderEmail(email, '⏰ Returnare apropiată', message);
      console.log(`✅ Email trimis către: ${email}`);
    }

  } catch (err) {
    console.error('❌ Eroare la trimiterea emailurilor:', err);
  }
});



app.listen(8080, () => {console.log("Server is running on port 8080")});
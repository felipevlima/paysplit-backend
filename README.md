# paysplit-backend
PaySplit is an optimized payment gateway on a mobile device that allows you to take a picture of a receipt, and generates a digital version using optical character recognition. The app displays all the items with their amounts. This allows you to select any item to request payment from your contacts, and pay the bill.
***

### Initial Setup
1. Create a .env file
 ```
   ├── .env
   ├── .gitignore
   ├── controllers      
   ├── app.js
   └── ...
   ```

2. Add this to the .env file 
```
PORT=8080
DBUSER=elliotbriant
DBPASSWORD=null
DBPORT=5432
DBHOST=localhost
SECRETKEY=ThisISnoSecret
TAGKEY=8a4d98a0b47311e8b187f3e9d1401099
ACCSID=ACe3a7af00a0de969e0a7b65f3e94de6c1
TWILIOTOKEN=03849300e6186dffc9abfa0bd84a8e3a
PRIVATEPHONE='+14159149382'
DBNAME=paysplit
PDBHOST=ec2-107-20-174-127.compute-1.amazonaws.com
PDBNAME=d13pj0sgm0adkl
PDBUSER=pgxctmmvlgbpoc
PDBPASSWORD=30504d04d5b64eeb31e6ba7b0b3e54ac437765d0840c21c5e288ddd60737c20a
HEROKU_POSTGRES_DB_BLACK=postgres://pgxctmmvlgbpoc:30504d04d5b64eeb31e6ba7b0b3e54ac437765d0840c21c5e288ddd60737c20a@ec2-107-20-174-127.compute-1.amazonaws.com:5432/d13pj0sgm0adkl
``` 
***

### Progress Tracker
- You can find the PaySplit progress tracker [here](https://github.com/BriantOliveira/paysplit-backend/projects/1).
***

### API Documentation
- API documentation is available on our [Wiki](https://github.com/BriantOliveira/paysplit-backend/wiki). 

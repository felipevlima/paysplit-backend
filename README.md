# paysplit-backend
PaySplit is an app that utilizes AI to allow users to create digital copy of given receipt and split and pay a bill via mobile phone.

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
DBUSER=elliotbriant  [Your root name]
DBPASSWORD=password!  [your postgress password]
DBHOST=5432
SECRETKEY=AnythingYouWAnt
TAGKEY=8a4d98a0b47311e8b187f3e9d1401099
ACCSID=AC4ffd6557e35072163d65827155c681dc
TWILIOTOKEN=0a297474985ac9eecd67d203dc345e45
``` 

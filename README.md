![grayscale](https://user-images.githubusercontent.com/24231101/50551161-97218d00-0c31-11e9-8dce-b605afcfe7f7.png)
PaySplit is an optimized payment gateway on a mobile device that allows you to take a picture of a receipt, and generates a digital version using optical character recognition. The app displays all the items with their amounts. This allows you to select any item to request payment from your contacts, and pay the bill.

![desktop](https://user-images.githubusercontent.com/24231101/50551115-06e34800-0c31-11e9-981c-2b32ed2ede0f.png)
![desktop 1](https://user-images.githubusercontent.com/24231101/50551124-28dcca80-0c31-11e9-8760-11deff532c2c.png)

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
DBUSER= <localuser>
DBPASSWORD=null
DBPORT=5432
DBHOST=localhost
SECRETKEY=ThisISnoSecret
``` 
***

### Progress Tracker
- You can find the PaySplit progress tracker here.
  - [MVP](https://github.com/BriantOliveira/paysplit-backend/projects/1)
  - [Version 1.2](https://github.com/BriantOliveira/paysplit-backend/projects/2)
***

### API Documentation
- API documentation is available on our [Wiki](https://github.com/BriantOliveira/paysplit-backend/wiki). 

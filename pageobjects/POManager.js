// Instead of repeatedly creating an object of some page object class in each single test,
// these objects will be created here:
const {LoginPage} = require( './LoginPage');

class POManager
{
    constructor(page)
    {
        this.page= page;
        this.loginPage= new LoginPage(this.page); // and write its import on top 
    }

   getLoginPage()
    {
        return this.loginPage;
    }
   

}
module.exports = { POManager }; //so this class becomes available at the project level (makes .getLoginPage() suggested in tests)
//clog logs information about the incoming HTTP request
const clog = (req, res, next) => {
    const green = '\x1b[32m';
    const blue = '\x1b[34m';
    const red = '\x1b[31m';
    //switch statement based on the req.method 
    switch (req.method) {
      case 'GET': {
        console.info(`${green}${req.method} request to ${req.path}`);
        break;
      }
      case 'POST': {
        console.info(`${blue}${req.method} request to ${req.path}`);
        break;
      }
      case 'DELETE': {
        console.info(`${red}${req.method} request to ${req.path}`);
      }
      default:
        console.log(`${red} request to ${req.path}`);
    }
  
    next();
  };
  
  module.exports = { clog };
  
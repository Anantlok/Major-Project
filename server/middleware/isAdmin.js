const User = require('../models/user');

module.exports = async function(req, res, next) {
  try {
    // We get req.user.id from the first 'auth' middleware
    // which we will add to our routes in the next step.
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
    
    next(); // User is an admin, proceed
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};